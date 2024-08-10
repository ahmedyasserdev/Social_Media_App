'use server'
import { loginSchema, LoginValues } from '@/lib/validation';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { signIn } from "@/auth";
import { revalidatePath } from 'next/cache';


export const login = async (values : LoginValues) => {
  const validatedFields = loginSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid fields" };

  const {username , password} = validatedFields.data
  
  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo:  DEFAULT_LOGIN_REDIRECT,
      redirect : false ,
    });

    revalidatePath('/')
    return {success : "Logged in successfully"}
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };

        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}