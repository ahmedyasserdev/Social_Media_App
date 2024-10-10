"use client"
import { CommentsPage, PostData } from "@/lib/types"
import CommentInput from "./CommentInput";
import { useInfiniteQuery } from "@tanstack/react-query";
import ky from "ky";
import Comment from "./Comment";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type CommentProps = {
    post : PostData ;

}



const Comments = ({post} : CommentProps) => {
  const {data , status , fetchNextPage , hasNextPage ,  isFetching} = useInfiniteQuery({
    queryKey : ["comments", post.id],	
    queryFn :  ({pageParam}) =>   ky.get(`/api/posts/${post.id}/comments` ,  pageParam ?  {searchParams : {cursor : pageParam}} : {} ).json<CommentsPage>(),
    initialPageParam : null as string | null ,
    getNextPageParam : (firstPage) => firstPage.previousCursor,
    select : (data) => ({
      pages : [...data.pages].reverse(),
      pageParams : [...data.pageParams].reverse(),
    })
  });

  const comments = data?.pages?.flatMap((page) => page.comments) || []

  return (
    <div className="space-y-3" >
      <CommentInput post={post} />

      <div className="divide-y " >
        {
          hasNextPage && (
            <Button variant = 'link' className="block mx-auto" onClick ={ () => fetchNextPage()} disabled = {isFetching}     >
              Load Previous Comments
            </Button>
          )
        }

        {
          status === "pending" && <Loader2  className="mx-auto animate-spin" />
        }

{
  status === "success" && !comments.length && (
    <p className = 'text-muted-foreground text-center' >No Comments yet.</p>
  )
}
{
  status === "error" && !comments.length && (
    <p className = 'text-destructive text-center' >An Error Occurred while fetching comments.</p>
  )
}
        {
          comments?.map((comment) => (
            <Comment key = {comment?.id} comment={comment} />
          ))
        }
      </div>

    </div>
  )
}

export default Comments