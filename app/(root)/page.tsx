import PostEditor from "@/components/shared/PostEditor";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/actions/session.actions";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Post from "./_components/Post";

import TrendsSidebar from "@/components/shared/TrendsSidebar";
import ForYouFeed from "./_components/ForYouFeed";
export default  function Home() {
 



  return (
      <section className = "w-full min-w-0 flex gap-5" >
        <div className="w-full min-w-0 space-y-5">
          <PostEditor />
            <ForYouFeed />
        </div>
        <TrendsSidebar />
      </section>
  
  );
}
