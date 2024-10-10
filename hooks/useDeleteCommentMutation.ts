import { useToast } from "@/components/ui/use-toast";
import { deleteComment } from "@/lib/actions/comments.actions";
import { CommentData, CommentsPage } from "@/lib/types";
import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCommentMutation() {
    const {toast} = useToast();
    const queryClient  = useQueryClient();
    const mutation = useMutation({
        mutationFn: deleteComment,
        onSuccess :async (deletedComment) => {
            const queryKey  : QueryKey = ["comments" , deletedComment.postId];

            await queryClient.cancelQueries({queryKey});



            queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(queryKey,
                    //@ts-igonre
                (oldData) => {
                        if (!oldData) return ;
                        return {
                            pageParams: oldData.pageParams,
                            pages: oldData.pages.map((page) => ({
                                previousCursor: page.previousCursor,
                                comments: page.comments.filter((c) => c.id !== deletedComment.id),
                            })),
                        }
            });

            toast({
                description : "deleted comment ."
            })

        },

        onError(error, variables, context) {
            console.log(error)
            toast({
                variant : "destructive",
                    description  : "failed to delete comment please try again."
            })
        },
        
    });


    return mutation
}