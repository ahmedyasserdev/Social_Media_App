import { useToast } from "@/components/ui/use-toast";
import { BookmarkInfo } from "@/lib/types"
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { Bookmark, Heart } from "lucide-react";


type BookmarkButtonProps = {
    initialState: BookmarkInfo;
    postId: string;
}
const BookmarkButton = ({ initialState, postId }: BookmarkButtonProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const queryKey  : QueryKey  =  ["bookmark-info", postId]  

    const {data , } = useQuery({
            queryKey ,
            queryFn : () => ky.get(`/api/posts/${postId}/bookmarks`).json<BookmarkInfo>(),
        initialData : initialState ,
        staleTime : Infinity

    });

    const { mutate } = useMutation({
        mutationFn: () =>
          data.isBookmarkedByUser
            ? ky.delete(`/api/posts/${postId}/bookmarks`)
            : ky.post(`/api/posts/${postId}/bookmarks`),
        onMutate: async () => {
          toast({
            description : `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`
          })
          await queryClient.cancelQueries({ queryKey });
    
          const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);
    
          queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
            isBookmarkedByUser: !previousState?.isBookmarkedByUser,
          }));
    
          return { previousState };
        },
        onError(error, variables, context) {
          queryClient.setQueryData(queryKey, context?.previousState);
          console.error(error);
          toast({
            variant: "destructive",
            description: "Something went wrong. Please try again.",
          });
        },
      });


    return (
        <button onClick={() => mutate()} className="flex items-center gap-2">
            <Bookmark className= {cn("size-5 " , data.isBookmarkedByUser  && "fill-primary text-primary " )}   />
      
            
        </button>
    )
}

export default BookmarkButton