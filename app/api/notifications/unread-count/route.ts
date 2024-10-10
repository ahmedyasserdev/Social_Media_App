import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";

export async function GET(req: Request) {
    try {
        const user = await currentUser();

        if (!user) return new Response("Unauthorized", { status: 401 });


            const unreadCount = await prisma.notification.count({
                where: {
                    recipientId: user.id,
                    read: false
                }
            })


            const data : NotificationCountInfo = {
                unreadCount : unreadCount
            }



            return Response.json(data)

    }catch (error) {
        console.log( "[NOTIFICATIONS_UNREAD_COUNT_GET] Error" , error)
        return new Response("Internal Server Error", { status: 500 });
    }
}