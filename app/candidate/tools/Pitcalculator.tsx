import { useState } from "react";
import { Landmark, Info, ReceiptText } from "lucide-react";
import NumInput from "./NumInput";
import {
  calcPIT,
  fmt,
  TAX_BRACKETS,
  PERSONAL_DEDUCTION,
  DEPENDENT_DEDUCTION,
  type TaxBracketResult,
} from "./salaryUtils";

const BRACKET_LABELS = [
  "0 – 5M",
  "5 – 10M",
  "10 – 18M",
  "18 – 32M",
  "32 – 52M",
  "52 – 80M",
  "80M+",
];

interface PITState {
  taxable: number;
  tax: number;
  brackets: TaxBracketResult[];
  effectiveRate: number;
}

export default function PITCalculator() {
  const [gross, setGross] = useState<number>(0);
  const [insurance, setInsurance] = useState<number>(0);
  const [dependents, setDependents] = useState<number>(0);
  const [result, setResult] = useState<PITState | null>(null);

  const calculate = () => {
    if (!gross) return;
    const ins = insurance > 0 ? insurance : gross * 0.105;
    const taxable = Math.max(
      0,
      gross - ins - PERSONAL_DEDUCTION - dependents * DEPENDENT_DEDUCTION
    );
    const { tax, brackets } = calcPIT(taxable);
    const effectiveRate = taxable > 0 ? (tax / taxable) * 100 : 0;
    setResult({ taxable, tax, brackets, effectiveRate });
  };

  return (
    <div className="space-y-4">
      {/* Info box */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800 space-y-2">
        <div className="flex items-center gap-2 font-medium">
          <Info size={15} />
          How Personal Income Tax (PIT) works in Vietnam
        </div>
        <ul className="list-disc list-inside space-y-1 text-indigo-700 leading-relaxed">
          <li>
            <strong>Progressive brackets:</strong> different rates apply to
            different portions of your income, not your entire salary.
          </li>
          <li>
            <strong>Taxable income</strong> = Gross − Insurance − Personal
            deduction (11M) − Dependent deductions (4.4M × dependents)
          </li>
          <li>
            Rates range from <strong>5%</strong> (first 5M) to{" "}
            <strong>35%</strong> (above 80M taxable income per month).
          </li>
          <li>
            Only the <em>portion within each bracket</em> is taxed at that rate.
          </li>
        </ul>
        <div className="mt-2 bg-indigo-100 rounded-lg px-3 py-2 font-mono text-xs text-indigo-900 leading-relaxed">
          Taxable = Gross − Insurance − 11,000,000 − (Dependents × 4,400,000)
        </div>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Landmark size={16} className="text-indigo-600" />
          PIT calculator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Monthly gross salary (₫)
            </label>
            <NumInput
              value={gross}
              onChange={setGross}
              hint="Before any deductions"
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
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} — saves {fmt(n * DEPENDENT_DEDUCTION)} tax base
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Total insurance contributions (₫){" "}
            <span className="ml-1 text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
              optional
            </span>
          </label>
          <NumInput
            value={insurance}
            onChange={setInsurance}
            hint="Leave blank to auto-calculate at 10.5% of gross (8% BHXH + 1.5% BHYT + 1% BHTN)"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          Calculate PIT
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <ReceiptText size={16} className="text-indigo-600" />
            Tax breakdown by bracket
          </h3>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Taxable income", value: fmt(result.taxable), color: "text-gray-800" },
              { label: "Total PIT owed", value: fmt(result.tax), color: "text-red-600" },
              {
                label: "Effective rate",
                value: result.effectiveRate.toFixed(1) + "%",
                color: "text-indigo-600",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-gray-50 border border-gray-100 rounded-lg p-3"
              >
                <p className="text-xs text-gray-500 mb-1">{c.label}</p>
                <p className={`text-base font-semibold ${c.color} leading-tight`}>
                  {c.value}
                </p>
              </div>
            ))}
          </div>

          {/* Bracket table */}
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 font-medium">
                  <th className="text-left px-3 py-2.5">Bracket (₫M/month)</th>
                  <th className="text-left px-3 py-2.5">Rate</th>
                  <th className="text-right px-3 py-2.5">Portion taxed</th>
                  <th className="text-right px-3 py-2.5">Tax due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TAX_BRACKETS.map((b, i) => {
                  const filled = result.brackets.find(
                    (br) => br.rate === b.rate
                  );
                  return (
                    <tr
                      key={i}
                      className={
                        filled
                          ? "bg-indigo-50 text-indigo-800 font-medium"
                          : "text-gray-400"
                      }
                    >
                      <td className="px-3 py-2.5">{BRACKET_LABELS[i]}</td>
                      <td className="px-3 py-2.5">
                        {(b.rate * 100).toFixed(0)}%
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {filled ? fmt(filled.income) : "—"}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        {filled ? fmt(filled.amount) : "—"}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-semibold text-gray-800">
                  <td colSpan={3} className="px-3 py-2.5">
                    Total PIT
                  </td>
                  <td className="px-3 py-2.5 text-right text-indigo-600">
                    {fmt(result.tax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}