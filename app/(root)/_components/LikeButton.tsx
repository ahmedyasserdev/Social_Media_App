import { useToast } from "@/components/ui/use-toast";
import { LikeInfo } from "@/lib/types"
import { cn } from "@/lib/utils";
import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ky from "ky";
import { Heart } from "lucide-react";


type LikeButtonProps = {
    initialState: LikeInfo;
    postId: string;
}
const LikeButton = ({ initialState, postId }: LikeButtonProps) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const queryKey  : QueryKey  =  ["like-info", postId]  

    const {data , } = useQuery({
            queryKey ,
            queryFn : () => ky.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
        initialData : initialState ,
        staleTime : Infinity

    });

    const {mutate} = useMutation({
        mutationFn : () => data.isLikedByUser ? ky.delete(`/api/posts/${postId}/likes`) : ky.post(`/api/posts/${postId}/likes`),

            onMutate : async  () => {
                    await queryClient.cancelQueries({queryKey})

                    const previousState = queryClient.getQueryData<LikeInfo>(queryKey);
                    //@ts-ignore
                    queryClient.getQueryData<LikeInfo>(queryKey , () => ({
                        isLikedByUser : !previousState?.isLikedByUser,
                        likes : (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1)
                    }) )

                return {previousState}
            },
            onError(error, variables, context) {
                queryClient.setQueryData(queryKey, context?.previousState);
                console.error(error);
                toast({
                  variant: "destructive",
                  description: "Something went wrong. Please try again.",
                });
              },


    })



    return (
        <button onClick={() => mutate()} className="flex items-center gap-2">
            <Heart className= {cn("size-5 " , data.isLikedByUser  && "fill-red-500 text-red-500 " )}   />
      
                <span className="p-medium-14 tabular-nums">
                    {data?.likes}  <span className="hidden sm:inline">likes</span> 
                </span>
        </button>
    )
}

export default LikeButton