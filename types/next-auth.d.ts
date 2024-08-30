import NextAuth from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    userId: string;
  }
}
