import { request } from "http";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const user = token?.user as { role?: string };
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
// export default withAuth(
//   function middleware(req: NextRequestWithAuth) {
//     console.log(req.nextUrl.pathname);
//     console.log(req.nextauth.token);

//     if (
//       req.nextUrl.pathname.startsWith("/dashboard") &&
//       req.nextauth.token?.role !== "admin"
//     ) {
//       return NextResponse.redirect("/");
//     }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => token?.role === "admin",
//     },
//   }
// );

export const config = {
  matcher: [
    // "/",
    // "/validasi",
    // "/detail/:path*",
    // "/dashboard/:path*",
    // "/api/admin/:path*",
    "/((?!auth|static|favicon.ico|api/auth).*)",
  ],
};
