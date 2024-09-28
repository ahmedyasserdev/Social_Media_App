import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { LikeInfo } from "@/lib/types";

export async function GET(req: Request, { params: { postId } }: { params: { postId: string } }) {

    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const post = await prisma.post.findUnique({
            where: {
                id: postId,
            },
            select: {
                likes: {
                    where: {
                        userId: loggedInUser.id
                    },
                    select: {
                        userId: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                    }
                }
            },

        });

        if (!post) return Response.json({ error: "Post not found" }, { status: 404 });


        const data: LikeInfo = {
            isLikedByUser: !!post.likes.length,
            likes: post._count.likes,
        }


        return Response.json(data)
    } catch (error) {
        console.log("[GET_LIKES_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }

}


export async function POST(req: Request, { params: { postId } }: { params: { postId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        await prisma.like.upsert({
            where: {
                userId_postId: {
                    postId,
                    userId: loggedInUser.id as string
                }
            },
            create: {
                userId: loggedInUser.id as string,
                postId,
            },
            update: {}

        })
        return new Response()
    } catch (error) {
        console.log("[POST_LIKES_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function DELETE(req: Request, { params: { postId } }: { params: { postId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });
        await prisma.like.deleteMany({
            where: {
                userId: loggedInUser.id as string,
                postId
            }
        })
        return new Response()
    } catch (error) {
        console.log("[DELETE_LIKES_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }


}