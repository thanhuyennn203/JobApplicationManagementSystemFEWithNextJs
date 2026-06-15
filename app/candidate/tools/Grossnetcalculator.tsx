import { useState } from "react";
import { ArrowLeftRight, Calculator, TrendingDown, Info } from "lucide-react";
import NumInput from "./NumInput";
import { calcFromGross, calcFromNet, fmt, DEPENDENT_DEDUCTION, type GrossNetResult } from "./salaryUtils";

const DEPENDENTS_OPTIONS = [0, 1, 2, 3, 4, 5];

export default function GrossNetCalculator() {
  const [mode, setMode] = useState<"gross_to_net" | "net_to_gross">("gross_to_net");
  const [salary, setSalary] = useState<number>(0);
  const [dependents, setDependents] = useState<number>(0);
  const [result, setResult] = useState<GrossNetResult | null>(null);

  const calculate = () => {
    if (!salary) return;
    const r =
      mode === "gross_to_net"
        ? calcFromGross(salary, dependents)
        : calcFromNet(salary, dependents);
    setResult(r);
  };

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800 space-y-2">
        <div className="flex items-center gap-2 font-medium">
          <Info size={15} />
          What is Gross vs Net salary?
        </div>
        <ul className="list-disc list-inside space-y-1 text-indigo-700 leading-relaxed">
          <li>
            <strong>Gross salary</strong> — the full amount your employer agrees
            to pay before any deductions.
          </li>
          <li>
            <strong>Net salary</strong> — the amount deposited into your bank
            account after tax &amp; insurance are deducted.
          </li>
          <li>
            <strong>Formula:</strong> Net = Gross − Insurance (BHXH + BHYT +
            BHTN) − Personal Income Tax
          </li>
          <li>
            <strong>Personal deduction:</strong> 11,000,000 ₫/month for
            yourself + 4,400,000 ₫/month per dependent
          </li>
        </ul>
        <div className="mt-2 bg-indigo-100 rounded-lg px-3 py-2 font-mono text-xs text-indigo-900 leading-relaxed">
          Net = Gross − (8% + 1.5% + 1%) × Gross − PIT
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Calculator size={16} className="text-indigo-600" />
          Calculate salary
        </h3>

        {/* Mode toggle */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Calculation mode
          </label>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">
            {(
              [
                { value: "gross_to_net", label: "Gross → Net" },
                { value: "net_to_gross", label: "Net → Gross" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setMode(opt.value);
                  setResult(null);
                }}
                className={`flex-1 py-2 px-3 flex items-center justify-center gap-1.5 transition ${
                  mode === opt.value
                    ? "bg-indigo-600 text-white font-medium"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <ArrowLeftRight size={13} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              {mode === "gross_to_net"
                ? "Gross salary (₫/month)"
                : "Desired net salary (₫/month)"}
            </label>
            <NumInput
              value={salary}
              onChange={setSalary}
              hint="e.g. 20,000,000"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Number of dependents
            </label>
            <select
              value={dependents}
              onChange={(e) => setDependents(parseInt(e.target.value))}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            >
              {DEPENDENTS_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} dependent{n !== 1 ? "s" : ""} (−
                  {(n * (DEPENDENT_DEDUCTION / 1_000_000)).toFixed(1)}M ₫)
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          Calculate
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <TrendingDown size={16} className="text-emerald-600" />
            Result
          </h3>

          {/* Summary cards — answer card is highlighted based on mode */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Gross salary",
                value: fmt(result.gross),
                color: mode === "net_to_gross" ? "text-indigo-600" : "text-gray-700",
                highlight: mode === "net_to_gross",
              },
              {
                label: "Net salary",
                value: fmt(result.net),
                color: mode === "gross_to_net" ? "text-emerald-600" : "text-gray-700",
                highlight: mode === "gross_to_net",
              },
              {
                label: "Total deductions",
                value: fmt(result.totalInsurance + result.tax),
                color: "text-red-600",
                highlight: false,
              },
            ].map((c) => (
              <div
                key={c.label}
                className={`border rounded-lg p-3 ${
                  c.highlight
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                <p className={`text-base font-semibold ${c.color} leading-tight`}>
                  {c.value}
                </p>
                {c.highlight && (
                  <p className="text-xs text-indigo-500 mt-1">← answer</p>
                )}
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="divide-y divide-gray-100">
            {[
              {
                label: "Social insurance (BHXH)",
                note: "8% of gross",
                value: result.bhxh,
                deduct: true,
              },
              {
                label: "Health insurance (BHYT)",
                note: "1.5% of gross",
                value: result.bhyt,
                deduct: true,
              },
              {
                label: "Unemployment ins. (BHTN)",
                note: "1% of gross",
                value: result.bhtn,
                deduct: true,
              },
              {
                label: "Personal deduction",
                note: "11M/month",
                value: result.personalDeduction,
                deduct: false,
                neutral: true,
              },
              ...(result.dependentDeduction > 0
                ? [
                    {
                      label: "Dependent deduction",
                      note: `${dependents} × 4.4M`,
                      value: result.dependentDeduction,
                      deduct: false,
                      neutral: true,
                    },
                  ]
                : []),
              {
                label: "Taxable income",
                note: "",
                value: result.taxable,
                deduct: false,
                neutral: true,
              },
              {
                label: "Personal income tax (PIT)",
                note: "",
                value: result.tax,
                deduct: true,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="text-gray-600">
                  {row.label}
                  {row.note && (
                    <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      {row.note}
                    </span>
                  )}
                </span>
                <span
                  className={`font-medium ${
                    row.deduct
                      ? "text-red-600"
                      : row.neutral
                      ? "text-gray-700"
                      : "text-gray-900"
                  }`}
                >
                  {row.deduct ? "−" : ""}{fmt(row.value)}
                </span>
              </div>
            ))}

            {/* Net total */}
            <div className="flex items-center justify-between pt-3 text-sm font-semibold">
              <span className="text-gray-800">Net salary</span>
              <span className="text-indigo-600 text-base">{fmt(result.net)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}