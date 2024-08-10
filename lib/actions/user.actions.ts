import prisma from "../prisma";


export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email : {
                    equals : email,
                    mode : 'insensitive'
                } ,
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
            }
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
                username : {
                    equals : username ,
                    mode : 'insensitive'
                }
            }
        });

        return user
    } catch {
        return null
    }
}