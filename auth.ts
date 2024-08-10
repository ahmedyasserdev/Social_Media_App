import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { getUserById } from "./lib/actions/user.actions";

export const { auth, handlers, signIn, signOut  ,  } = NextAuth({
 

  callbacks: {
    async session({ session, token  }) {
      if (session.user && token.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
          bio : token.bio as string ,
          avatarUrl : token.avatarUrl as string ,
          username: token.username as string,
          email: token.email as string,
        };
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;
     
      return {
        ...token,
        ...user,
      };
    },

  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig
});