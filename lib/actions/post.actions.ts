'use server'

import prisma from "../prisma"
import { createPostSchema } from "../validation"
import { currentUser } from "./session.actions"


export const createPost = async (content : string) => {
    const user = await currentUser()

    if (!user) throw new Error("Unauthorized")

            if (!content ) return {error : "Your post is Empty"}

        await prisma.post.create({
            data : {
                content,
                userId : user.id ?? "" 
            }
        })
}