"use server";
import { signUpSchema, SignUpValues } from "../validation";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import { getUserByEmail, getUserByUsername } from "./user.actions";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";

export const signUp = async (credentials: SignUpValues) => {
    try {
        const validatedFields = signUpSchema.safeParse(credentials);

        if (!validatedFields.success) return { error: "Missing Required Fields" };

        const { email, username, password } = validatedFields.data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return { error: "Email is in use" };
        }

        const existingUserame = await getUserByUsername(username);

        if (existingUserame) return { error: "Username is already taken!" };

        await prisma.user.create({
            data: {
                username,
                displayName: username,
                email,
                password: hashedPassword,
            },
        });

   
        const signInResult = await signIn("credentials", {
           username,
           password ,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
            redirect  : false,
        });

        if (signInResult?.error) {
            return { error: signInResult.error };
        }

        revalidatePath("/");

        return { success: "Account created and signed in successfully" };

    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.log(error);
        return { error: "Something went wrong! Please try again." };
    }
};
