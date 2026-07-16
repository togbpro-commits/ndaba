import { clerkMiddleware } from "@clerk/nextjs/server";
import { createClient } from "@/utils/supabase/middleware";

export default clerkMiddleware(async (auth, req) => {
  // Sync Supabase cookies
  const response = createClient(req);
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
