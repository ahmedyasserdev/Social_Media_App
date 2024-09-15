import { UpdateUserProfileValues } from './../lib/validation';
import { useToast } from "@/components/ui/use-toast";
import { updateUser } from "@/lib/actions/user.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCurrentUser } from './useCurrentUser';
import { PostPage } from '@/lib/types';

export const useUpdateUserMutation = () => {
    const { toast } = useToast();
    const router = useRouter();
    const user = useCurrentUser()
    const queryClient = useQueryClient();
    const { startUpload: startAvatarUpload } = useUploadThing("avatar")
    const mutation = useMutation({

        mutationFn: ({
            values,
            avatar,
        }: {
            values: UpdateUserProfileValues;
            avatar?: File;
        }) => {
            return Promise.all([
                updateUser({ values, userId: user?.id as string }),
                console.log(avatar),
                avatar ? startAvatarUpload([avatar]) : null,
                console.log( "After upload", avatar),
            ]);
        },

        onSuccess: async ([updatedUser, uploadResult]) => {
            //@ts-ignore
            const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;
            const queryFilter: QueryFilters = { queryKey: ["post-feed"] };
            await queryClient.cancelQueries(queryFilter);
            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>(
                queryFilter,
                // @ts-ignore
                (oldData) => {
                    if (!oldData) return;

                    return {
                        pageParams: oldData.pageParams,
                        pages: oldData.pages.map((page) => ({
                            nextCursor: page.nextCursor,
                            posts: page.posts.map((post) => {
                                if (post?.user?.id === user?.id) {
                                    return {
                                        ...post,
                                        user: {
                                            ...updatedUser,
                                            avatarUrl: newAvatarUrl || post?.user?.avatarUrl
                                        }
                                    }
                                }

                                return post
                            })
                        }))
                    }
                }
            )

            router.refresh();
            toast({
                description: "Profile updated successfully.",
            })
        },

        onError(error) {
            console.log("[UPDATE_USER_MUTATION]", error)
            toast({
                variant: "destructive",
                description: "Something went wrong , please try again.",
            })
        },


    });
    return mutation
}