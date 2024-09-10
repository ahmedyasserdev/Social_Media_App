'use client';
import { useFollowerInfo } from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import ky from "ky";
type FollowButtonProps = {
    userId : string ;
    initialState : FollowerInfo;
}
const FollowButton = ({userId, initialState} : FollowButtonProps) => {
    const {data} = useFollowerInfo(userId, initialState);
    const {toast} = useToast();
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ["follower-info", userId];
    const { mutate , isPending } = useMutation({
        mutationFn: () =>
          data.isFollowedByUser
            ? ky.delete(`/api/users/${userId}/followers`)
            : ky.post(`/api/users/${userId}/followers`),
        onMutate: async () => {
          await queryClient.cancelQueries({ queryKey });
    
          const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);
    
          queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
            followers:
              (previousState?.followers || 0) +
              (previousState?.isFollowedByUser ? -1 : 1),
            isFollowedByUser: !previousState?.isFollowedByUser,
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
        <Button
        variant={data.isFollowedByUser ? "secondary" : "default"}
        onClick={() => mutate()}
        disabled= {isPending}
      >
        {data.isFollowedByUser ? "Unfollow" : "Follow"}
      </Button>
  )
}

export default FollowButton