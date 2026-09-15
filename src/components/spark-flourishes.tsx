import {
  SPARK_FLAVOR_INK,
  type SparkFlavor,
} from "@/lib/spark-flavor";

/** Non-mint inks — never #5EEAD4 on the mint spark body. */
const PARTICLE_INK = [
  "#F5C14A",
  "#FB8A3C",
  "#8BA4FF",
  "#F47A9A",
  "#4DB7F5",
  "#E879F9",
  "#8BD14A",
  "#E8B86D",
  "#D4A06A",
  "#7EB6FF",
] as const;

const RING = PARTICLE_INK.map((ink, index) => ({
  deg: -90 + index * (360 / PARTICLE_INK.length),
  r: 43 + (index % 3) * 5 + (index % 2) * 2,
  size: 1.55 + (index % 4) * 0.22,
  ink,
}));

export function SparkParticleRing({
  radius = 47,
  twist = 0,
}: {
  radius?: number;
  twist?: number;
}) {
  return (
    <g className="spark-subject-bits" fill="none">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 54"
        to="360 50 54"
        dur="26s"
        repeatCount="indefinite"
      />
      {RING.map((dot, index) => {
        const rad = ((dot.deg + twist) * Math.PI) / 180;
        const reach = dot.r * (radius / 47);
        const cx = 50 + Math.cos(rad) * reach;
        const cy = 54 + Math.sin(rad) * reach * 0.92;
        return (
          <circle
            key={`${dot.ink}-${twist}`}
            className={`spark-orbit-dot spark-orbit-n${index}`}
            cx={Number(cx.toFixed(2))}
            cy={Number(cy.toFixed(2))}
            r={dot.size}
            fill={dot.ink}
          />
        );
      })}
    </g>
  );
}

function MathFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="currentColor"
      fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      fontSize="16"
    >
      <text className="spark-symbol spark-symbol-a" x="0" y="28">
        π
      </text>
      <text className="spark-symbol spark-symbol-b" x="92" y="22" fontSize="15">
        ∑
      </text>
      <text className="spark-symbol spark-symbol-c" x="86" y="48" fontSize="13">
        x²
      </text>
      <text className="spark-symbol spark-symbol-a" x="4" y="50" fontSize="12">
        √
      </text>
    </g>
  );
}

function BiologyFlourish() {
  return (
    <g className="spark-flourish" fill="currentColor">
      <g className="spark-leaf">
        <path d="M4 92c0-14 16-24 24-8-8 3-16 7-24 8Z" />
        <path d="M18 86c-4-8 6-16 14-6-6 2-11 5-14 6Z" />
        <path
          d="M6 90c8-6 16-9 21-7"
          fill="none"
          stroke="#0B0B0F"
          strokeOpacity="0.2"
          strokeWidth="0.8"
        />
      </g>
      <g className="spark-cell" transform="translate(94 24)">
        <circle r="9" fill="currentColor" fillOpacity="0.2" />
        <circle r="9" fill="none" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="-2" cy="-1" r="2.4" />
      </g>
      <g className="spark-cell spark-cell-b" transform="translate(78 44)">
        <circle r="6.2" fill="currentColor" fillOpacity="0.18" />
        <circle r="6.2" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <circle cx="1.2" cy="0.8" r="1.6" />
      </g>
      <g className="spark-cell spark-cell-c" transform="translate(12 28)">
        <circle r="5" fill="currentColor" fillOpacity="0.16" />
        <circle r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="-0.8" cy="-0.4" r="1.3" />
      </g>
    </g>
  );
}

