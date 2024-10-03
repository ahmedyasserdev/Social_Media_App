 import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { CommentsPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req : NextRequest, { params: { postId } }: { params: { postId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const cursor = req.nextUrl.searchParams.get("cursor")  || undefined;
        const pageSize = 10

        const comments = await prisma.comment.findMany({
            where: { postId },
            include: getCommentDataInclude(loggedInUser.id as string),
            orderBy: { createdAt: "asc" },
            take: -pageSize - 1,
            cursor: cursor ? { id: cursor } : undefined,
          });
      
          const previousCursor = comments.length > pageSize ? comments[0].id : null;
      
          const data: CommentsPage = {
            comments: comments.length > pageSize ? comments.slice(1) : comments,
            previousCursor,
          }

            return Response.json(data )
    } catch (error) {
        console.log("[GET_COMMENTS_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}