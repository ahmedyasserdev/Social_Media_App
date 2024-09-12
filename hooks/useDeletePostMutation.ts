import { useToast } from "@/components/ui/use-toast";
import { deletePost } from "@/lib/actions/post.actions";
import {  PostPage } from "@/lib/types";
import { InfiniteData, QueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";


export const useDeletePostMutation = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    const pathname = usePathname();
    const mutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async (deletedPost) => {
            const queryFilter: QueryFilters = { queryKey: ["post-feed" , ] };

            await queryClient.cancelQueries(queryFilter);

            queryClient.setQueriesData<InfiniteData<PostPage, string | null>>
                (
                    queryFilter,
                    //@ts-ignore
                    (oldData) => {
                        if (!oldData) return;
                        return {
                            pageParams: oldData.pageParams,
                            pages: oldData.pages.map((page) => ({
                                nextCursor: page.nextCursor,
                                page: page.posts.filter((post) => post.id !== deletedPost?.id),
                            }))


                        }
                    }


                )


            toast({
                description: "Post Deleted!",
            })

            if (pathname === `/posts/${deletedPost?.id}`) router.push(`/users/${deletedPost?.user.username}`);

        },
        onError: (error) => {
            console.log('[MUTATING_DELETE_POST]', error)
            toast({
                description: "Failed to delete post. Please try again.",
                variant: "destructive"
            })
        }
    })

    return mutation
}