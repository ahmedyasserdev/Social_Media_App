"use client";

import { NotificationsPage, } from "@/lib/types";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ky from "ky";
import InfiniteScrollContainer from "@/components/shared/InfiniteScrollContainer";
import PostsLoadingSkeleton from "@/components/shared/PostsLoadingSkeleton";
import Notification from "./Notification";
import { useEffect } from "react";
const Notifications = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [ "notifications"],
    queryFn: ({ pageParam }) =>
      ky
    .get("/api/notifications", pageParam ? { searchParams: { cursor: pageParam } } : {},)
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient()
  const {mutate} = useMutation({
       mutationFn: () => ky.patch("/api/notifications/mark-as-read").json(),

       onSuccess: () => {
        queryClient.setQueryData(["unread-notification-count"] , {
          unreadCount : 0 ,
        });
      },
      onError(error) {
        console.error("Failed to mark notifications as read", error);
      },

  })
  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton/>
  }

  if (status === 'success' && !notifications?.length && !hasNextPage  ) {
    return (
      <p className="text-center text-muted-foreground">you don&apos;t have any notifications.</p>
    )
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading the notifications.
      </p>
    );
  }


 

  return (
    <InfiniteScrollContainer onBottomReached = {() =>  hasNextPage && !isFetching && fetchNextPage()}  className="space-y-5">
      {
      notifications?.map((notification ) => (
          <Notification  key = {notification.id} notification={notification} />
        ))
    }

    {
      isFetchingNextPage &&(
        <Loader2 className="mx-auto animate-spin my-3" />
      )    }

    </InfiniteScrollContainer>
  );
};

export default Notifications;




