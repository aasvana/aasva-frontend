"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AXIS_TICK = { fontSize: 12, fill: "#9ca3af" } as const;

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid #f1f5f9",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  fontSize: 12,
  padding: "8px 12px",
} as const;

export const DONUT_COLORS = [
  "#10b981",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#f43f5e",
  "#14b8a6",
  "#6366f1",
  "#64748b",
  "#ec4899",
  "#84cc16",
];

type Series = {
  key: string;
  name: string;
  color?: string;
};

type FormatFn = (n: number) => string;

function makeFormatter(
  format?: FormatFn
): (value: number | string) => [string, string] {
  return (value) => {
    const n = Number(value);
    const label = Number.isFinite(n) ? (format ? format(n) : String(value)) : String(value);
    return [label, ""];
  };
}

export function AnalyticsBarChart({
  data,
  xKey,
  series,
  format,
  height = 240,
  stacked,
}: {
  data: unknown[];
  xKey: string;
  series: Series[];
  format?: FormatFn;
  height?: number;
  stacked?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
          width={46}
        />
        <Tooltip
          cursor={{ fill: "rgba(16, 185, 129, 0.06)" }}
          contentStyle={TOOLTIP_STYLE}
          formatter={makeFormatter(format)}
        />
        {series.map((s) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            fill={s.color ?? "#10b981"}
            radius={[6, 6, 0, 0]}
            maxBarSize={30}
            stackId={stacked ? "stack" : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsAreaChart({
  data,
  xKey,
  series,
  format,
  height = 240,
}: {
  data: unknown[];
  xKey: string;
  series: Series[];
  format?: FormatFn;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.key}
              id={`analytics-grad-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={s.color ?? "#10b981"}
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor={s.color ?? "#10b981"}
                stopOpacity={0.02}
              />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey={xKey}
          tickLine={false}
          axisLine={false}
          tick={AXIS_TICK}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} width={46} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={makeFormatter(format)} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stroke={s.color ?? "#10b981"}
            strokeWidth={2}
            fill={`url(#analytics-grad-${s.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AnalyticsDonutChart({
  data,
  format,
  height = 220,
}: {
  data: { label: string; value: number }[];
  format?: FormatFn;
  height?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={58}
            outerRadius={88}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={makeFormatter(format)}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((d, index) => (
          <div key={d.label} className="flex items-center gap-1.5 text-xs">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                background: DONUT_COLORS[index % DONUT_COLORS.length],
              }}
            />
            <span className="text-gray-500">{d.label}</span>
            <span className="font-medium text-gray-800">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
