"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import { useEffect } from "react";
import gsap from "gsap";

type MenuBarProps = {
  className?: string;
};

const menuItems = [
  { href: "/", label: "Home", icon: <Home /> },
  { href: "/notifications", label: "Notifications", icon: <Bell /> },
  { href: "/messages", label: "Messages", icon: <Mail /> },
  { href: "/bookmarks", label: "Bookmarks", icon: <Bookmark /> },
];
const MenuBar = ({ className }: MenuBarProps) => {
    useEffect(() => {
        const menuItems = document.querySelectorAll('.menu-item');
        
        gsap.fromTo(
          menuItems,
          {
            x: -100,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            stagger: .1,
            duration: 1,
            delay  : 1.5 ,
            ease: "circ.out",
          }
        );
    }, []);
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
    </div>
  );
};

export default MenuBar;
