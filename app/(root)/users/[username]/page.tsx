import TrendsSidebar from '@/components/shared/TrendsSidebar';
import { currentUser } from '@/lib/actions/session.actions';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import UserProfile from './_components/UserProfile';
import UserPosts from './_components/UserPosts';
import { getUser } from '@/lib/actions/user.actions';




export async function generateMetadata({ params: { username } }: { params: { username: string } }): Promise<Metadata> {
  const loggedInUser = await currentUser();
  if (!loggedInUser) return redirect('/login');
  const user = await getUser(username, loggedInUser.id as string);

  return {
    title: `${user?.displayName} (@${user?.username})`,
  };

}


const UsernamePage = async({ params: { username } }: { params: { username: string } }) => {
  const loggedInUser = await currentUser();

  if (!loggedInUser) return (
    <p className="text-destructive">
      you&apos;re not authorized to see this page
    </p>
  );
    const user = await getUser(username, loggedInUser?.id as string);
  return (
    <section className=' flex min-w-0 w-full gap-5' >
        <div  className='w-full min-w-0 space-y-5' >
      <UserProfile user={user} loggedInUserId={loggedInUser?.id as string} />
      <div className="bg-card rounded-2xl p-5 shadow-sm">
      <h2 className=" p-bold-20  lg:h3-bold text-center">{user.displayName}&apos;s posts</h2>
      </div>
      <UserPosts userId= {user.id} />

        </div>

        <TrendsSidebar />
    </section>
  )
}

export default UsernamePage