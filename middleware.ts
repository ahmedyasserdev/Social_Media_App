import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
} from "@/routes";
import { redirect } from "next/navigation";
const { auth } = NextAuth(authConfig);
//@ts-ignore
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

        if (isApiRoute ) {return null};

        if (isAuthRoute) {
            if (isLoggedIn) {
               return  Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl) );
            }
            return null
        }
          if (!isLoggedIn && !isPublicRoute) {
            return  Response.redirect(new URL(`/login`, nextUrl) );
          }
          return null

    });

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};