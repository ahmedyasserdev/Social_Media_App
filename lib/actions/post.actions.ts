'use server'

import { revalidatePath } from "next/cache"
import prisma from "../prisma"
import { createPostSchema } from "../validation"
import { currentUser } from "./session.actions"
import { getPostDataInclude } from "../types"


export const createPost = async (content: string) => {
    const user = await currentUser()

    if (!user) throw new Error("Unauthorized")

    if (!content) return { error: "Your post is Empty" }

    const newPost = await prisma.post.create({
        data: {
            content,
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