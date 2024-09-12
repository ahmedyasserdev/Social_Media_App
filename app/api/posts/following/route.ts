import { getPostDataInclude } from "../../../../lib/types";
import  prisma  from "../../../../lib/prisma";
import { currentUser } from "@/lib/actions/session.actions";
import { NextRequest, NextResponse } from "next/server";
import{PostPage} from '../../../../lib/types'


export async function GET(req : NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor")  || undefined;
    const pageSize = 10
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
        where : {
        user : {
            followers : {
                some : {
                    followerId : user.id
                }
            }
        }
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
    console.log(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
