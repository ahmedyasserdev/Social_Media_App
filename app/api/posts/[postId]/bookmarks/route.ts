import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { BookmarkInfo, } from "@/lib/types";

export async function GET(req: Request, { params: { postId } }: { params: { postId: string } }) {

    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const bookmark = await prisma.bookmark.findUnique({
            where: {
              userId_postId: {
                postId,
                userId: loggedInUser.id as string
              }
            },
            

        });

        if (!bookmark) return Response.json({ error: "Bookmark not found" }, { status: 404 });

        const data: BookmarkInfo = {
            isBookmarkedByUser: !!bookmark
        }

        return Response.json(data)
    } catch (error) {
        console.log("[GET_BOOKMAKRS_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }

}


export async function POST(req: Request, { params: { postId } }: { params: { postId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        await prisma.bookmark.upsert({
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
        console.log("[POST_BOOKMARK_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function DELETE(req: Request, { params: { postId } }: { params: { postId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });
        await prisma.bookmark.deleteMany({
            where: {
                userId: loggedInUser.id as string,
                postId
            }
        })
        return new Response()
    } catch (error) {
        console.log("[DELETE_BOOKMARK_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }


}