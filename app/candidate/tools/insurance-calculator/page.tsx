"use client";

import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

const RATES = {
  employee: {
    social: 0.08,
    health: 0.015,
    unemployment: 0.01,
  },
  employer: {
    social: 0.175,
    health: 0.03,
    unemployment: 0.01,
    accidentDisease: 0.005,
  },
};

const MAX_SOCIAL_BASE = 36_000_000; // VND (20× base salary)
const MAX_UNEMPLOYMENT_BASE = 93_600_000; // VND (20× regional min wage)

function fmt(n: number) {
  return n.toLocaleString("vi-VN") + " ₫";
}

function calcInsurance(salary: number) {
  const socialBase = Math.min(salary, MAX_SOCIAL_BASE);
  const unemploymentBase = Math.min(salary, MAX_UNEMPLOYMENT_BASE);

  const employee = {
    social: Math.round(socialBase * RATES.employee.social),
    health: Math.round(socialBase * RATES.employee.health),
    unemployment: Math.round(unemploymentBase * RATES.employee.unemployment),
  };
  const employer = {
    social: Math.round(socialBase * RATES.employer.social),
    health: Math.round(socialBase * RATES.employer.health),
    unemployment: Math.round(unemploymentBase * RATES.employer.unemployment),
    accidentDisease: Math.round(socialBase * RATES.employer.accidentDisease),
  };

  return {
    employee,
    employeeTotal: employee.social + employee.health + employee.unemployment,
    employer,
    employerTotal: employer.social + employer.health + employer.unemployment + employer.accidentDisease,
  };
}

export default function InsuranceCalculatorPage() {
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calcInsurance> | null>(null);

  const rawValue = Number(salary.replace(/\D/g, ""));

  return (
    <ToolLayout
      icon="🛡️"
      title="Insurance Calculator"
      description="Estimate social insurance, health insurance, and unemployment contributions (Vietnam)"
    >
      <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Gross salary (VND / month)
          </label>
          <input
            type="text"
            value={salary}
            onChange={(e) => {
              const n = e.target.value.replace(/\D/g, "");
              setSalary(n ? Number(n).toLocaleString("vi-VN") : "");
              setResult(null);
            }}
            placeholder="e.g. 20,000,000"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-400 focus:ring-2 focus:ring-green-100"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Social insurance cap: {fmt(MAX_SOCIAL_BASE)} · Unemployment cap: {fmt(MAX_UNEMPLOYMENT_BASE)}
          </p>
        </div>

        <button
          onClick={() => rawValue && setResult(calcInsurance(rawValue))}
          disabled={!rawValue}
          className="w-full rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Employee */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">You pay</p>
              <span className="rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
                Employee
              </span>
            </div>
            <p className="mb-4 text-3xl font-bold text-gray-900">{fmt(result.employeeTotal)}</p>
            <div className="space-y-2.5 border-t border-gray-100 pt-4">
              {[
                { label: `Social insurance (${(RATES.employee.social * 100).toFixed(0)}%)`, value: result.employee.social },
                { label: `Health insurance (${(RATES.employee.health * 100).toFixed(1)}%)`, value: result.employee.health },
                { label: `Unemployment (${(RATES.employee.unemployment * 100).toFixed(0)}%)`, value: result.employee.unemployment },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="font-medium text-gray-800">{fmt(r.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Employer */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Employer pays</p>
              <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                Company
              </span>
            </div>
            <p className="mb-4 text-3xl font-bold text-gray-900">{fmt(result.employerTotal)}</p>
            <div className="space-y-2.5 border-t border-gray-100 pt-4">
              {[
                { label: `Social insurance (${(RATES.employer.social * 100).toFixed(1)}%)`, value: result.employer.social },
                { label: `Health insurance (${(RATES.employer.health * 100).toFixed(0)}%)`, value: result.employer.health },
                { label: `Unemployment (${(RATES.employer.unemployment * 100).toFixed(0)}%)`, value: result.employer.unemployment },
                { label: `Accident & disease (${(RATES.employer.accidentDisease * 100).toFixed(1)}%)`, value: result.employer.accidentDisease },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{r.label}</span>
                  <span className="font-medium text-gray-800">{fmt(r.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total cost */}
          <div className="sm:col-span-2 rounded-2xl border border-green-100 bg-green-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Total cost to employer</p>
                <p className="text-xs text-green-600 mt-0.5">Gross salary + employer contributions</p>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {fmt(rawValue + result.employerTotal)}
              </p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}