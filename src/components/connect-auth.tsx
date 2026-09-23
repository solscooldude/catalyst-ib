import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isClerkConfigured } from "@/lib/clerk-config";

export function ConnectAuthCard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const configured = isClerkConfigured();
  if (configured) return null;

  return (
    <section
      className={
        compact
          ? "rounded-3xl bg-zinc-50 p-5 dark:bg-zinc-900"
          : "rounded-[1.6rem] bg-[#121218] p-6 ring-1 ring-[#F4F4F5]/10"
      }
    >
      <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
        Connect auth
      </p>
      <h2 className="mt-2 text-lg text-foreground">
        Google + email sign-in is not connected yet
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Catalyst is wired for Clerk. Set the Clerk keys on Vercel, then enable
        Google and email codes in the Clerk dashboard. Until then this browser
        can keep a local session, but it will not follow you to another
        browser.
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
        <li>
          Create a Clerk application and copy{" "}
          <span className="font-mono text-foreground">
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
          </span>{" "}
          and{" "}
          <span className="font-mono text-foreground">CLERK_SECRET_KEY</span>.
        </li>
        <li>
          In Clerk → User & Authentication, turn on Email (Email verification
          code) and Google. Leave passwords off.
        </li>
        <li>
          Add those keys in Vercel → Settings → Environment Variables for
          Production, Preview, and Development. Redeploy.
        </li>
      </ol>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild variant="outline" className="h-10 rounded-full px-4">
          <Link href="/account/settings">Open Account</Link>
        </Button>
        <Button asChild variant="ghost" className="h-10 rounded-full px-4">
          <a
            href="https://dashboard.clerk.com"
            target="_blank"
            rel="noreferrer"
          >
            Clerk dashboard
          </a>
        </Button>
      </div>
    </section>
  );
}
