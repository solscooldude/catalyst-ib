import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export function MissingSubjectsNote() {
  return (
    <p className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-foreground dark:bg-zinc-900">
      Add subjects in{" "}
      <Link
        href={ROUTES.setup}
        className="underline underline-offset-2 hover:text-primary"
      >
        Setup
      </Link>{" "}
      or{" "}
      <Link
        href={ROUTES.profile}
        className="underline underline-offset-2 hover:text-primary"
      >
        Profile
      </Link>{" "}
      first. Focus cannot start without a subject from that list.
    </p>
  );
}
