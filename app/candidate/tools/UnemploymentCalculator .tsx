import { useState } from "react";
import { ShieldCheck, Info, AlertTriangle, FileText } from "lucide-react";
import NumInput from "./NumInput";
import { fmt, REGIONAL_MIN_WAGE, REGIONAL_MIN_WAGE_HOURLY } from "./salaryUtils";

const REGION_NAMES: Record<string, string> = {
  "1": "Region I — Hanoi, HCMC core districts",
  "2": "Region II — other major cities & provinces",
  "3": "Region III — provincial cities & towns",
  "4": "Region IV — rural & mountainous areas",
};

interface BHTNResult {
  gross: number;
  base: number;
  cap: number;
  minWage: number;
  employeeContrib: number;
  employerContrib: number;
  totalContrib: number;
  region: string;
}

const REGION_ROWS = [
  { region: "I", monthly: 5_310_000, hourly: 25_500 },
  { region: "II", monthly: 4_730_000, hourly: 22_700 },
  { region: "III", monthly: 4_140_000, hourly: 20_000 },
  { region: "IV", monthly: 3_700_000, hourly: 17_800 },
];

export default function UnemploymentCalculator() {
  const [gross, setGross] = useState<number>(0);
  const [region, setRegion] = useState<string>("1");
  const [result, setResult] = useState<BHTNResult | null>(null);

  const calculate = () => {
    if (!gross) return;
    const minWage = REGIONAL_MIN_WAGE[region];
    const cap = minWage * 20;
    const base = Math.min(gross, cap);
    const employeeContrib = base * 0.01;
    const employerContrib = base * 0.01;
    setResult({
      gross,
      base,
      cap,
      minWage,
      employeeContrib,
      employerContrib,
      totalContrib: employeeContrib + employerContrib,
      region,
    });
  };

  return (
    <div className="space-y-4">
      {/* 2026 min wage reference table */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <div className="flex items-start gap-2">
          <Info size={15} className="text-indigo-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">
              Regional minimum wages 2026
            </p>
            <a
              href="https://thuvienphapluat.vn/phap-luat-doanh-nghiep/bai-viet/muc-luong-toi-thieu-vung-2026-muc-luong-co-so-2026-va-mot-so-luu-y-quan-trong-18204.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 mt-0.5 hover:text-indigo-600 underline underline-offset-2 transition-colors"
            >
              Per Decree No. 293/2025/ND-CP, effective 01/01/2026 ↗
            </a>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-orange-50 text-xs text-gray-600 font-medium">
                <th className="text-left px-3 py-2.5">Region</th>
                <th className="text-right px-3 py-2.5">Monthly (₫/month)</th>
                <th className="text-right px-3 py-2.5">Hourly (₫/hour)</th>
                <th className="text-right px-3 py-2.5">BHTN cap (×20)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {REGION_ROWS.map((r) => (
                <tr
                  key={r.region}
                  className={
                    region === String(REGION_ROWS.indexOf(r) + 1)
                      ? "bg-indigo-50 font-medium text-indigo-800"
                      : "text-gray-700"
                  }
                >
                  <td className="px-3 py-2.5">Region {r.region}</td>
                  <td className="px-3 py-2.5 text-right">
                    {r.monthly.toLocaleString("en-US")} ₫
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {r.hourly.toLocaleString("en-US")} ₫
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {(r.monthly * 20).toLocaleString("en-US")} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400">
          Increased ~7.2% from 2024 rates (Nghị định 74/2024/NĐ-CP). The highlighted row updates as you change region below.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800 space-y-2">
        <div className="flex items-center gap-2 font-medium">
          <Info size={15} />
          Unemployment insurance (BHTN) in Vietnam
        </div>
        <ul className="list-disc list-inside space-y-1 text-indigo-700 leading-relaxed">
          <li>
            Both employee and employer each contribute <strong>1%</strong> of
            the monthly salary to the unemployment fund.
          </li>
          <li>
            Contributions are <strong>capped at 20×</strong> the regional
            minimum wage — salary above that cap is not counted.
          </li>
          <li>
            To receive benefits, you must have contributed for at least{" "}
            <strong>12 months</strong> within the past 24 months.
          </li>
          <li>
            Benefit payout = <strong>60% of your average salary</strong> over
            the last 6 months, paid for 3–12 months depending on years
            contributed.
          </li>
        </ul>
        <div className="mt-2 bg-indigo-100 rounded-lg px-3 py-2 font-mono text-xs text-indigo-900 leading-relaxed whitespace-pre-wrap">
          {"Employee BHTN = min(Gross, Min wage × 20) × 1%\nEmployer BHTN = min(Gross, Min wage × 20) × 1%"}
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <ShieldCheck size={16} className="text-indigo-600" />
          BHTN calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Monthly gross salary (₫)
            </label>
            <NumInput
              value={gross}
              onChange={setGross}
              hint="Your agreed salary before any deductions"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Work region
            </label>
            <select
              value={region}
              onChange={(e) => { setRegion(e.target.value); setResult(null); }}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            >
              {Object.entries(REGION_NAMES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          Calculate BHTN
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FileText size={16} className="text-emerald-600" />
            Contribution breakdown
          </h3>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Contribution base", value: fmt(result.base), color: "text-gray-800" },
              { label: "Your contribution (1%)", value: fmt(result.employeeContrib), color: "text-red-600" },
              { label: "Employer pays (1%)", value: fmt(result.employerContrib), color: "text-emerald-600" },
            ].map((c) => (
              <div key={c.label} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                <p className={`text-base font-semibold ${c.color} leading-tight`}>{c.value}</p>
              </div>
            ))}
          </div>

          {/* Cap warning */}
          {result.gross > result.cap && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500" />
              <span>
                Your salary ({fmt(result.gross)}) exceeds the contribution cap
                of {fmt(result.cap)} (20 × {fmt(result.minWage)} regional
                minimum wage for Vùng {result.region}). BHTN is calculated on
                the capped amount only.
              </span>
            </div>
          )}

          {/* Detail rows */}
          <div className="divide-y divide-gray-100">
            {[
              { label: "Regional minimum wage (2026)", value: fmt(result.minWage), color: "text-gray-700" },
              { label: "Salary cap (20× min wage)", value: fmt(result.cap), color: "text-gray-700" },
              { label: "Effective contribution base", value: fmt(result.base), color: "text-gray-700" },
              { label: "Your deduction from salary", value: `−${fmt(result.employeeContrib)}/month`, color: "text-red-600" },
              { label: "Employer's portion (their cost)", value: `+${fmt(result.employerContrib)}/month`, color: "text-emerald-600" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-gray-500">{row.label}</span>
                <span className={`font-medium ${row.color}`}>{row.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 text-sm font-semibold">
              <span className="text-gray-800">Total going into BHTN fund</span>
              <span className="text-indigo-600 text-base">{fmt(result.totalContrib)}/month</span>
            </div>
          </div>

          {/* Benefit note */}
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-800">If you lose your job: </span>
            you may claim <strong>60%</strong> of your average salary over the last 6 months,
            paid for <strong>3–12 months</strong> depending on total years of BHTN contributions.
          </div>
        </div>
      )}
    </div>
  );
}