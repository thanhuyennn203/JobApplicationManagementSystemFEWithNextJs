"use client";

import { useEffect, useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
  ReferenceLine, Area, AreaChart, ComposedChart,
} from "recharts";
import { MetricDto, TopJobByApplicationDto, TotalMonthlyAnalytics } from "@/types/analytic";
import { getTotalMonthlyAnalytics } from "@/services/jobs/jobs.service";
import { getTopJobByApplication } from "@/services/application/application.service";
import { ApplicationStatus, getApplicationStatus } from "@/services/application/application.service";

interface MonthlyPoint {
  month: string;
  candidates: number;
  employers: number;
  applications: number;
  jobs: number;
  isPrediction?: boolean;
}

interface TrendInsight {
  type: "up" | "down" | "neutral";
  title: string;
  body: string;
}

interface AnalyticsData {
  monthly: MonthlyPoint[];
  conversionRate: number;
  insights: TrendInsight[];
}


// ─── Linear regression forecast ──────────────────────────────────────────────

function forecast(values: number[], steps = 3): number[] {
  const n = values.length;
  const xs = values.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  const slope =
    xs.reduce((sum, x, i) => sum + (x - meanX) * (values[i] - meanY), 0) /
    xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  return Array.from({ length: steps }, (_, i) =>
    Math.round(Math.max(0, intercept + slope * (n + i)))
  );
}

// ─── Mock API ────────────────────────────────────────────────────────────────

const MONTHS_FUTURE = ["Jan '26", "Feb '26", "Mar '26"];

