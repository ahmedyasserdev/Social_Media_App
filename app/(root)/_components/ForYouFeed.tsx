"use client";

import { PostPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Post from "./Post";
import ky from "ky";
import { Button } from "@/components/ui/button";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/shared/PostsLoadingSkeleton";
import DeletePostDialog from "./DeletePostDialog";
const ForYouFeed = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      ky
    .get("/api/posts/for-you", pageParam ? { searchParams: { cursor: pageParam } } : {},)
        .json<PostPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });


  const posts = data?.pages.flatMap((page) => page.posts)

  if (status === "pending") {
    return <PostsLoadingSkeleton/>
  }

  if (status === 'success' && !posts?.length && !hasNextPage  ) {
    return (
      <p className="text-center text-muted-foreground">No one has posted any thing yet.</p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading the posts.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer onBottomReached = {() =>  hasNextPage && !isFetching && fetchNextPage()}  className="space-y-5">
      {
      posts?.map((post ,  ) => (
            <Post  post = {post} key = {post?.id} />
        ))
    }

    {
      isFetchingNextPage &&(
        <Loader2 className="mx-auto animate-spin my-3" />
      )    }


    </InfiniteScrollContainer>
  );
};

export default ForYouFeed;

