import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "../ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback = {<Loader2 className = "animate-spin mx-auto" />} > 

      <WhoToFollow />
      <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;




async function WhoToFollow() {
  const user = await currentUser();
  if (!user) return null
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT : {
        id : user.id
      }
    },
    select: userDataSelect,
    take : 5,
  });


  return <div className = "bg-card rounded-2xl space-y-5 p-5 shadow-sm " >
     <h3 className = "p-bold-24"  >Who to follow </h3>

      {
        usersToFollow?.map((user) => ( 
          <div key = {user.id} className = "flex-between gap-5"  >
            <Link className="flex items-center gap-3" href = {`/users/${user.username}`}>
              <UserAvatar avatarUrl={user.avatarUrl}  className="flex-none" />
              <div>
                <p className = "line-clamp-1 break-all font-semibold hover:underline" >{user.displayName}</p>
                <p className = "line-clamp-1 break-all text-muted-foreground" >@ {user.displayName}</p>
              </div>
            </Link>
            <Button>Follow</Button>
          </div>
        ))
      }

  </div>
}



const getTrendingTopics = unstable_cache(
  async () : Promise<{hashtag : string , count : number}[]|null> => {
    const result = await prisma.post.findMany({
      where: {
        content: {
          contains: "#",
        },
      },
    });
  
    // Extract hashtags and count their occurrences
    const hashtagCounts = result.reduce((acc, post) => {
      // Find all hashtags in the content
      const hashtags = post.content.match(/#[\w_]+/g);
      
      if (hashtags) {
        hashtags.forEach((hashtag) => {
          const normalizedHashtag = hashtag.toLowerCase();
          if (acc[normalizedHashtag]) {
            acc[normalizedHashtag]++;
          } else {
            acc[normalizedHashtag] = 1;
          }
        });
      }
  
      return acc;
    }, {} as Record<string, number>);
  
    // Convert the counts object to an array and sort by count
    const sortedHashtags = Object.entries(hashtagCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([hashtag, count]) => ({
        hashtag,
        count,
      }));
  
    return sortedHashtags;
  },
  ['trending_topics'],
  {
    revalidate : 3 * 60 * 60 
  }
)



async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();
  if (!trendingTopics) return null
  return (

    <div className = "space-y-5 rounded-2xl bg-card shadow-sm  p-5" >
      <h5 className="p-bold-24">Trending topics</h5>
      {
        trendingTopics.map(({hashtag , count} ) =>{
          const title = hashtag.split("#").join("") ;
          return (
            <Link href = {`/hashtag/${title}`} key = {title} className="block" >
              <p title = {hashtag} className="line-clamp-1 break-all hover:underline font-semibold ">{hashtag}</p>
              <p className="text-sm text-muted-foreground">{formatNumber(count)} {count === 1 ? "Post" : "Posts" } </p>
            </Link>
          )
        })
      }
    </div>
  )
}