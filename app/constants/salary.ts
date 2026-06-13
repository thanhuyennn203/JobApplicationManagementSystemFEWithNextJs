// ─── Constants ────────────────────────────────────────────────────────────────
export const PERSONAL_DEDUCTION = 11_000_000;       // VND/month (self)
export const DEPENDANT_DEDUCTION = 4_400_000;       // VND/month per dependant
export const SOCIAL_CAP = 36_000_000;               // max base for social/health insurance
export const UNEMPLOYMENT_CAP = 46_800_000;         // max base for unemployment insurance (20× regional min)

export const EMPLOYEE_RATES = {
  social: 0.08,
  health: 0.015,
  unemployment: 0.01,
};

export const EMPLOYER_RATES = {
  social: 0.175,
  health: 0.03,
  unemployment: 0.01,
  accident: 0.005,
};

// Progressive PIT brackets (taxable income per month, VND)
export const PIT_BRACKETS = [
  { limit: 5_000_000,  rate: 0.05 },
  { limit: 10_000_000, rate: 0.10 },
  { limit: 18_000_000, rate: 0.15 },
  { limit: 32_000_000, rate: 0.20 },
  { limit: 52_000_000, rate: 0.25 },
  { limit: 80_000_000, rate: 0.30 },
  { limit: Infinity,   rate: 0.35 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function fmt(n: number): string {
  return Math.round(n).toLocaleString("vi-VN") + " ₫";
}

export function parseInput(raw: string): number {
  return Number(raw.replace(/\D/g, "")) || 0;
}

export function formatInput(raw: string): string {
  const n = raw.replace(/\D/g, "");
  return n ? Number(n).toLocaleString("vi-VN") : "";
}

// ─── PIT calculation ─────────────────────────────────────────────────────────
export interface PitBand {
  from: number;
  to: number | null;
  rate: number;
  base: number;
  tax: number;
}

export function calcPIT(taxableIncome: number): { total: number; bands: PitBand[] } {
  if (taxableIncome <= 0) return { total: 0, bands: [] };

  const bands: PitBand[] = [];
  let prev = 0;
  let remaining = taxableIncome;

  for (const bracket of PIT_BRACKETS) {
    if (remaining <= 0) break;
    const band = Math.min(remaining, bracket.limit - prev);
    const tax = Math.round(band * bracket.rate);
    bands.push({ from: prev, to: bracket.limit === Infinity ? null : bracket.limit, rate: bracket.rate, base: band, tax });
    remaining -= band;
    prev = bracket.limit;
  }

  return { total: bands.reduce((s, b) => s + b.tax, 0), bands };
}

// ─── Full gross → net ─────────────────────────────────────────────────────────
export interface SalaryResult {
  gross: number;
  net: number;
  socialInsurance: number;
  healthInsurance: number;
  unemploymentInsurance: number;
  totalEmployeeInsurance: number;
  personalDeduction: number;
  dependantDeduction: number;
  taxableIncome: number;
  pit: number;
  pitBands: PitBand[];
}

export function grossToNet(gross: number, dependants: number): SalaryResult {
  const socialBase = Math.min(gross, SOCIAL_CAP);
  const unemploymentBase = Math.min(gross, UNEMPLOYMENT_CAP);

  const socialInsurance = Math.round(socialBase * EMPLOYEE_RATES.social);
  const healthInsurance = Math.round(socialBase * EMPLOYEE_RATES.health);
  const unemploymentInsurance = Math.round(unemploymentBase * EMPLOYEE_RATES.unemployment);
  const totalEmployeeInsurance = socialInsurance + healthInsurance + unemploymentInsurance;

  const personalDeduction = PERSONAL_DEDUCTION;
  const dependantDeduction = dependants * DEPENDANT_DEDUCTION;
  const taxableIncome = Math.max(0, gross - totalEmployeeInsurance - personalDeduction - dependantDeduction);

  const { total: pit, bands: pitBands } = calcPIT(taxableIncome);
  const net = gross - totalEmployeeInsurance - pit;

  return {
    gross, net, socialInsurance, healthInsurance, unemploymentInsurance,
    totalEmployeeInsurance, personalDeduction, dependantDeduction,
    taxableIncome, pit, pitBands,
  };
}

export function netToGross(net: number, dependants: number): SalaryResult {
  let lo = net, hi = net * 3;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (grossToNet(mid, dependants).net < net) lo = mid;
    else hi = mid;
  }
  return grossToNet(Math.round((lo + hi) / 2), dependants);
}