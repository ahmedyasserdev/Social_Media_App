"use client"
import { NotificationCountInfo } from '@/lib/types'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

const NotificationsButton = ({initialState} :  {initialState : NotificationCountInfo} ) => {
    const {data } = useQuery({
        queryKey: ["unread-notifications-count"],
        queryFn: async () => ky.get("/api/notifications/unread-count").json<NotificationCountInfo>(),
        initialData: initialState,
        refetchInterval:  60 * 1000,
    })
  return (
    <Button variant="ghost" className=" menu-item flex-start gap-3" title={"Notifications"} asChild >
    <Link href={"/notifications"}>
    <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>

      <span className="hidden md:inline">Notifications</span>
    </Link>
  </Button>
  )
}

export default NotificationsButton