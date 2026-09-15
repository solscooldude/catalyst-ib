import { CORE_DIPLOMA } from "@/lib/ib";

export function CoreSubjects() {
  return (
    <div className="flux-card px-6 py-5">
      <p className="text-xs tracking-[0.16em] text-primary uppercase">
        Core · always on
      </p>
      <p className="mt-1 text-sm text-foreground">
        {CORE_DIPLOMA.map((row) => row.label).join(" · ")}
      </p>
    </div>
  );
}
