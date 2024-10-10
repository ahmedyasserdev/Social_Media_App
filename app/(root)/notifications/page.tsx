
import { Metadata } from 'next'
import TrendsSidebar from '@/components/shared/TrendsSidebar'
import Notifications from './_components/Notifications'

export const metadata : Metadata = {
  title : "Notifications"
}
const NotificationsPage = () => {
  return (
    <section className='w-full  flex min-w-0  gap-5 ' >
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center h2-bold">Notifications</h1>
        </div>
        <Notifications />
      </div>
      <TrendsSidebar/>
    </section>
  )
}

export default NotificationsPage