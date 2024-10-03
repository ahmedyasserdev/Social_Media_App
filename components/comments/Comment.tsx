"use client"
import { CommentData } from "@/lib/types"
import UserTooltip from "../shared/UserTooltip";
import UserAvatar from "../shared/UserAvatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import CommentMoreButton from "./CommentMoreButton";


type CommentProps = {
    comment : CommentData;
}
const Comment = ({comment} : CommentProps) => {

    const loggedInUser  = useCurrentUser()
    const isCreator = comment.user.id === loggedInUser?.id

    return (
    <div className = "flex gap-3 py-3 group/comment " >
        <span className="hidden sm:inline">
            <UserTooltip user={comment.user} >
                <Link href={`/users/${comment.user.username}`}  > 
                <UserAvatar  size= {40} avatarUrl={comment.user.avatarUrl}  />
                </Link>
            </UserTooltip>
        </span>

            <div>
                <div className="flex items-center gap-2 p-regural-14">
                <UserTooltip user={comment.user} >
                <Link className = "font-medium hover:underline"  href={`/users/${comment.user.username}`}  > 
                        {comment.user.displayName}
                </Link>
            </UserTooltip> 
            <span className = "text-muted-foreground" >
                    {formatRelativeDate(comment.createdAt)}
                </span>    
                </div>


            <div>
                {comment.content}
            </div>
                
            </div>

            {
                isCreator && (
                    <CommentMoreButton comment={comment} className = "opacity-0 ms-auto transition-opacity group-hover/comment:opacity-100" />
                )
            }

    </div>
  )
}

export default Comment