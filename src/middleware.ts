import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/jobs/alljobs", "/jobs/jobdetails/:id"],
  // restrictedRoutes: ["/admin/jobs", "/admin/addjob"],
  // getUserRole: (user) => user?.publicMetadata?.role,
});


export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
