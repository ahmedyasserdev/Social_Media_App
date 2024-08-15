import { postDataInclude } from "../../../../lib/types";
import  prisma  from "../../../../lib/prisma";
import { currentUser } from "@/lib/actions/session.actions";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: postDataInclude,
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
