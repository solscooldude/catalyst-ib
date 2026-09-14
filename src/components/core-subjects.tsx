import { CORE_DIPLOMA } from "@/lib/ib";

export function CoreSubjects({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-2xl bg-card px-4 py-3 ring-1 ring-white/6">
      <p className="text-xs tracking-[0.16em] text-primary uppercase">
        Core · always on
      </p>
      <p className="mt-1 text-sm text-foreground">
        {CORE_DIPLOMA.map((row) => row.label).join(" · ")}
      </p>
      {compact ? null : (
        <p className="mt-1 text-xs text-muted-foreground">
          TOK and the EE are on every IB diploma. They are not one of the six
          group subjects.
        </p>
      )}
    </div>
  );
}
