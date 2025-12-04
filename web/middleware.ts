import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If on login/register page and already authenticated, redirect to dashboard
    if (req.nextauth.token) {
      if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const protectedPaths = ["/dashboard"];
        const isProtectedPath = protectedPaths.some(path =>
          req.nextUrl.pathname.startsWith(path)
        );

        // Allow access to protected paths only if authenticated
        if (isProtectedPath) {
          return !!token;
        }

        // Allow access to other paths
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
