import {
  formatFriendId,
  friendDisplayName,
  friendInitials,
} from "@/lib/friends";
import { cn } from "@/lib/utils";

export function FriendAvatar({
  name,
  avatarUrl,
  size = "md",
}: {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md";
}) {
  const label = friendDisplayName({ name });
  const box = size === "sm" ? "size-8 text-[10px]" : "size-10 text-xs";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/15 text-foreground ring-1 ring-primary/25",
        box,
      )}
      aria-hidden={Boolean(avatarUrl)}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="" className="size-full object-cover" />
      ) : (
        <span className="font-medium">{friendInitials(label)}</span>
      )}
    </span>
  );
}

export function FriendIdentity({
  name,
  code,
  avatarUrl,
  you = false,
  extra,
  size = "md",
}: {
  name: string;
  code: string;
  avatarUrl?: string | null;
  you?: boolean;
  extra?: string;
  size?: "sm" | "md";
}) {
  const label = friendDisplayName({ name, code });
  const idLine = formatFriendId(code);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <FriendAvatar name={label} avatarUrl={avatarUrl} size={size} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {you ? `${label} (you)` : label}
        </p>
        {idLine || extra ? (
          <p className="truncate text-[11px] leading-4 text-muted-foreground">
            {idLine}
            {idLine && extra ? " · " : ""}
            {extra ?? ""}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function RequestCountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground"
      aria-label={`${count} friend request${count === 1 ? "" : "s"}`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
