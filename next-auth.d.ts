import { type DefaultSession } from "next-auth";

export type ExtendeUser = DefaultSession["user"] & {
    username : string ;
    bio? : string ;
    avatarUrl? : string
    displayName : string
}

declare module "next-auth" {
  interface Session {
    user: ExtendeUser;
  }
}