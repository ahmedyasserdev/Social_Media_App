import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { FollowerInfo } from "@/lib/types";

export async function GET(req: Request, { params: { userId } }: { params: { userId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: userId },

            select: {
                followers: {
                    where: {
                        id: loggedInUser.id
                    },
                    select: {
                        followerId: true
                    }
                },
                _count: {
                    select: {
                        followers: true
                    }
                }
            }

        })


        if (!user) return Response.json({ error: "User not found" }, { status: 404 });


        const data: FollowerInfo = {
            followers: user._count.followers,
            isFollowedByUser: !!user.followers.length
        };

        return Response.json(data);

    } catch (error) {
        console.log("[GET_FOLLOWERS_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
};




export async function POST(req: Request, { params: { userId } }: { params: { userId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

        await prisma.follow.upsert({
            where: {
                followerId_followingId: {
                    followerId: loggedInUser.id as string,
                    followingId: userId
                }
            },
            create: {
                followerId: loggedInUser.id as string,
                followingId: userId
            },
            update : {}
        })

        return new Response()

    } catch (error) {
        console.log("[POST_FOLLOWERS_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
};




export async function DELETE(req: Request, { params: { userId } }: { params: { userId: string } }) {
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) return Response.json({ error: "Unauthorized" }, { status: 401 });


        await prisma.follow.deleteMany({
            where : {
                followerId : loggedInUser.id as string,
                followingId : userId
            }
        })
        return new Response()

    }catch (error) {
        console.log("[DELETE_FOLLOWERS_ROUTE]", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}