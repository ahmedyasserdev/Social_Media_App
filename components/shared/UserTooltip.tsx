"use client"
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { FollowerInfo, UserData } from '@/lib/types';
import  { PropsWithChildren } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';
import UserAvatar from './UserAvatar';
import FollowButton from './FollowButton';
import Linkify from './Linkify';
import FollowersCount from './FollowersCount';
interface UserTooltipProps extends PropsWithChildren {
    user: UserData;
  }
const UserTooltip = ({user , children} : UserTooltipProps) => {
    const loggedInUser = useCurrentUser();
    const followerInfo  : FollowerInfo = {
        followers : user._count.followers,
        isFollowedByUser : !!user.followers.some((follower) => follower.followerId === loggedInUser?.id)
    }
  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
          <div className="flex-between gap-2">
            <Link href={`/users/${user.username}`}>
              <UserAvatar size={70} avatarUrl={user.avatarUrl} />
            </Link>
            {loggedInUser?.id !== user.id && (
              <FollowButton userId={user.id} initialState={followerInfo} />
            )}
          </div>
          <div>
            <Link href={`/users/${user.username}`}>
              <h5 className="p-semibold-18 hover:underline">
                {user.displayName}
              </h5>
              <p className="text-muted-foreground">@{user.username}</p>
            </Link>
          </div>
          {user.bio && (
            <Linkify>
              <div className="line-clamp-4 whitespace-pre-line">
                {user.bio}
              </div>
            </Linkify>
          )}
          <FollowersCount userId={user.id} initialState={followerInfo} />
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  )
}

export default UserTooltip