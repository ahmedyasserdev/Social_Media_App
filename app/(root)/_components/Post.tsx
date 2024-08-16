'use client'
import UserAvatar from "@/components/shared/UserAvatar";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton"
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type PostProps = {
  post: PostData;
};

const Post =  ({ post }: PostProps) => {
  const user = useCurrentUser()
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
     <div className="flex-between">
     <div className="flex flex-wrap gap-3 ">
        <Link href={`/users/${post.user.username}`}>
          <UserAvatar avatarUrl={post.user?.avatarUrl} />
        </Link>
    <div className="space-y-3">
    <Link
          href={`/users/${post.user.username}`}
          className="block font-medium hover:underline"
        >
          {post.user.displayName}
        </Link>

        <Link
          href={`/posts/${post.id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
            {formatRelativeDate(post.createdAt)}
        </Link>
    </div>
      </div>


      {
        post.user.id === user?.id && (
          <PostMoreButton post= {post } />
        ) 
      }

     

     </div>


    <div className="whitespace-pre-line break-words ">
        {post.content}
    </div>

    </article>
  );
};

export default Post;
