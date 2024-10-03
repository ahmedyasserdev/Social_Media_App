
import Bookmarks from './_components/Bookmarks'
import { Metadata } from 'next'
import TrendsSidebar from '@/components/shared/TrendsSidebar'

export const metadata : Metadata = {
  title : "Bookmark"
}
const BookmarksPage = () => {
  return (
    <section className='w-full  flex min-w-0  gap-5 ' >
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center h2-bold">Bookmarks</h1>
        </div>
      <Bookmarks/>
      </div>
      <TrendsSidebar/>
    </section>
  )
}

export default BookmarksPage