import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { notificationsInclude, NotificationsPage } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
        const pageSize = 10
        const user = await currentUser();
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const notifications = await prisma.notification.findMany({
            where : {
                recipientId : user.id as string ,
            },
            include : notificationsInclude,
            orderBy : {createdAt : "desc"},
            take : pageSize + 1,
            cursor : cursor? {id : cursor} : undefined
        })

        const nextCursor = notifications.length > pageSize ? notifications[pageSize].id : null


        const data : NotificationsPage= {
            notifications : notifications.slice(0 , pageSize),
            nextCursor
        };

    return Response.json(data);

    } catch (error) {
        console.log("[GET_NOTIFICATIONS]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }



}