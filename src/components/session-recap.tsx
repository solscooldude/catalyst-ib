"use client";

import { Spark } from "@/components/spark";
import { TokenAmount } from "@/components/mint-chip";
import { formatElapsed, recapElapsedMs, type SessionRecap } from "@/lib/session-recap";

export function SessionRecapCard({ recap }: { recap: SessionRecap }) {
  return (
    <div className="selected-task-chip mb-8">
      <p className="selected-task-label">Session recap</p>
      <p className="selected-task-name mt-2 font-heading text-2xl">
        {recap.title}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs text-[#3f3f46]">Elapsed</p>
          <p className="font-heading mt-1 text-3xl text-[#134e4a]">
            {formatElapsed(recapElapsedMs(recap))}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#3f3f46]">Earned</p>
          <p className="mt-1 inline-flex items-center gap-2 font-heading text-3xl text-[#134e4a]">
            +<TokenAmount value={recap.tokens} />
          </p>
        </div>
        <Spark
          mood="done"
          act="celebrate"
          flourish="now"
          size={72}
          className="shrink-0"
        />
      </div>
      <p className="selected-task-meta mt-3 text-xs">
        {recap.timeTokens} from time
        {recap.completionTokens
          ? ` + ${recap.completionTokens} official completion`
          : recap.kind === "study"
            ? " · study block, no +5"
            : ""}
        . Logged to Stats.
      </p>
    </div>
  );
}
