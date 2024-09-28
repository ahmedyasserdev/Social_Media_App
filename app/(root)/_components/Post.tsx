'use client';

import UserAvatar from "@/components/shared/UserAvatar";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import PostMoreButton from "./PostMoreButton";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import Linkify from "@/components/shared/Linkify";
import UserTooltip from "@/components/shared/UserTooltip";
import Image from "next/image";
import { Media } from "@prisma/client";
import LikeButton from "./LikeButton";

type PostProps = {
  post: PostData;
};

const Post = ({ post }: PostProps) => {
  const user = useCurrentUser();
  const elementRef = useRef<HTMLDivElement | null>(null);

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

    <LikeButton  
      postId= {post?.id}
      initialState = {{
        isLikedByUser : post.likes.some((like) => like.userId === user?.id), 
        likes : post?._count.likes,

      }}
    />

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