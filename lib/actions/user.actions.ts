"use server";
import { notFound } from "next/navigation";
import prisma from "../prisma";
import { getUserDataSelect } from "../types";
import { updateUserProfileSchema, UpdateUserProfileValues } from "../validation";
import { cache } from 'react'

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                },
            }
        });

        return user
    } catch {
        return null
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        return user
    } catch {
        return null
    }
}
export const getUserByUsername = async (username: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: {
                    equals: username,
                    mode: 'insensitive'
                }
            }
        });

        return user
    } catch {
        return null
    }
}

export const updateUser = async ({values , userId} : {values : UpdateUserProfileValues , userId : string}) => {
    try {
        const validatedFields = updateUserProfileSchema.safeParse(values);
        if (!validatedFields.success) return { error: validatedFields.error };

       
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                ...validatedFields.data
            },
            select : getUserDataSelect(userId as string)
        });
        return updatedUser

    } catch (error) {
        console.log( "[UPDATE_USER_ACTION]", error);
    }
}

export const getUser = cache(async (username: string, loggedInUserId: string) => {
    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive'
        },
      },
      select: getUserDataSelect(loggedInUserId)
    });
  
    if (!user) notFound();
  
    return user
  });
  