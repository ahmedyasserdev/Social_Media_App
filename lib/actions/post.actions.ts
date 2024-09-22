'use server'

import { revalidatePath } from "next/cache"
import prisma from "../prisma"
import { createPostSchema } from "../validation"
import { currentUser } from "./session.actions"
import { getPostDataInclude } from "../types"


export const createPost = async (content : {content : string  ; mediaIds : string[]}) => {
    const user = await currentUser()

    if (!user) throw new Error("Unauthorized")

     const validatedFields = createPostSchema.safeParse(content);

     if (!validatedFields.success) throw new Error("Missing required Fields")
        const {content : text , mediaIds} = validatedFields.data
    const newPost = await prisma.post.create({
        data: {
            content : text,
                attachments  : {
                    connect : mediaIds.map((id) => ({id}))
                },
            userId: user.id ?? ""
        },
        include: getPostDataInclude(user.id as string)
    });

    return newPost
}


export const deletePost = async (postId: string) => {
    try {
        const user = await currentUser();

        if (!user) throw new Error("Unauthorized");
        const postToDelete = await prisma.post.findUnique({
            where: {
                id: postId,
                userId: user.id
            }
        })


        if (!postToDelete) throw new Error("undefined");


        const deletedPost = await prisma.post.delete({
            where: { id: postToDelete.id },
            include: getPostDataInclude(user.id as string)
        })

        revalidatePath("/")
        return deletedPost

    } catch (error) {
        console.log('[DELETE_POST]', error)
    }
}