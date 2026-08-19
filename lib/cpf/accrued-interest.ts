import Decimal from "decimal.js";
import type { MortgageConfig } from "@/lib/mortgage/types";
import type { CpfAccruedInterestInput, CpfAccruedInterestResult } from "./types";

const ZERO = new Decimal(0);

function money(value: Decimal) {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

function currency(value: string) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function calculateCpfAccruedInterest(
  input: CpfAccruedInterestInput,
  config: MortgageConfig,
): CpfAccruedInterestResult {
  const annualRate = new Decimal(config.rules.cpf.oa_interest_rate);
  const monthlyRate = annualRate.div(12);
  const drawdowns = new Map<number, Decimal>();
  input.drawdowns.forEach((drawdown) => {
    const prior = drawdowns.get(drawdown.month_index) ?? ZERO;
    drawdowns.set(drawdown.month_index, prior.plus(drawdown.amount));
  });

  let principal = ZERO;
  let accrued = ZERO;
  const years: CpfAccruedInterestResult["years"] = [];

  for (let month = 0; month <= input.projection_months; month += 1) {
    principal = principal.plus(drawdowns.get(month) ?? ZERO);
    if (month > 0) accrued = accrued.plus(principal.plus(accrued).mul(monthlyRate));
    if (month > 0 && (month % 12 === 0 || month === input.projection_months)) {
      years.push({
        year: Math.ceil(month / 12),
        cpf_principal: money(principal),
        accrued_interest: money(accrued),
        estimated_refund: money(principal.plus(accrued)),
      });
    }
  }

  const selectedYear = Math.max(1, Math.min(input.selected_year ?? 10, years.at(-1)?.year ?? 1));
  const selected = years.find((year) => year.year === selectedYear) ?? years.at(-1) ?? {
    year: selectedYear,
    cpf_principal: "0.00",
    accrued_interest: "0.00",
    estimated_refund: "0.00",
  };
  const year10 = years.find((year) => year.year === 10);
  const sentence = (year: typeof selected) =>
    `By year ${year.year}, the estimated CPF refund is ${currency(year.estimated_refund)}: ${currency(year.cpf_principal)} principal plus ${currency(year.accrued_interest)} accrued interest.`;

  return {
    annual_rate: annualRate.toString(),
    selected_year: selected.year,
    selected_year_summary: sentence(selected),
    year_10_summary: year10 ? sentence(year10) : null,
    years,
    disclaimer: "Estimate only. CPF refunds use prevailing OA rates and CPF Board compounds accrued interest annually; this month-by-month projection smooths the configured annual rate across months and may differ from CPF's official statement.",
    source: config.sources.cpf_accrued_interest,
    verified_on: config.verified_on,
  };
}

