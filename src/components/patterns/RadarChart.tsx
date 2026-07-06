// Presentational radar chart for the production-readiness diagnostic.
// No hooks, so it renders in both server components (the home showcase) and
// client components (the interactive scorecard).

export const READINESS_AXES = [
  "Evaluation",
  "Cost",
  "Observability",
  "Guardrails",
  "Oversight",
  "Reliability",
  "Governance",
];

const N = READINESS_AXES.length;
const W = 560;
const H = 460;
const CX = 280;
const CY = 215;
const R = 145;
const LABEL_R = 174;

function angle(i: number): number {
  return ((-90 + i * (360 / N)) * Math.PI) / 180;
}
function point(i: number, frac: number): [number, number] {
  const a = angle(i);
  return [CX + R * frac * Math.cos(a), CY + R * frac * Math.sin(a)];
}
function ringPath(frac: number): string {
  return (
    READINESS_AXES.map((_c, i) => {
      const [x, y] = point(i, frac);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ") + " Z"
  );
}

export function readinessBand(count: number, total: number): string {
  if (count === 0) return "Score your system";
  const pct = count / total;
  if (pct >= 0.9) return "Production ready";
  if (pct >= 0.7) return "Nearly there";
  if (pct >= 0.4) return "On the way";
  return "This is a demo";
}

export function RadarChart({
  values,
  max = 4,
  animate = false,
}: {
  values: number[];
  max?: number;
  animate?: boolean;
}) {
  const total = N * max;
  const count = values.reduce((n, v) => n + v, 0);
  const dataPath =
    READINESS_AXES.map((_c, i) => {
      const [x, y] = point(i, (values[i] ?? 0) / max);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ") + " Z";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`Production readiness radar: ${count} of ${total}`}
    >
      {[1, 2, 3, 4].map((lvl) => (
        <path
          key={lvl}
          d={ringPath(lvl / 4)}
          fill="none"
          className="stroke-line-1"
          strokeWidth={1}
        />
      ))}
      {READINESS_AXES.map((_c, i) => {
        const [x, y] = point(i, 1);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={x.toFixed(1)}
            y2={y.toFixed(1)}
            className="stroke-line-1"
            strokeWidth={1}
          />
        );
      })}
      <path
        d={dataPath}
        className="fill-accent-600 stroke-accent-600"
        style={{
          fillOpacity: 0.14,
          ...(animate ? { transition: "d var(--dur-base) var(--ease-out)" } : {}),
        }}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {READINESS_AXES.map((_c, i) => {
        const v = values[i] ?? 0;
        if (v === 0) return null;
        const [x, y] = point(i, v / max);
        return (
          <circle
            key={i}
            cx={x.toFixed(1)}
            cy={y.toFixed(1)}
            r={v === max ? 4.5 : 3.5}
            className="fill-accent-600"
          />
        );
      })}
      {READINESS_AXES.map((c, i) => {
        const a = angle(i);
        const lx = CX + LABEL_R * Math.cos(a);
        const ly = CY + LABEL_R * Math.sin(a);
        const cos = Math.cos(a);
        const anchor = cos > 0.3 ? "start" : cos < -0.3 ? "end" : "middle";
        const complete = (values[i] ?? 0) === max;
        return (
          <text
            key={i}
            x={lx.toFixed(1)}
            y={ly.toFixed(1)}
            textAnchor={anchor}
            dominantBaseline="middle"
            className={`font-mono uppercase ${complete ? "fill-accent-600" : "fill-ink-700"}`}
            style={{ fontSize: 11, letterSpacing: "0.06em" }}
          >
            {c}
          </text>
        );
      })}
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        className="font-display fill-ink-900"
        style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.035em" }}
      >
        {count}
      </text>
      <text
        x={CX}
        y={CY + 20}
        textAnchor="middle"
        className="font-mono fill-ink-300"
        style={{ fontSize: 13, letterSpacing: "0.08em" }}
      >
        / {total}
      </text>
      <text
        x={CX}
        y={CY + 40}
        textAnchor="middle"
        className="font-mono uppercase fill-accent-600"
        style={{ fontSize: 11, letterSpacing: "0.1em" }}
      >
        {readinessBand(count, total)}
      </text>
    </svg>
  );
}