const fetchAnalytics = async (): Promise<AnalyticsData> => {
  await new Promise((r) => setTimeout(r, 900));

  const historicalMonthly: MonthlyPoint[] = [
    { month: "Jan", candidates: 210, employers: 28, applications: 740, jobs: 95 },
    { month: "Feb", candidates: 245, employers: 31, applications: 870, jobs: 102 },
    { month: "Mar", candidates: 300, employers: 35, applications: 1020, jobs: 118 },
    { month: "Apr", candidates: 280, employers: 40, applications: 980, jobs: 130 },
    { month: "May", candidates: 390, employers: 52, applications: 1340, jobs: 145 },
    { month: "Jun", candidates: 430, employers: 58, applications: 1580, jobs: 160 },
    { month: "Jul", candidates: 470, employers: 61, applications: 1700, jobs: 172 },
    { month: "Aug", candidates: 510, employers: 70, applications: 1890, jobs: 185 },
    { month: "Sep", candidates: 490, employers: 65, applications: 1750, jobs: 178 },
    { month: "Oct", candidates: 540, employers: 74, applications: 2010, jobs: 196 },
    { month: "Nov", candidates: 580, employers: 80, applications: 2200, jobs: 210 },
    { month: "Dec", candidates: 402, employers: 55, applications: 1650, jobs: 214 },
  ];

  const fCandidates = forecast(historicalMonthly.map((m) => m.candidates));
  const fEmployers = forecast(historicalMonthly.map((m) => m.employers));
  const fApplications = forecast(historicalMonthly.map((m) => m.applications));
  const fJobs = forecast(historicalMonthly.map((m) => m.jobs));

  const predictionPoints: MonthlyPoint[] = MONTHS_FUTURE.map((month, i) => ({
    month,
    candidates: fCandidates[i],
    employers: fEmployers[i],
    applications: fApplications[i],
    jobs: fJobs[i],
    isPrediction: true,
  }));

  const lastVal = (key: keyof MonthlyPoint) =>
    historicalMonthly[historicalMonthly.length - 1][key] as number;
  const prevVal = (key: keyof MonthlyPoint) =>
    historicalMonthly[historicalMonthly.length - 2][key] as number;
  const pct = (k: keyof MonthlyPoint) =>
    Math.round(((lastVal(k) - prevVal(k)) / prevVal(k)) * 100 * 10) / 10;

  return {
    monthly: [...historicalMonthly, ...predictionPoints],
    conversionRate: 14.5,
    insights: [
      {
        type: "up",
        title: "Applications surging in Q4",
        body: "Applications grew 33% in Oct–Nov. Forecast shows this continues into Q1 2026, likely driven by peak hiring season.",
      },
      {
        type: "up",
        title: "Employer acquisition accelerating",
        body: "New employer sign-ups increased 28% MoM in Nov. Predicted to reach 90+ by Feb 2026 if growth holds.",
      },
      {
        type: "down",
        title: "Candidate dip in December",
        body: "New candidates dropped 31% in Dec, consistent with holiday seasonality. Expect recovery above 600 by Feb 2026.",
      },
      {
        type: "neutral",
        title: "Job postings plateauing",
        body: "Job volume grew steadily but is flattening at ~210. May indicate market saturation — consider outreach campaigns.",
      },
    ],
  };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"];

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

function TrendBadge({ change }: { change: number }) {
  const up = change >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
      {up ? "▲" : "▼"} {Math.abs(change)}%
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const isPred = payload[0]?.payload?.isPrediction;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-xs min-w-[140px]">
      <div className="flex items-center gap-1.5 mb-2">
        <p className="font-semibold text-gray-700">{label}</p>
        {isPred && <span className="px-1.5 py-0.5 bg-violet-100 text-violet-600 rounded-full text-[10px] font-medium">Forecast</span>}
      </div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color ?? p.stroke }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

type ChartTab = "candidates" | "applications" | "jobs" | "employers";

const CHART_META: Record<ChartTab, { key: string; color: string; label: string }> = {
  candidates: { key: "candidates", color: "#6366f1", label: "Candidates" },
  applications: { key: "applications", color: "#8b5cf6", label: "Applications" },
  jobs: { key: "jobs", color: "#f59e0b", label: "Jobs" },
  employers: { key: "employers", color: "#10b981", label: "Employers" },
};

const INSIGHT_META = {
  up: { icon: "↑", bg: "bg-emerald-50", border: "border-emerald-100", icon_color: "text-emerald-500", title_color: "text-emerald-800" },
  down: { icon: "↓", bg: "bg-red-50", border: "border-red-100", icon_color: "text-red-400", title_color: "text-red-700" },
  neutral: { icon: "→", bg: "bg-amber-50", border: "border-amber-100", icon_color: "text-amber-500", title_color: "text-amber-800" },
};

// Dot that differentiates predicted vs real
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (!payload?.isPrediction) return null;
  return <circle cx={cx} cy={cy} r={3} fill="#8b5cf6" stroke="#fff" strokeWidth={2} />;
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartTab, setChartTab] = useState<ChartTab>("applications");
  const [totalMonthlyAnalytics, setTotalMonthlyAnalytics] = useState<TotalMonthlyAnalytics | null>(null);
  const [topJobByApplication, setTopJobByApplication] = useState<TopJobByApplicationDto[] | null>(null);
  const [applicationStatusPie, setApplicationStatusPie] = useState<ApplicationStatus[] | null>(null);

  useEffect(() => {
  setLoading(true);

  Promise.allSettled([
    fetchAnalytics(),
    getApplicationStatus(),
    getTopJobByApplication(),
    getTotalMonthlyAnalytics(),
  ]).then(([analytics, appStatus, topJob, monthly]) => {
    if (analytics.status === "fulfilled")
      setData(analytics.value || {});

    if (appStatus.status === "fulfilled")
      setApplicationStatusPie(appStatus.value);

    if (topJob.status === "fulfilled")
      setTopJobByApplication(topJob.value);

    if (monthly.status === "fulfilled")
      setTotalMonthlyAnalytics(monthly.value || []);

    console.log("monthly: " , monthly);

    const anyFailed = [analytics, appStatus, topJob, monthly]
      .some((r) => r.status === "rejected");

    if (anyFailed)
      setError("Some analytics data failed to load.");
  }).finally(() => setLoading(false));
}, []);

  const conversionRate = (() => {

    const total = applicationStatusPie?.reduce(
      (sum, item) => sum + item.value,
      0
    );

    const accepted =
      applicationStatusPie?.find(
        item => item.name === "ACCEPTED"
      )?.value ?? 0;


    return total > 0
      ? ((accepted / total) * 100).toFixed(1)
      : 0;

  })();

  console.log("total",totalMonthlyAnalytics);

  const analyticsCards = totalMonthlyAnalytics
    ? [
      {
        label: "Active Jobs",
        value: totalMonthlyAnalytics.openJobs.total,
        change: totalMonthlyAnalytics.openJobs.growthPercent,
        forecast: totalMonthlyAnalytics.openJobs.predictionNextMonth,
      },
      {
        label: "Applications",
        value: totalMonthlyAnalytics.appliedApplications.total,
        change: totalMonthlyAnalytics.appliedApplications.growthPercent,
        forecast: totalMonthlyAnalytics.appliedApplications.predictionNextMonth,
      },
      {
        label: "New Candidates",
        value: totalMonthlyAnalytics.newCandidates.total,
        change: totalMonthlyAnalytics.newCandidates.growthPercent,
        forecast: totalMonthlyAnalytics.newCandidates.predictionNextMonth,
      },
      {
        label: "New Employers",
        value: totalMonthlyAnalytics.newEmployers.total,
        change: totalMonthlyAnalytics.newEmployers.growthPercent,
        forecast: totalMonthlyAnalytics.newEmployers.predictionNextMonth,
      },
    ]
    : [];

  console.log(analyticsCards);
  // Index of first prediction point for ReferenceLine
  const predictionStartIndex = useMemo(
    () => data?.monthly.findIndex((m) => m.isPrediction) ?? -1,
    [data]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm">Loading analytics…</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-red-400 text-sm">
        <span className="text-3xl">Loading...</span>{error}
      </div>
    );
  }

  const predMonth = predictionStartIndex >= 0 ? data.monthly[predictionStartIndex].month : null;

  return (
    <div className="p-6 flex flex-col gap-6 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform overview · 12-month history + 3-month forecast</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
          <span className="text-xs text-gray-400">Actual</span>
          <span className="w-2 h-2 rounded-full bg-violet-400 inline-block ml-2" />
          <span className="text-xs text-gray-400">Forecast (linear regression)</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{s.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-900">{fmt(s.value)}</span>
              <TrendBadge change={s.change} />
            </div>
            {s.forecast !== undefined && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Next month forecast</span>
                <span className="text-xs font-bold text-violet-600">{fmt(s.forecast)}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trend insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {data.insights.map((ins) => {
          const m = INSIGHT_META[ins.type];
          return (
            <div key={ins.title} className={`${m.bg} border ${m.border} rounded-xl p-4 flex flex-col gap-2`}>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${m.icon_color}`}>{m.icon}</span>
                <span className={`text-xs font-semibold ${m.title_color}`}>{ins.title}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{ins.body}</p>
            </div>
          );
        })}
      </div>
      
      

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Application status donut */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Application Status</h2>

          <div className="flex items-center gap-4">

            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={applicationStatusPie} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                  {applicationStatusPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>


            <div className="flex flex-col gap-2 flex-1">

              {applicationStatusPie.map((s, i) => {

                const total = applicationStatusPie.reduce((a, b) => a + b.value, 0);
                const pct = total > 0 ? ((s.value / total) * 100).toFixed(1) : 0;

                return (
                  <div key={s.name} className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />

                    <span className="text-xs text-gray-600 flex-1">
                      {s.name}
                    </span>

                    <span className="text-xs font-semibold text-gray-800">
                      {pct}%
                    </span>

                  </div>
                );

              })}

            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Application → Hire conversion
            </span>
            <span className="text-sm font-bold text-indigo-600">
              {conversionRate ?? 0}%
            </span>
          </div>
        </div>

        {/* Top jobs */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">
            Top Jobs by Applications
          </h2>

          <div className="flex flex-col gap-3">

            {(topJobByApplication ?? []).map((job, i) => {
              return (
                <div key={job.jobId}>

                  <div className="flex items-center justify-between mb-1">

                    <div className="flex items-center gap-2 min-w-0">

                      <span className="text-xs font-bold text-gray-600 w-4 shrink-0">
                        {i + 1}
                      </span>


                      <div className="min-w-0">

                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {job.jobTitle}
                        </p>


                        <p className="text-[10px] text-gray-400 truncate">
                          {job.companyName}
                        </p>

                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-700 ml-2 shrink-0">
                      {job.applicationCount}
                    </span>
                  </div>
                  <hr className="text-gray-200" />
                </div>
              );

            })}

          </div>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-gray-800">Monthly Breakdown</h2>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-gray-300 rounded inline-block" />Actual
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-1 bg-violet-300 rounded inline-block" />Forecast
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.monthly} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barSize={8} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8", paddingTop: 12 }} />
            {predMonth && (
              <ReferenceLine x={predMonth} stroke="#8b5cf6" strokeDasharray="4 3" strokeWidth={1.5} />
            )}
            <Bar dataKey="candidates" name="Candidates" radius={[3, 3, 0, 0]}
              fill="#6366f1"
              shape={(props: any) => {
                const isPred = props.isPrediction;
                return <rect {...props} fill={isPred ? "#c4b5fd" : "#6366f1"} rx={3} />;
              }}
            />
            <Bar dataKey="jobs" name="Jobs" radius={[3, 3, 0, 0]}
              fill="#f59e0b"
              shape={(props: any) => {
                const isPred = props.isPrediction;
                return <rect {...props} fill={isPred ? "#fde68a" : "#f59e0b"} rx={3} />;
              }}
            />
            <Bar dataKey="employers" name="Employers" radius={[3, 3, 0, 0]}
              fill="#10b981"
              shape={(props: any) => {
                const isPred = props.isPrediction;
                return <rect {...props} fill={isPred ? "#a7f3d0" : "#10b981"} rx={3} />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}