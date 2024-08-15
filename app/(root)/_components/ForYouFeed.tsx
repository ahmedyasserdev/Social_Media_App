"use client";

import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Post from "./Post";

const ForYouFeed = () => {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) throw new Error(`Failed to fetch  ${res.status} `);
      return res.json();
    },
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading the posts.
      </p>
    );
  }

  return <>
    {
        query.data.map((post) => (
            <Post  post = {post} key = {post.id} />
        ))
    }
  </>;
};

export default ForYouFeed;
