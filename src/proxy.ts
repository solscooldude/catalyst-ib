import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkServerConfigured } from "@/lib/clerk-config";

const clerk = isClerkServerConfigured()
  ? clerkMiddleware()
  : function proxy() {
      return NextResponse.next();
    };

export default clerk;
export { clerk as proxy };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
