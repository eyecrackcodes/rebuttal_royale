import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    // Add routes that require authentication
    "/training/:path*",
    "/profile/:path*",
  ],
};
