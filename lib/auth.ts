import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session } from "next-auth";
import prisma from "~/lib/prisma";
import GitHubProvider from "next-auth/providers/github";

const superAdminEmails = JSON.parse(process.env.ADMINS || "[]");

export const adapter = PrismaAdapter(prisma);

export type UserSession = {
  expires: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    isAdmin: boolean;
  };
};

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter,
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user }) {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
        },
        expires: session.expires,
      };
    },
  },
  events: {
    async signIn({ user }) {
      // See if the user is admin
      if (superAdminEmails.includes(user.email)) {
        await prisma.user.update({
          where: { email: user.email },
          data: { isAdmin: true },
        });
      }
    },
  },
};
