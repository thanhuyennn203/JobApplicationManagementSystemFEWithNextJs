"use client";

import { useState } from "react";
import { Calculator, Info, ChevronDown, ChevronUp, ArrowRightLeft } from "lucide-react";
import ToolLayout from "@/components/tools/ToolLayout";
import { fmt, formatInput, parseInput, grossToNet, netToGross, type SalaryResult } from "@/app/constants/salary";

type Mode = "gross-to-net" | "net-to-gross";

function InfoBox({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
          <Info size={15} />
          How does this work?
        </div>
        {open ? <ChevronUp size={15} className="text-blue-500" /> : <ChevronDown size={15} className="text-blue-500" />}
      </button>
      {open && (
        <div className="border-t border-blue-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-blue-800">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SalaryCalculatorPage() {
  const [mode, setMode] = useState<Mode>("gross-to-net");
  const [salary, setSalary] = useState("");
  const [dependants, setDependants] = useState(0);
  const [result, setResult] = useState<SalaryResult | null>(null);

  const rawValue = parseInput(salary);

  function calculate() {
    if (!rawValue) return;
    setResult(mode === "gross-to-net" ? grossToNet(rawValue, dependants) : netToGross(rawValue, dependants));
  }

  function switchMode() {
    setMode((m) => (m === "gross-to-net" ? "net-to-gross" : "gross-to-net"));
    setResult(null);
  }

  const isGrossMode = mode === "gross-to-net";

  return (
    <ToolLayout
      icon={<Calculator size={22} />}
      title="Gross / Net Salary Calculator"
      subtitle="Find out exactly how much you take home — or what gross salary you need to negotiate for."
    >
      <div className="space-y-4">
        {/* Info box */}
        <InfoBox>
          <p className="mb-3">
            In Vietnam, your paycheck is smaller than your gross salary because of three mandatory deductions:
          </p>
          <ul className="mb-3 space-y-1.5">
            <li>🏛️ <strong>Social insurance</strong> — 8% of your gross (capped at 36M ₫)</li>
            <li>🏥 <strong>Health insurance</strong> — 1.5% of your gross</li>
            <li>📋 <strong>Unemployment insurance</strong> — 1% of your gross</li>
          </ul>
          <p className="mb-3">
            After those deductions, your <strong>taxable income</strong> is calculated. From that, you get a personal deduction of 11M ₫/month and 4.4M ₫ per dependant you register. Whatever remains is taxed progressively — from 5% up to 35%.
          </p>
          <p className="text-blue-700 font-medium">Net = Gross − Insurance − Personal Income Tax</p>
        </InfoBox>

        {/* Mode toggle */}
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm">
          <button
            onClick={() => { setMode("gross-to-net"); setResult(null); }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${isGrossMode ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Gross → Net
          </button>
          <button onClick={switchMode} className="rounded-xl p-2 text-gray-400 hover:text-green-600 transition">
            <ArrowRightLeft size={15} />
          </button>
          <button
            onClick={() => { setMode("net-to-gross"); setResult(null); }}
            className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition ${!isGrossMode ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Net → Gross
          </button>
        </div>

        {/* Input card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {isGrossMode ? "Your gross salary" : "Your desired net salary"} <span className="text-gray-400 font-normal">(VND / month)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={salary}
                onChange={(e) => {
                  setSalary(formatInput(e.target.value));
                  setResult(null);
                }}
                placeholder="e.g. 20,000,000"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">₫</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Registered dependants <span className="text-gray-400 font-normal">(reduces taxable income by 4.4M ₫ each)</span>
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((d) => (
                <button
                  key={d}
                  onClick={() => { setDependants(d); setResult(null); }}
                  className={`h-10 w-10 rounded-xl border text-sm font-semibold transition ${
                    dependants === d
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-green-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={!rawValue}
            className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Calculate
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Hero */}
            <div className="rounded-2xl bg-green-600 p-6 text-center text-white">
              <p className="text-sm text-green-100">
                {isGrossMode ? "Monthly net salary (take-home)" : "Required gross salary"}
              </p>
              <p className="mt-1 text-4xl font-bold tracking-tight">
                {fmt(isGrossMode ? result.net : result.gross)}
              </p>
              <p className="mt-1 text-sm text-green-200">per month</p>
            </div>

            {/* Deductions breakdown */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-semibold text-gray-700">How it's calculated</p>
              <div className="space-y-3">
                <Row label="Gross salary" value={result.gross} bold />
                <Divider label="Insurance deductions" />
                <Row label="Social insurance (8%)" value={result.socialInsurance} minus />
                <Row label="Health insurance (1.5%)" value={result.healthInsurance} minus />
                <Row label="Unemployment insurance (1%)" value={result.unemploymentInsurance} minus />
                <SubTotal label="Total insurance" value={result.totalEmployeeInsurance} />
                <Divider label="Tax deductions" />
                <Row label="Personal deduction" value={result.personalDeduction} minus dim />
                {result.dependantDeduction > 0 && (
                  <Row label={`Dependant deduction (×${dependants})`} value={result.dependantDeduction} minus dim />
                )}
                <SubTotal label="Taxable income" value={Math.max(0, result.taxableIncome)} />
                <Row label="Personal income tax (PIT)" value={result.pit} minus red />
                <div className="border-t-2 border-gray-200 pt-3">
                  <Row label="Net salary" value={result.net} bold green />
                </div>
              </div>
            </div>

            {/* PIT breakdown */}
            {result.pit > 0 && result.pitBands.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <p className="mb-1 text-sm font-semibold text-gray-700">Tax brackets applied</p>
                <p className="mb-4 text-xs text-gray-400">Vietnam uses a progressive tax system — higher income is taxed at higher rates, only on the portion that falls in each bracket.</p>
                <div className="space-y-2">
                  {result.pitBands.map((band, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="mb-1 flex justify-between text-xs text-gray-500">
                          <span>{fmt(band.base)} × {(band.rate * 100).toFixed(0)}%</span>
                          <span className="font-medium text-gray-700">{fmt(band.tax)}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100">
                          <div
                            className="h-1.5 rounded-full bg-orange-400"
                            style={{ width: `${Math.min(100, (band.base / result.taxableIncome) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-dashed border-gray-200 pt-2 text-sm font-semibold">
                    <span className="text-gray-700">Total PIT</span>
                    <span className="text-orange-500">{fmt(result.pit)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Effective rate */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Effective tax rate", value: result.gross > 0 ? `${((result.pit / result.gross) * 100).toFixed(1)}%` : "0%" },
                { label: "Insurance deducted", value: fmt(result.totalEmployeeInsurance) },
                { label: "Total deductions", value: fmt(result.totalEmployeeInsurance + result.pit) },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center">
                  <p className="text-xs text-gray-400 leading-tight">{stat.label}</p>
                  <p className="mt-1 text-base font-semibold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function Row({ label, value, bold, minus, dim, red, green }: {
  label: string; value: number; bold?: boolean; minus?: boolean; dim?: boolean; red?: boolean; green?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`${bold ? "font-semibold text-gray-900" : dim ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </span>
      <span className={`${bold && green ? "font-bold text-green-600" : bold ? "font-semibold text-gray-900" : red ? "text-red-500" : minus ? "text-orange-500" : "text-gray-700"}`}>
        {minus ? `− ${fmt(value)}` : fmt(value)}
      </span>
    </div>
  );
}

function SubTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="font-semibold text-gray-800">{fmt(value)}</span>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="text-xs text-gray-400">{label}</span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  );
}