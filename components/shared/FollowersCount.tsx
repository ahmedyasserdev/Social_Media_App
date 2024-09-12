'use client'
import { useFollowerInfo } from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

type FollowersCountProps = {
    userId : string;
    initialState : FollowerInfo
}
const FollowersCount = ({ userId, initialState } : FollowersCountProps) => {
    const  {data} = useFollowerInfo(userId, initialState)
  return (
    <span>
        Followers:{" "}
        <span className="font-semibold">{formatNumber(data?.followers)}</span>
    </span>
  )
}

export default FollowersCount