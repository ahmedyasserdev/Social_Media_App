import { currentUser } from '@/lib/actions/session.actions';
import prisma from '@/lib/prisma';
import { getPostDataInclude, UserData } from '@/lib/types';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React, { cache, Suspense } from 'react'
import Post from '../../_components/Post';
import UserTooltip from '@/components/shared/UserTooltip';
import Link from 'next/link';
import UserAvatar from '@/components/shared/UserAvatar';
import { Loader2 } from 'lucide-react';
import Linkify from '@/components/shared/Linkify';

type PostIdPageProps = {
  params: {
    postId: string;
  }
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});


export async function generateMetadata({
  params: { postId },
}: PostIdPageProps): Promise<Metadata> {
  const user = await currentUser();

  if (!user) return {};

  const post = await getPost(postId, user.id as string);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

const PostIdPage = async ({ params: { postId } }: PostIdPageProps) => {
  const user = await currentUser();
  if (!user) return redirect("/login");
  const post = await getPost(postId, user.id as string);
  return (
    <section className="w-full  min-w-0 flex gap-5">

      <div className="w-full min-w-0 space-y-5" >
        <Post post={post} />
      </div>
      <div className = "sticky top-[5.25rem] hidden lg:block h-fit w-80 flex-none" >
        <Suspense fallback = {<Loader2 className='animate-spin mx-auto size-5' />}>
      <UserInfoSidebar user={post.user} />

        </Suspense>

      </div>
    </section>
  )
}

export default PostIdPage


type UserInfoSidebarProps = {
  user: UserData
}


async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const loggedInUserId = await currentUser();
  if (!loggedInUserId) return null;

  return (
    <div className="rounded-2xl space-y-5 bg-card p-5 shadow-sm">
      <h2 className="h5-bold">About this user</h2>
      <UserTooltip user={user}>
        <Link href={`/users/${user.username}`} className="flex items-center gap-3">
          <UserAvatar avatarUrl={user.avatarUrl} className = "flex-none" />
          <div>
            <p className="line-clamp-1 break-all hover:underline p-semibold-14">{user.displayName}</p>
            <p className="line-clamp-1 text-muted-foreground">@{user.username}</p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <p className="text-muted-foreground line-clamp-6  whitespace-pre-line">{user.bio}</p>
      </Linkify>
    </div>
  )

}