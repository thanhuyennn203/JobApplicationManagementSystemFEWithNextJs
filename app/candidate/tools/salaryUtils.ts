// ─── Salary calculation utilities ────────────────────────────────────────────

export const PERSONAL_DEDUCTION = 11_000_000; // 11M ₫/month
export const DEPENDENT_DEDUCTION = 4_400_000; // 4.4M ₫/month per dependent

// Monthly minimum wages per Nghị định 293/2025/NĐ-CP, effective 01/01/2026
export const REGIONAL_MIN_WAGE: Record<string, number> = {
  "1": 5_310_000,
  "2": 4_730_000,
  "3": 4_140_000,
  "4": 3_700_000,
};

// Hourly minimum wages per Nghị định 293/2025/NĐ-CP, effective 01/01/2026
export const REGIONAL_MIN_WAGE_HOURLY: Record<string, number> = {
  "1": 25_500,
  "2": 22_700,
  "3": 20_000,
  "4": 17_800,
};

export const TAX_BRACKETS: { max: number; rate: number }[] = [
  { max: 5_000_000, rate: 0.05 },
  { max: 10_000_000, rate: 0.1 },
  { max: 18_000_000, rate: 0.15 },
  { max: 32_000_000, rate: 0.2 },
  { max: 52_000_000, rate: 0.25 },
  { max: 80_000_000, rate: 0.3 },
  { max: Infinity, rate: 0.35 },
];

export interface TaxBracketResult {
  rate: number;
  income: number;
  amount: number;
}

export interface PITResult {
  tax: number;
  brackets: TaxBracketResult[];
}

export function calcPIT(taxableIncome: number): PITResult {
  if (taxableIncome <= 0) return { tax: 0, brackets: [] };
  let remaining = taxableIncome;
  let tax = 0;
  const brackets: TaxBracketResult[] = [];
  let prev = 0;
  for (const b of TAX_BRACKETS) {
    const bandSize =
      b.max === Infinity ? remaining : Math.min(b.max - prev, remaining);
    if (bandSize <= 0) break;
    const taxed = bandSize * b.rate;
    brackets.push({ rate: b.rate, income: bandSize, amount: taxed });
    tax += taxed;
    remaining -= bandSize;
    prev = b.max;
    if (remaining <= 0) break;
  }
  return { tax, brackets };
}

export interface GrossNetResult {
  gross: number;
  net: number;
  bhxh: number;
  bhyt: number;
  bhtn: number;
  totalInsurance: number;
  personalDeduction: number;
  dependentDeduction: number;
  taxable: number;
  tax: number;
  brackets: TaxBracketResult[];
}

export function calcFromGross(gross: number, dependents: number): GrossNetResult {
  const bhxh = gross * 0.08;
  const bhyt = gross * 0.015;
  const bhtn = gross * 0.01;
  const totalInsurance = bhxh + bhyt + bhtn;
  const personalDeduction = PERSONAL_DEDUCTION;
  const dependentDeduction = dependents * DEPENDENT_DEDUCTION;
  const taxable = Math.max(
    0,
    gross - totalInsurance - personalDeduction - dependentDeduction
  );
  const { tax, brackets } = calcPIT(taxable);
  const net = gross - totalInsurance - tax;
  return {
    gross,
    net,
    bhxh,
    bhyt,
    bhtn,
    totalInsurance,
    personalDeduction,
    dependentDeduction,
    taxable,
    tax,
    brackets,
  };
}

export function calcFromNet(net: number, dependents: number): GrossNetResult {
  let low = net;
  let high = net * 2;
  for (let i = 0; i < 120; i++) {
    const mid = (low + high) / 2;
    const r = calcFromGross(mid, dependents);
    if (Math.abs(r.net - net) < 0.5) break;
    if (r.net < net) low = mid;
    else high = mid;
  }
  return calcFromGross((low + high) / 2, dependents);
}

/** Format a number as Vietnamese Dong */
export function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return Math.round(n).toLocaleString("en-US") + " ₫";
}