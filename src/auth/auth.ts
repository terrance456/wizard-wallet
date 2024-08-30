import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { verifyUser } from "./verify-user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    authorized: ({ auth, request }) => {
      return !!auth;
    },
    signIn: async (user) => {
      const userValidation = await verifyUser(user.user);
      if (userValidation.success) {
        user.user.userId = userValidation.userId;
        return true;
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.userId = token.userId as string;
      return session;
    },
  },
  pages: { signIn: "/signin" },
});
