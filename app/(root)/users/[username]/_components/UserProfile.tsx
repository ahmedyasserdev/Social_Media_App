import FollowButton from "@/components/shared/FollowButton";
import FollowersCount from "@/components/shared/FollowersCount";
import Linkify from "@/components/shared/Linkify";
import UserAvatar from "@/components/shared/UserAvatar";
import { FollowerInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import EditProfileButton from "./EditProfileButton";


type UserProfileProps = {
    user: UserData;
    loggedInUserId: string

}
const UserProfile = ({ user, loggedInUserId }: UserProfileProps) => {
    const followerInfo: FollowerInfo = {
        followers: user._count.followers,
        isFollowedByUser: user.followers.some((follower) => follower.followerId === loggedInUserId)
    };

    return (
        <div className="h-fit w-full space-y-5 bg-card shadow-sm rounded-2xl p-5">
            <UserAvatar size={250} className="size-full  rounded-full  mx-auto max-h-60 max-w-60" avatarUrl={user?.avatarUrl} />
            <div className="flex flex-wrap md:flex-nowrap gap-3">
                <div className="me-auto space-y-3">
                    <div>
                        <h1 className=" p-bold-24 lg:h2-bold">{user.displayName}</h1>
                        <p className="text-muted-foreground">@{user.username}</p>
                    </div>
                    <div>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</div>
                    <div className="flex gap-3 items-center">
                        <span>
                            Posts:{" "}
                            <span className="font-semibold">
                                {formatNumber(user._count.posts)}
                            </span>
                        </span>
                        <FollowersCount userId={user.id} initialState={followerInfo} />
                    </div>
                </div>
                {user.id === loggedInUserId ? (
                    <EditProfileButton  user = {user} />
                ) : (
                    <FollowButton userId={user.id} initialState={followerInfo} />
                )}
            </div>

            {
                user.bio && (
                    <Linkify>
                    <hr />
                    <p className ="overflow-hidden break-word whitespace-pre-line" >{user.bio}</p> 
                    </Linkify>
                )
            }
        </div>
    )
}

export default UserProfile