import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
    try {
            const user = await currentUser();
            if (!user) return new Response("Unauthorized", { status: 401 });

            await prisma.notification.updateMany({
                where: {
                    recipientId: user.id,
                    read: false
                },
                data: {
                    read: true
                }
            });

            return new Response();

    } catch (error) {
        console.log("[MARK_AS_READ_PATCH] ", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
  