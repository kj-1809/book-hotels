import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  session : {
    strategy : "jwt"
  },
  callbacks: {
    async jwt({token}){
      const foundUser = await prisma.user.findFirst({
        where: {
          id : token.sub
        }
      })
      token.role = foundUser?.role!
      return token;
    },
    async session({session, token}){
      session.user.userId = token.sub!
      session.user.role = token.role 
      return session;
    }
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
};
/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};