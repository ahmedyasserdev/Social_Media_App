'use client';

import UserAvatar from "@/components/shared/UserAvatar";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import Linkify from "@/components/shared/Linkify";
import UserTooltip from "@/components/shared/UserTooltip";
import Image from "next/image";
import { Media } from "@prisma/client";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import {  MessageSquare } from "lucide-react";
import Comments from "@/components/comments/Comments";

type PostProps = {
  post: PostData;
};

const Post = ({ post }: PostProps) => {
  const user = useCurrentUser();
  const elementRef = useRef<HTMLDivElement | null>(null);
    const [showComments, setShowComments] = useState(false)
  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true, // Animate only once
    threshold: 0.1,    // Trigger when 10% of the element is visible
  });

  // Combine the refs from useRef and useInView
  const setRefs = (node: HTMLDivElement) => {
    elementRef.current = node;
    inViewRef(node);
  };

  useEffect(() => {
    if (inView && elementRef.current) {
      gsap.to(elementRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
      });
    }
  }, [inView]);

  return (
    <article
      ref={setRefs}
      className="space-y-3 rounded-2xl bg-card p-5 shadow-sm opacity-0 transition-opacity  "
    >
      <div className="flex-between">
        <div className="flex flex-wrap gap-3">
        <UserTooltip user={post?.user}>
        <Link href={`/users/${post?.user?.username}`}>
            <UserAvatar avatarUrl={post?.user?.avatarUrl} />
          </Link>
        </UserTooltip>
          <div className="space-y-3">
          <UserTooltip user={post?.user}>
          <Link
              href={`/users/${post?.user?.username}`}
              className="block font-medium hover:underline"
            >
              {post?.user?.displayName}
            </Link>
          </UserTooltip>
            <Link
              href={`/posts/${post?.id}`}
              className="text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {!!post?.createdAt && formatRelativeDate(post?.createdAt)}
            </Link>
          </div>
        </div>

        {post?.user?.id === user?.id && <PostMoreButton post={post} />}
      </div>

     <Linkify>
     <div className="whitespace-pre-line break-words">
        {post?.content}
      </div>
      </Linkify>
    {
      !!post?.attachments.length && (
        <MediaPreviews attachments = {post.attachments} />
      )
    }

    <hr className="text-muted-foreground"/>

    <div className="flex-between gap-5">
        <div className="flex items-center gap-5">
        <LikeButton  
      postId= {post?.id}
      initialState = {{
        isLikedByUser : post?.likes.some((like) => like?.userId === user?.id), 
        likes : post?._count.likes,

      }}
    />

        <CommentButton post={post}  onClick = {() => setShowComments((prev) => !prev)} />
        </div>


      <BookmarkButton postId={post?.id} initialState={{
        isBookmarkedByUser : post?.bookmarks.some((bookmark) => bookmark?.userId === user?.id )
      }}  />

    </div>



        {
          showComments && <Comments post = {post} />
        }
    </article>
  );
};

export default Post;


interface MediaPreviewsProps {
  attachments: Media[];
}


function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}



type CommentButtonProps = {
  post : PostData;
  onClick : () => void
}
function CommentButton ( {onClick , post} : CommentButtonProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-2">
      <MessageSquare className="size-5 "/>

    <span className="p-medium-12 tabular-nums">{post?._count.comments}{" "}
        <span className="hidden sm:inline">comments</span>
    </span>
    

    </button>
  )
}


