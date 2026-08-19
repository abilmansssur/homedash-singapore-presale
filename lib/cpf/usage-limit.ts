import Decimal from "decimal.js";
import type { MortgageConfig } from "@/lib/mortgage/types";
import type { CpfFundingRow, CpfUsageLimitInput, CpfUsageLimitResult } from "./types";

const ZERO = new Decimal(0);

function decimal(value: string | number | undefined | null) {
  return new Decimal(value ?? 0);
}

function money(value: Decimal) {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

export function calculateCpfUsageLimit(
  input: CpfUsageLimitInput,
  config: MortgageConfig,
): CpfUsageLimitResult {
  if (!input.owners.length) throw new Error("At least one CPF owner is required.");

  const cpfRules = config.rules.cpf;
  const youngestOwnerAge = Math.min(...input.owners.map((owner) => owner.age));
  const leaseIsEffectivelyPerpetual = input.tenure_type === "freehold" || input.tenure_type === "leasehold_999";
  const remainingLease = input.remaining_lease_years ?? 0;
  const leaseCoversTo95 = leaseIsEffectivelyPerpetual || youngestOwnerAge + remainingLease >= cpfRules.lease_coverage_age;
  const valuationLimit = Decimal.min(decimal(input.purchase_price), decimal(input.valuation_at_purchase))
    .mul(cpfRules.valuation_limit_multiplier);
  const withdrawalLimit = valuationLimit.mul(cpfRules.withdrawal_limit_multiplier);
  const usedToDate = decimal(input.cpf_used_to_date);

  let status: CpfUsageLimitResult["status"] = "unrestricted";
  let applicableLimit: Decimal | null = input.retirement_sum_set_aside ? withdrawalLimit : valuationLimit;
  let message = input.retirement_sum_set_aside
    ? "The lease passes the age-95 test. CPF usage is modelled up to 120% of the Valuation Limit because the retirement-sum gate is marked as met."
    : "The lease passes the age-95 test. CPF usage is capped at the Valuation Limit unless the retirement-sum gate is met.";

  if (!leaseIsEffectivelyPerpetual && remainingLease <= cpfRules.minimum_remaining_lease_years_exclusive) {
    status = "ineligible";
    applicableLimit = ZERO;
    message = `CPF OA cannot be used because the remaining lease is ${remainingLease} years; it must be more than ${cpfRules.minimum_remaining_lease_years_exclusive} years.`;
  } else if (!leaseCoversTo95) {
    status = "restricted_partial";
    applicableLimit = null;
    message = `The lease reaches the youngest owner only to age ${youngestOwnerAge + remainingLease}, below age ${cpfRules.lease_coverage_age}. CPF applies a prorated limit; use the official calculator for the exact figure.`;
  }

  const monthlyContribution = input.owners.reduce(
    (sum, owner) => sum.plus(decimal(owner.monthly_oa_contribution)),
    ZERO,
  );
  let oaBalance = input.owners.reduce((sum, owner) => sum.plus(decimal(owner.cpf_oa_balance)), ZERO);
  let cumulativeUsed = usedToDate;
  let initialCpfPayment = ZERO;
  const fundingSchedule: CpfFundingRow[] = [];
  let cashOnlyFromMonth: number | null = null;

  if (applicableLimit !== null) {
    const remainingBeforePurchase = Decimal.max(ZERO, applicableLimit.minus(cumulativeUsed));
    initialCpfPayment = Decimal.min(
      decimal(input.initial_cpf_usage),
      oaBalance,
      remainingBeforePurchase,
    );
    oaBalance = oaBalance.minus(initialCpfPayment);
    cumulativeUsed = cumulativeUsed.plus(initialCpfPayment);

    (input.monthly_instalments ?? []).forEach((instalmentValue, index) => {
      const month = index + 1;
      const instalment = decimal(instalmentValue);
      const opening = oaBalance;
      oaBalance = oaBalance.plus(monthlyContribution);
      const remainingLimit = Decimal.max(ZERO, applicableLimit!.minus(cumulativeUsed));
      const cpfPayment = Decimal.min(instalment, oaBalance, remainingLimit);
      const cashPayment = Decimal.max(ZERO, instalment.minus(cpfPayment));
      cumulativeUsed = cumulativeUsed.plus(cpfPayment);
      oaBalance = oaBalance.minus(cpfPayment);

      if (cashOnlyFromMonth === null && cpfPayment.isZero() && instalment.gt(0) && remainingLimit.isZero()) {
        cashOnlyFromMonth = month;
      }

      fundingSchedule.push({
        month_index: month,
        opening_oa_balance: money(opening),
        oa_contribution: money(monthlyContribution),
        cpf_payment: money(cpfPayment),
        cash_payment: money(cashPayment),
        cumulative_cpf_used: money(cumulativeUsed),
        closing_oa_balance: money(oaBalance),
      });
    });
  }

  return {
    status,
    youngest_owner_age: youngestOwnerAge,
    lease_covers_to_age_95: leaseCoversTo95,
    valuation_limit: money(valuationLimit),
    withdrawal_limit: money(withdrawalLimit),
    applicable_limit: applicableLimit === null ? null : money(applicableLimit),
    cpf_used_to_date: money(usedToDate),
    cpf_remaining_limit: applicableLimit === null ? null : money(Decimal.max(ZERO, applicableLimit.minus(usedToDate))),
    initial_cpf_payment: money(initialCpfPayment),
    cash_only_from_month: cashOnlyFromMonth,
    funding_schedule: fundingSchedule,
    message,
    official_calculator_url: cpfRules.official_calculator_url,
    rules: {
      effective_from: config.effective_from,
      verified_on: config.verified_on,
      review_due_on: config.review_due_on,
      source: config.sources.cpf_housing_usage,
    },
  };
}

