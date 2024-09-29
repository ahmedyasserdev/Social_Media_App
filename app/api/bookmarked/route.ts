import { getPostDataInclude } from "@/lib/types";
import  prisma  from "@/lib/prisma";
import { currentUser } from "@/lib/actions/session.actions";
import { NextRequest, NextResponse } from "next/server";
import{PostPage} from '@/lib/types'


export async function GET(req : NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor")  || undefined;
    const pageSize = 10
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

      const bookmarks = await prisma.bookmark.findMany({
        where : {
          userId : user.id 
        },
        include : {
          post : {
            include : getPostDataInclude(user.id as string)
          } ,
        },
        orderBy: {
          createdAt: "desc",
        },
        take  :pageSize + 1,
        cursor : cursor ? { id : cursor } : undefined
      })

   
    const nextCursor = bookmarks.length > pageSize ? bookmarks[pageSize].id : null
    const data : PostPage = {
      posts : bookmarks.slice(0 , pageSize).map((bookmark) => bookmark.post)  ,
      nextCursor
    }


    return NextResponse.json(data);
  } catch (error) {
    console.log( "[GET_FOR_YOU]" , error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
