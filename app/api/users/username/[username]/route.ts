import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export async function GET(req: Request, { params: { username } }: { params: { username: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: "insensitive"
                },
            },
            select: getUserDataSelect(loggedInUser.id as string)
        });

        if (!user) return Response.json({ error: "User not found" }, { status: 404 });

        return Response.json(user)



    } catch (error) {
        console.log("[GET_USERNAME]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 })
    }
}