function ChemistryFlourish() {
  return (
    <g className="spark-flourish" fill="currentColor">
      <circle className="spark-bubble spark-bubble-a" cx="14" cy="74" r="4.2" fillOpacity="0.85" />
      <circle className="spark-bubble spark-bubble-b" cx="28" cy="84" r="2.8" fillOpacity="0.7" />
      <circle className="spark-bubble spark-bubble-c" cx="8" cy="88" r="2.2" fillOpacity="0.6" />
      <g className="spark-molecule" transform="translate(90 28)">
        <circle cx="-9" cy="0" r="3.4" />
        <circle cx="8" cy="-5" r="2.7" />
        <circle cx="7" cy="7" r="2.7" />
        <path
          d="M-6 0h12.2M6.4-3.2 5.2 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.15"
        />
      </g>
    </g>
  );
}

function PhysicsFlourish() {
  return (
    <g className="spark-flourish spark-orbit" fill="currentColor">
      <ellipse
        cx="50"
        cy="48"
        rx="46"
        ry="18"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.15"
      />
      <circle cx="96" cy="48" r="3" />
      <circle cx="8" cy="42" r="2.1" />
      <path
        d="M10 18c12 5 24 4 34-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  );
}

function ReadingFlourish() {
  return (
    <g className="spark-flourish">
      <text
        className="spark-crumb"
        x="2"
        y="34"
        fill="currentColor"
        fontSize="13"
        fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      >
        ¿
      </text>
      <text
        className="spark-crumb"
        x="88"
        y="30"
        fill="currentColor"
        fontSize="12"
        fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      >
        ä
      </text>
      <g className="spark-book" transform="translate(58 74) scale(1.35)">
        <path
          d="M0 2 9-1l9 3v11l-9-2.4L0 13Z"
          fill="#121218"
          stroke="currentColor"
          strokeWidth="1.1"
        />
        <path d="M9-1v11.6" fill="none" stroke="currentColor" strokeWidth="0.9" />
        <path
          d="M3 6.2h4.2M3 8.6h3.4"
          fill="none"
          stroke="#A1A1AA"
          strokeWidth="0.6"
        />
      </g>
    </g>
  );
}

function HistoryFlourish() {
  return (
    <g className="spark-flourish spark-hourglass" fill="currentColor">
      <path
        d="M78 16h18l-8 11 8 11H78l8-11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M82.4 19.4h9.2L87 26Z" fillOpacity="0.75" />
      <circle className="spark-dot spark-dot-a" cx="10" cy="28" r="1.8" />
      <circle className="spark-dot spark-dot-b" cx="22" cy="18" r="1.4" />
      <circle className="spark-dot spark-dot-c" cx="16" cy="40" r="1.2" />
    </g>
  );
}

function GeographyFlourish() {
  return (
    <g className="spark-flourish spark-globe" fill="currentColor">
      <g transform="translate(90 26)">
        <circle r="11" fill="currentColor" fillOpacity="0.16" />
        <circle r="11" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <ellipse rx="4.6" ry="11" fill="none" stroke="currentColor" strokeWidth="0.85" />
        <path
          d="M-9.6-3.2h19.2M-10 3.6h20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
        />
      </g>
      <circle className="spark-dot spark-dot-a" cx="12" cy="30" r="2" />
      <circle className="spark-dot spark-dot-b" cx="24" cy="18" r="1.5" />
      <circle className="spark-dot spark-dot-c" cx="8" cy="46" r="1.3" />
    </g>
  );
}

function EconomicsFlourish() {
  return (
    <g className="spark-flourish spark-bars" fill="currentColor" transform="translate(76 28)">
      <rect className="spark-bar spark-bar-a" x="0" y="10" width="5" height="14" rx="1" />
      <rect className="spark-bar spark-bar-b" x="8" y="2" width="5" height="22" rx="1" />
      <rect className="spark-bar spark-bar-c" x="16" y="14" width="5" height="10" rx="1" />
    </g>
  );
}

function PsychologyFlourish() {
  return (
    <g className="spark-flourish spark-thought" fill="currentColor">
      <circle cx="14" cy="82" r="1.8" fillOpacity="0.55" />
      <circle cx="20" cy="74" r="2.5" fillOpacity="0.7" />
      <path
        d="M30 48c-9 0-15 6.4-15 14 0 5.2 3.2 9.8 8 12.2l-.6 7 8-4.8c1.2.2 2.4.3 3.6.3 9 0 15-6.4 15-14S39 48 30 48Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.15"
      />
    </g>
  );
}

function CsFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="currentColor"
      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      fontSize="12"
    >
      <text className="spark-bits spark-bits-a" x="0" y="30">
        01
      </text>
      <text className="spark-bits spark-bits-b" x="86" y="38">
        10
      </text>
      <rect className="spark-cursor" x="88" y="76" width="2" height="11" rx="0.5" />
    </g>
  );
}

