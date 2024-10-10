import Link from "next/link";
import { Button } from "../ui/button";
import {  Bookmark, Home, Mail } from "lucide-react";
import prisma from "@/lib/prisma";
import { currentUser } from "@/lib/actions/session.actions";
import NotificationsButton from "./NotificationsButton";

type MenuBarProps = {
  className?: string;
};

const menuItems = [
  { href: "/", label: "Home", icon: <Home /> },
  { href: "/messages", label: "Messages", icon: <Mail /> },
  { href: "/bookmarks", label: "Bookmarks", icon: <Bookmark /> },
];
const MenuBar = async ({ className }: MenuBarProps) => {
  const user = await currentUser();
    if (!user ) return null;

   const unreadNotifications = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  return (
    <div className={className }>
      {menuItems.map(({ href, label, icon }) => (
        <Button variant="ghost" className=" menu-item flex-start gap-3" title={label} asChild key={label}>
          <Link href={href}>
            {icon}
            <span className="hidden md:inline">{label}</span>
          </Link>
        </Button>
      ))}
    <NotificationsButton initialState={{ unreadCount: unreadNotifications }} />
    </div>
  );
};

export default MenuBar;
