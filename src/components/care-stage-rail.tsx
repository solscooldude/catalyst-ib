import { CARE_STAGES, type CareStage } from "@/lib/stats";
import { cn } from "@/lib/utils";

const RAIL: { stage: CareStage; label: string }[] = [
  { stage: "hatchling", label: "Hatchling" },
  { stage: "growing", label: "Growing" },
  { stage: "luminary", label: "Luminary" },
  { stage: "ethereal", label: "Ethereal" },
];

export function CareStageRail({ stage }: { stage: CareStage }) {
  const order = CARE_STAGES.indexOf(stage);
  return (
    <div className="sprite-care-rail" role="list" aria-label="Care stages">
      {RAIL.map((row) => {
        const rowOrder = CARE_STAGES.indexOf(row.stage);
        const on = row.stage === stage;
        const reached = rowOrder <= order && stage !== "egg";
        return (
          <div
            key={row.stage}
            role="listitem"
            className={cn(
              "sprite-care-rail-item",
              on && "is-on",
              reached && !on && "is-reached",
            )}
          >
            <span className="sprite-care-rail-dot" aria-hidden />
            <span>{row.label}</span>
          </div>
        );
      })}
    </div>
  );
}
