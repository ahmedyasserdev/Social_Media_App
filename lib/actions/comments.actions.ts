"use server";

import { NotificationType } from "@prisma/client";
import prisma from "../prisma";
import { getCommentDataInclude, PostData } from "../types";
import { createCommentSchema } from "../validation";
import { currentUser } from "./session.actions";


export const submitComment = async ({ post, content }: { post: PostData; content: string }) => { 
    const user = await currentUser();
        if (!user) throw new Error("Unauthenticated")

            if (!content) return { error: "Missing content" }


   const [newComment] = await prisma.$transaction([
        prisma.comment.create({
            data: {
                content,
                postId: post.id,
                userId: user.id as string,
            },
            include : getCommentDataInclude(user. id as string)
        })
,


            ...(user.id !== post.user.id ? [
                    prisma.notification.create({
                        data : {
                            issuerId : user.id as string,
                            recipientId : post.userId as string,
                            type : NotificationType.COMMENT,
                            postId : post.id
                        }
                    })
            ] : []
        
        
        )
    ])

 
    return newComment
}


export const deleteComment = async (id : string) => {
    const user = await currentUser();
    if (!user) throw new Error("Unauthenticated");

    if (!id) throw new Error("Missing id");

    const comment = await prisma.comment.findUnique({
        where : {
            id ,
        }
    });


    if (!comment) throw new Error("Comment not found");

    if (comment.userId !== user.id) throw new Error("Unauthorized");
    const deletedComment= await prisma.comment.delete({
        where : {
            id 
        },
        include  : getCommentDataInclude(user.id as string)
    })

    return deletedComment
}