function ArtsFlourish() {
  return (
    <g className="spark-flourish" fill="none" stroke="currentColor">
      <path
        className="spark-brush"
        d="M6 86c12-16 28-24 42-16 9 3 12 16 5 22"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle className="spark-dab" cx="90" cy="26" r="5.4" fill="currentColor" stroke="none" />
      <circle className="spark-dab" cx="78" cy="36" r="3.2" fill="currentColor" fillOpacity="0.55" stroke="none" />
    </g>
  );
}

function MusicFlourish() {
  return (
    <g
      className="spark-flourish"
      fill="currentColor"
      fontFamily="Geist, ui-sans-serif, system-ui, sans-serif"
      fontSize="18"
    >
      <text className="spark-note spark-note-a" x="2" y="34">
        ♪
      </text>
      <text className="spark-note spark-note-b" x="86" y="26">
        ♫
      </text>
    </g>
  );
}

function ResearchFlourish() {
  return (
    <g className="spark-flourish spark-lens" fill="none" stroke="currentColor">
      <circle cx="84" cy="26" r="9.2" strokeWidth="1.5" />
      <path d="M91 33.6 99 42" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="4" y="74" width="14" height="16" rx="1.6" fill="#121218" strokeWidth="1.1" />
      <rect
        x="10"
        y="70"
        width="14"
        height="16"
        rx="1.6"
        fill="#121218"
        fillOpacity="0.88"
        strokeWidth="1.1"
      />
    </g>
  );
}

function CasFlourish() {
  return (
    <g className="spark-flourish" fill="none" stroke="currentColor">
      <path
        className="spark-pulse"
        d="M4 82h14l5-14 7 24 5-10h16"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="spark-dot spark-dot-a" cx="88" cy="24" r="2.2" fill="currentColor" stroke="none" />
      <circle className="spark-dot spark-dot-b" cx="76" cy="36" r="1.6" fill="currentColor" stroke="none" />
      <circle className="spark-dot spark-dot-c" cx="94" cy="40" r="1.4" fill="currentColor" stroke="none" />
    </g>
  );
}

export function SubjectFlourish({ flavor }: { flavor: SparkFlavor }) {
  const mark =
    flavor === "math" ? (
      <MathFlourish />
    ) : flavor === "biology" ? (
      <BiologyFlourish />
    ) : flavor === "chemistry" ? (
      <ChemistryFlourish />
    ) : flavor === "physics" ? (
      <PhysicsFlourish />
    ) : flavor === "reading" ? (
      <ReadingFlourish />
    ) : flavor === "history" ? (
      <HistoryFlourish />
    ) : flavor === "geography" ? (
      <GeographyFlourish />
    ) : flavor === "economics" ? (
      <EconomicsFlourish />
    ) : flavor === "psychology" ? (
      <PsychologyFlourish />
    ) : flavor === "cs" ? (
      <CsFlourish />
    ) : flavor === "arts" ? (
      <ArtsFlourish />
    ) : flavor === "music" ? (
      <MusicFlourish />
    ) : flavor === "research" ? (
      <ResearchFlourish />
    ) : flavor === "cas" ? (
      <CasFlourish />
    ) : null;
  return (
    <g className="spark-subject-ink" style={{ color: SPARK_FLAVOR_INK[flavor] }}>
      {mark}
    </g>
  );
}
