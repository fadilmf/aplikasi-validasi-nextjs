import { request } from "http";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const user = token?.user as { role?: string; regional?: number };
      if (
        req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/api/admin")
      ) {
        return user?.role === "admin";
      }

      return Boolean(token);
    },
  },
});

export const config = {
  matcher: ["/((?!auth|static|favicon.ico|api/auth).*)"],
};
