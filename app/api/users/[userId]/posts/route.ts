import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { getPostDataInclude, PostPage } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET (req : NextRequest , { params : { userId } } : { params : { userId : string } } ) {
    try {
        const cursor = req.nextUrl.searchParams.get("cursor")  || undefined;
        const pageSize = 10
        const user = await currentUser();
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    
        const posts = await prisma.post.findMany({
          where: {
              userId ,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: getPostDataInclude(user.id as string),
          take  :pageSize + 1,
          cursor : cursor ? { id : cursor } : undefined
        });
    
        const nextCursor = posts.length > pageSize ? posts[pageSize].id : null
    
        const data : PostPage = {
          posts : posts.slice(0 , pageSize)  ,
          nextCursor
        }
    
        return NextResponse.json(data);
      } catch (error) {
        return Response.json({ error: "Something went wrong" }, { status: 500 });
        console.log("[GET_USERID_POSTS]", error);
    }
}