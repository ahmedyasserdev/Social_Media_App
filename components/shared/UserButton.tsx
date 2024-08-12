"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { logout } from "@/lib/actions/logout.actions";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";

type UserButtonProps = {
  className?: string;
};

const UserButton = ({ className }: UserButtonProps) => {
  const user = useCurrentUser();
  const { theme, setTheme } = useTheme();

  const handleLogOut = () => {
    logout();
  };

  const themeOptions = [
    { label: "System default", value: "system", icon: Monitor },
    { label: "Light", value: "light", icon: Sun },
    { label: "Dark", value: "dark", icon: Moon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex-none rounded-full border-none outline-none",
            className,
          )}
        >
          <UserAvatar avatarUrl={user?.avatarUrl} size={40} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user?.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href={`/users/${user?.username}`}>
          <DropdownMenuItem>
            <UserIcon className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {themeOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                >
                  <option.icon className="mr-2 size-4" />
                  {option.label}
                  {theme === option.value && <Check className="ms-2 size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogOut}>
          <LogOutIcon className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
