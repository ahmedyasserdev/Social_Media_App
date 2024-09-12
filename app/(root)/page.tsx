import PostEditor from "@/components/shared/PostEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendsSidebar from "@/components/shared/TrendsSidebar";
import ForYouFeed from "./_components/ForYouFeed";
import FollowingFeed from "./_components/FollowingFeed";
export default  function Home() {
 



  return (
      <section className = "w-full  min-w-0 flex gap-5" >
        <div className="w-full min-w-0 space-y-5">
          <PostEditor />
          <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
        </div>
        <TrendsSidebar />
      </section>
  
  );
}
