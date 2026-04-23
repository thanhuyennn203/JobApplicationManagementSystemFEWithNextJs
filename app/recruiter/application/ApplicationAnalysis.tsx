"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAppliedJobByCompanyId } from "@/services/application/application.service";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function ApplicationAnalysis() {
    const auth = useAuth();
    const companyId = auth?.user?.companyId;

    const [applications, setApplications] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);

    useEffect(() => {
        if (!companyId) return;

        getAppliedJobByCompanyId(Number(companyId)).then(setApplications);
    }, [companyId]);

    // fetch jobs
    useEffect(() => {
        if (!companyId) return;

        fetch(`http://localhost:9191/api/jobs/company/${companyId}`)
            .then(res => res.json())
            .then(setJobs);
    }, [companyId]);
    // 📊 stats
    const total = applications.length;

    const countByStatus = (status: string) =>
        applications.filter(a => a.status === status).length;

    const applied = countByStatus("APPLIED");
    const accepted = countByStatus("ACCEPTED");
    const rejected = countByStatus("REJECTED");
    const pending = countByStatus("PENDING");

    const acceptanceRate = total
        ? Math.round((accepted / total) * 100)
        : 0;

    // group data
    // create map: jobId -> count
    const appCountMap: Record<number, number> = {};

    applications.forEach(app => {
        const jobId = app.jobId;
        appCountMap[jobId] = (appCountMap[jobId] || 0) + 1;
    });

    // ✅ build from ALL jobs (important)
    const chartData = jobs.map(job => ({
        name: `#${job.id}`,
        applications: appCountMap[job.id] || 0,
        title: job.title,
    }))
        .sort((a, b) => b.applications - a.applications);

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">

            {/* HEADER */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Recruitment Overview</h2>
                <p className="text-sm text-gray-400">
                    Insights into your candidate pipeline
                </p>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <StatCard label="Total" value={total} />
                <StatCard label="Applied" value={applied} />
                <StatCard label="Accepted" value={accepted} highlight />
                <StatCard label="Rejected" value={rejected} danger />
                <StatCard label="Pending" value={pending} />
            </div>

            {/* 🔥 MAIN SPLIT */}
            <div className="grid grid-cols-3 gap-6">

                {/* LEFT: BIG CHART */}
                <div className="col-span-2 bg-[#f9fafb] rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-3">
                        Applications by Job
                    </h3>

                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart
                            data={chartData}
                            barCategoryGap="25%"
                            barGap={2}
                        >
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 11 }}
                            />

                            <YAxis allowDecimals={false} />

                            <Tooltip
                                formatter={(value: any, _: any, props: any) => [
                                    value,
                                    props.payload.title,
                                ]}
                            />

                            <Bar
                                dataKey="applications"
                                fill="#00b14f"
                                radius={[6, 6, 0, 0]}
                                barSize={26} // slimmer bars
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* RIGHT: PROGRESS + RATE */}
                <div className="bg-[#f9fafb] rounded-xl p-4 flex flex-col justify-between">

                    <div>
                        <h3 className="text-sm font-semibold mb-4">
                            Candidate Status
                        </h3>

                        <div className="space-y-4">
                            <ProgressRow label="Applied" value={applied} total={total} color="#6bb2ff" />
                            <ProgressRow label="Accepted" value={accepted} total={total} color="#00b14f" />
                            <ProgressRow label="Rejected" value={rejected} total={total} color="#ff4d4f" />
                            <ProgressRow label="Pending" value={pending} total={total} color="#facc15" />
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-center">
                        <p className="text-gray-400">Acceptance Rate</p>
                        <p className="text-xl font-semibold text-[#00b14f]">
                            {acceptanceRate}%
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ---------- SMALL COMPONENTS ---------- */

function StatCard({
    label,
    value,
    highlight,
    danger,
}: any) {
    return (
        <div className="bg-[#f9fafb] rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <h3
                className={`text-lg font-semibold ${highlight
                    ? "text-[#00b14f]"
                    : danger
                        ? "text-red-500"
                        : ""
                    }`}
            >
                {value}
            </h3>
        </div>
    );
}

function ProgressRow({
    label,
    value,
    total,
    color,
}: any) {
    const percent = total ? (value / total) * 100 : 0;

    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span>{label}</span>
                <span>{value}</span>
            </div>

            <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                    className="h-2 rounded-full"
                    style={{
                        width: `${percent}%`,
                        background: color,
                    }}
                />
            </div>
        </div>
    );
}