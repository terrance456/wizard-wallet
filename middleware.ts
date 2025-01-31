export { auth as middleware } from "@/src/auth/auth";

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api/auth|api/public|api/reset-paid-status|api-doc|api/stripe/hook|_next/static|_next/image|.png|favicon.ico).*)"],
};
