import Link from "next/link"
import UserButton from "./UserButton"
import SearchField from "./SearchField"

const Navbar = () => {
  return (
    <header className="sticky top-0 bg-card  z-10">
        <nav className="container flex-center flex-wrap  gap-5 px-5 py-3 " >
              <Link href = "/" className = " text-primary h3-bold" >bugbook</Link>
        <SearchField/>
        <UserButton  className = "sm:ms-auto" />
        </nav>
    </header>
  )
}

export default Navbar