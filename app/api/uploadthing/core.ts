import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();


const authenticateUser = async () => {
    const user = await currentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    return { user };
};

export const fileRouter = {
    avatar: f({
        image: { maxFileSize: "512KB" }
    })
        .middleware(async () => {
            return await authenticateUser();
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const oldAvatarUrl = metadata.user.avatarUrl;
            if (oldAvatarUrl) {
                await new UTApi().deleteFiles([`Avatar_${metadata.user.id}.webp`]);
            }




            await prisma.user.update({
                where: {
                    id: metadata.user.id
                },
                data: {
                    avatarUrl: file.url,
                }
            });

            return { avatarUrl: file.url };
        }),



        attachment: f({
            image: { maxFileSize: "4MB", maxFileCount: 5 },
            video: { maxFileSize: "64MB", maxFileCount: 5 },
          })
            .middleware(async () => {
                    return await authenticateUser()
            })
            .onUploadComplete(async ({ file }) => {
              const media = await prisma.media.create({
                data: {
                  url: file.url,
                  type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
                },
              });
        
              return { mediaId: media.id };
            }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
