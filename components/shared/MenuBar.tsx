import Link from "next/link";
import { Button } from "../ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";


type MenuBarProps = {
    className ?: string;
}

const MenuBar = ({className} : MenuBarProps) => {
  return (
    <div className={className} >
        <Button variant={'ghost'} className="flex-start gap-3" title="Home" asChild >
            <Link href = "/">
            <Home/>
    <span className = "hidden md:inline" >Home</span>
            </Link>
        </Button>

        <Button variant={'ghost'} className="flex-start gap-3" title="Notifications" asChild >
            <Link href = "/notifications">
            <Bell/>
    <span className = "hidden md:inline" >Notifications</span>
            </Link>
        </Button>


        <Button variant={'ghost'} className="flex-start gap-3" title="Messages" asChild >
            <Link href = "/messages">
            <Mail/>
    <span className = "hidden md:inline" >Messages</span>
            </Link>
        </Button>


        <Button variant={'ghost'} className="flex-start gap-3" title="Bookmarks" asChild >
            <Link href = "/bookmarks">
            <Bookmark/>
    <span className = "hidden md:inline" >Bookmarks</span>
            </Link>
        </Button>


    </div>
  )
}

export default MenuBar