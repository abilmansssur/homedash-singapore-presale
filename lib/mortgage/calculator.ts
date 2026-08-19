import Decimal from "decimal.js";
import { calculateCpfAccruedInterest } from "@/lib/cpf/accrued-interest";
import { calculateCpfUsageLimit } from "@/lib/cpf/usage-limit";
import type {
  FieldErrors,
  MortgageConfig,
  MortgageInput,
  MortgageResult,
  MortgageScheduleRow,
  PropertyType,
  RatePeriodInput,
} from "./types";

Decimal.set({ precision: 50, rounding: Decimal.ROUND_HALF_UP });

const ZERO = new Decimal(0);
const ONE = new Decimal(1);
const MONTHS_PER_YEAR = new Decimal(12);

function decimal(value: string | number | undefined | null): Decimal {
  return new Decimal(value ?? 0);
}

function money(value: Decimal): string {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

function addError(errors: FieldErrors, field: string, message: string) {
  errors[field] = [...(errors[field] ?? []), message];
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function tenureRuleKey(propertyType: PropertyType) {
  if (propertyType === "hdb") return "hdb_bank" as const;
  if (propertyType === "private") return "private_bank" as const;
  return "ec_bank" as const;
}

function incomeWeightedAverageAge(input: MortgageInput): number {
  const totalIncome = input.borrowers.reduce(
    (sum, borrower) => sum.plus(decimal(borrower.gross_monthly_income)),
    ZERO,
  );
  if (totalIncome.isZero()) return 0;

  const weightedAge = input.borrowers.reduce(
    (sum, borrower) => sum.plus(decimal(borrower.gross_monthly_income).mul(borrower.age)),
    ZERO,
  );
  return weightedAge.div(totalIncome).ceil().toNumber();
}

function maximumTenure(input: MortgageInput, config: MortgageConfig): number {
  if (input.loan_type === "hdb_concessionary") {
    const rule = config.rules.tenure.hdb_concessionary;
    return Math.max(
      0,
      Math.min(rule.maximum_years, rule.maximum_borrower_age_at_end - incomeWeightedAverageAge(input)),
    );
  }
  return config.rules.tenure[tenureRuleKey(input.property_type)].maximum_years;
}

export function validateMortgageInput(input: unknown, config: MortgageConfig): FieldErrors {
  const errors: FieldErrors = {};
  if (!input || typeof input !== "object") {
    return { request: ["A JSON request body is required."] };
  }

  const value = input as Partial<MortgageInput>;
  try {
    const propertyPrice = decimal(value.property_price);
    if (!propertyPrice.isFinite() || propertyPrice.lte(0) || propertyPrice.gt(100_000_000)) {
      addError(errors, "property_price", "Enter a property price above S$0 and no more than S$100,000,000.");
    }
  } catch {
    addError(errors, "property_price", "Enter a valid property price.");
  }

  const propertyTypes = ["hdb", "ec_developer", "ec_resale", "private"];
  if (!propertyTypes.includes(value.property_type ?? "")) {
    addError(errors, "property_type", "Choose HDB, developer EC, resale EC, or private property.");
  }
  if (!(["bank", "hdb_concessionary"] as const).includes(value.loan_type as never)) {
    addError(errors, "loan_type", "Choose a bank loan or HDB concessionary loan.");
  }
  if (value.loan_type === "hdb_concessionary" && value.property_type !== "hdb") {
    addError(errors, "loan_type", "An HDB concessionary loan can only be used for an HDB flat.");
  }

  if (value.loan_amount !== undefined && value.loan_amount !== null && value.loan_amount !== "") {
    try {
      const loanAmount = decimal(value.loan_amount);
      if (!loanAmount.isFinite() || loanAmount.lte(0)) {
        addError(errors, "loan_amount", "Enter a requested loan amount above S$0, or leave it blank.");
      }
    } catch {
      addError(errors, "loan_amount", "Enter a valid requested loan amount.");
    }
  }

  const configuredMaximumTenure = Math.max(
    config.rules.tenure.private_bank.maximum_years,
    config.rules.tenure.hdb_bank.maximum_years,
    config.rules.tenure.ec_bank.maximum_years,
    config.rules.tenure.hdb_concessionary.maximum_years,
  );
  if (!Number.isInteger(value.tenure_years) || (value.tenure_years ?? 0) < 1 || (value.tenure_years ?? 0) > configuredMaximumTenure) {
    addError(errors, "tenure_years", `Tenure must be a whole number from 1 to ${configuredMaximumTenure} years.`);
  }

  if (!Array.isArray(value.borrowers) || value.borrowers.length === 0) {
    addError(errors, "borrowers", "Add at least one borrower.");
  } else {
    value.borrowers.forEach((borrower, index) => {
      if (!Number.isInteger(borrower?.age) || borrower.age < 18 || borrower.age > 100) {
        addError(errors, `borrowers.${index}.age`, "Age must be a whole number from 18 to 100.");
      }
      try {
        const borrowerIncome = decimal(borrower?.gross_monthly_income);
        if (!borrowerIncome.isFinite() || borrowerIncome.lte(0)) {
          addError(errors, `borrowers.${index}.gross_monthly_income`, "Monthly income must be above S$0.");
        }
      } catch {
        addError(errors, `borrowers.${index}.gross_monthly_income`, "Enter a valid monthly income.");
      }
      if (!(["fixed", "variable"] as const).includes(borrower?.income_type as never)) {
        addError(errors, `borrowers.${index}.income_type`, "Choose fixed or variable income.");
      }
    });
  }

  if (![0, 1, 2].includes(value.existing_housing_loans ?? -1)) {
    addError(errors, "existing_housing_loans", "Choose none, one, or two or more existing housing loans.");
  }

  try {
    const debt = decimal(value.monthly_debt_obligations ?? 0);
    if (!debt.isFinite() || debt.lt(0)) {
      addError(errors, "monthly_debt_obligations", "Monthly debt obligations cannot be negative.");
    }
  } catch {
    addError(errors, "monthly_debt_obligations", "Enter a valid monthly debt amount.");
  }

  if (!Array.isArray(value.rate_schedule) || value.rate_schedule.length === 0) {
    addError(errors, "rate_schedule", "Add at least one interest-rate period.");
  } else {
    value.rate_schedule.forEach((period, index) => {
      if (!Number.isInteger(period?.from_month) || period.from_month < 1) {
        addError(errors, `rate_schedule.${index}.from_month`, "The starting month must be a positive whole number.");
      }
      if (period?.to_month !== null && (!Number.isInteger(period?.to_month) || period.to_month < period.from_month)) {
        addError(errors, `rate_schedule.${index}.to_month`, "The ending month must not be before the starting month.");
      }
      try {
        const annualRate = decimal(period?.annual_rate);
        if (!annualRate.isFinite() || annualRate.lt(0) || annualRate.gt(1)) {
          addError(errors, `rate_schedule.${index}.annual_rate`, "Annual rate must be between 0 and 100%.");
        }
      } catch {
        addError(errors, `rate_schedule.${index}.annual_rate`, "Enter a valid annual interest rate.");
      }

      if (index === 0 && period?.from_month !== 1) {
        addError(errors, "rate_schedule", "The rate schedule must start at month 1.");
      }
      if (index > 0) {
        const prior = value.rate_schedule![index - 1];
        if (prior.to_month === null || period?.from_month !== prior.to_month + 1) {
          addError(errors, "rate_schedule", "Rate periods must be contiguous, without overlaps or gaps.");
        }
      }
      if (index < value.rate_schedule!.length - 1 && period?.to_month === null) {
        addError(errors, "rate_schedule", "Only the final rate period may be open-ended.");
      }
    });
    if (value.rate_schedule.at(-1)?.to_month !== null) {
      addError(errors, "rate_schedule", "The final rate period must continue for the remaining tenure.");
    }
  }

  if (value.calculation_date && !isIsoDate(value.calculation_date)) {
    addError(errors, "calculation_date", "Calculation date must use YYYY-MM-DD format.");
  }

  if (value.cpf) {
    if (!Array.isArray(value.cpf.owners) || value.cpf.owners.length === 0) {
      addError(errors, "cpf.owners", "Add at least one CPF owner.");
    }
    if (value.cpf.tenure_type !== "freehold" && value.cpf.tenure_type !== "leasehold_999") {
      if (!Number.isInteger(value.cpf.remaining_lease_years) || Number(value.cpf.remaining_lease_years) < 0) {
        addError(errors, "cpf.remaining_lease_years", "Enter the remaining lease in whole years.");
      }
    }
    try {
      if (decimal(value.cpf.valuation_at_purchase).lte(0)) addError(errors, "cpf.valuation_at_purchase", "Valuation must be above S$0.");
    } catch {
      addError(errors, "cpf.valuation_at_purchase", "Enter a valid valuation.");
    }
  }

  if (Object.keys(errors).length === 0) {
    const typed = value as MortgageInput;
    const maxYears = maximumTenure(typed, config);
    if (typed.tenure_years > maxYears) {
      addError(
        errors,
        "tenure_years",
        maxYears > 0
          ? `This profile supports a maximum tenure of ${maxYears} years.`
          : "The borrowers' age does not allow a positive loan tenure for this loan type.",
      );
    }
  }

  return errors;
}

function monthlyPayment(principal: Decimal, annualRate: Decimal, months: number): Decimal {
  if (principal.isZero() || months <= 0) return ZERO;
  const monthlyRate = annualRate.div(MONTHS_PER_YEAR);
  if (monthlyRate.isZero()) return principal.div(months);
  const growth = ONE.plus(monthlyRate).pow(months);
  return principal.mul(monthlyRate).mul(growth).div(growth.minus(ONE));
}

function maximumPrincipalForPayment(payment: Decimal, annualRate: Decimal, months: number): Decimal {
  if (payment.lte(0) || months <= 0) return ZERO;
  const monthlyRate = annualRate.div(MONTHS_PER_YEAR);
  if (monthlyRate.isZero()) return payment.mul(months);
  const growth = ONE.plus(monthlyRate).pow(months);
  return payment.mul(growth.minus(ONE)).div(monthlyRate.mul(growth));
}

function rateForMonth(schedule: RatePeriodInput[], month: number): Decimal {
  const period = schedule.find(
    (candidate) => candidate.from_month <= month && (candidate.to_month === null || candidate.to_month >= month),
  );
  if (!period) throw new Error(`Rate schedule does not cover month ${month}.`);
  return decimal(period.annual_rate);
}

function buildSchedule(
  principal: Decimal,
  tenureMonths: number,
  rateSchedule: RatePeriodInput[],
): {
  schedule: MortgageScheduleRow[];
  instalmentByPeriod: MortgageResult["instalment_by_period"];
  totalInterest: Decimal;
  totalRepayable: Decimal;
} {
  const schedule: MortgageScheduleRow[] = [];
  const instalmentByPeriod: MortgageResult["instalment_by_period"] = [];
  let balance = principal;
  let currentPayment = ZERO;
  let currentRate = new Decimal(-1);
  let totalInterest = ZERO;
  let totalRepayable = ZERO;

  for (let month = 1; month <= tenureMonths; month += 1) {
    const annualRate = rateForMonth(rateSchedule, month);
    if (!annualRate.eq(currentRate)) {
      currentRate = annualRate;
      currentPayment = monthlyPayment(balance, annualRate, tenureMonths - month + 1);
      const sourcePeriod = rateSchedule.find((period) => period.from_month === month);
      instalmentByPeriod.push({
        from_month: month,
        to_month: Math.min(sourcePeriod?.to_month ?? tenureMonths, tenureMonths),
        annual_rate: annualRate.toString(),
        monthly_instalment: money(currentPayment),
      });
    }

    const openingBalance = balance;
    const interest = openingBalance.mul(annualRate.div(MONTHS_PER_YEAR));
    let instalment = currentPayment;
    let principalComponent = instalment.minus(interest);

    if (month === tenureMonths || principalComponent.gte(openingBalance)) {
      principalComponent = openingBalance;
      instalment = openingBalance.plus(interest);
      balance = ZERO;
    } else {
      balance = openingBalance.minus(principalComponent);
    }

    totalInterest = totalInterest.plus(interest);
    totalRepayable = totalRepayable.plus(instalment);
    schedule.push({
      month_index: month,
      opening_balance: money(openingBalance),
      instalment: money(instalment),
      interest_component: money(interest),
      principal_component: money(principalComponent),
      closing_balance: month === tenureMonths ? "0.00" : money(balance),
      annual_rate: annualRate.toString(),
    });
  }

  return { schedule, instalmentByPeriod, totalInterest, totalRepayable };
}

function chartFromSchedule(schedule: MortgageScheduleRow[]): MortgageResult["chart_series"] {
  const buckets = new Map<number, { principal: Decimal; interest: Decimal }>();
  schedule.forEach((row) => {
    const year = Math.ceil(row.month_index / 12);
    const bucket = buckets.get(year) ?? { principal: ZERO, interest: ZERO };
    buckets.set(year, {
      principal: bucket.principal.plus(row.principal_component),
      interest: bucket.interest.plus(row.interest_component),
    });
  });
  return [...buckets.entries()].map(([year, values]) => ({
    year,
    principal: money(values.principal),
    interest: money(values.interest),
  }));
}

export function calculateMortgage(input: MortgageInput, config: MortgageConfig): MortgageResult {
  const propertyPrice = decimal(input.property_price);
  const tenureMonths = input.tenure_years * 12;
  const iwaa = incomeWeightedAverageAge(input);
  const warnings: string[] = [];
  const constraints: string[] = [];

  let ltvRatio: Decimal;
  let minimumCashRatio: Decimal;
  let reducedLtv = false;

  if (input.loan_type === "hdb_concessionary") {
    ltvRatio = decimal(config.rules.ltv.hdb_concessionary.standard);
    minimumCashRatio = decimal(config.rules.ltv.hdb_concessionary.minimum_cash);
  } else {
    const tenureRule = config.rules.tenure[tenureRuleKey(input.property_type)];
    reducedLtv =
      input.tenure_years > tenureRule.reduced_ltv_above_years ||
      iwaa + input.tenure_years > config.rules.tenure.reduced_ltv_borrower_age_at_end;
    const tier = config.rules.ltv.bank[String(Math.min(input.existing_housing_loans, 2))];
    ltvRatio = decimal(reducedLtv ? tier.reduced : tier.standard);
    minimumCashRatio = decimal(
      reducedLtv ? tier.minimum_cash_reduced : tier.minimum_cash_standard,
    );
  }

  const ltvMaximum = propertyPrice.mul(ltvRatio);
  const requestedLoan =
    input.loan_amount === undefined || input.loan_amount === null || input.loan_amount === ""
      ? ltvMaximum
      : decimal(input.loan_amount);

  const variableIncomeWeight = decimal(config.rules.affordability.variable_income_weight);
  const effectiveIncome = input.borrowers.reduce((sum, borrower) => {
    const income = decimal(borrower.gross_monthly_income);
    return sum.plus(borrower.income_type === "variable" ? income.mul(variableIncomeWeight) : income);
  }, ZERO);
  const debtObligations = decimal(input.monthly_debt_obligations ?? 0);
  const packageMaximumRate = Decimal.max(...input.rate_schedule.map((period) => decimal(period.annual_rate)));
  const stressFloor = decimal(config.rules.affordability.stress_rate_floor[input.loan_type]);
  const stressRate = Decimal.max(packageMaximumRate, stressFloor);

  const tdsrPaymentCapacity = Decimal.max(
    ZERO,
    effectiveIncome.mul(config.rules.affordability.tdsr_ratio).minus(debtObligations),
  );
  const tdsrMaximum = maximumPrincipalForPayment(tdsrPaymentCapacity, stressRate, tenureMonths);

  const msrApplies = config.rules.affordability.msr_property_types.includes(input.property_type);
  const msrPaymentCapacity = effectiveIncome.mul(config.rules.affordability.msr_ratio);
  const msrMaximum = msrApplies
    ? maximumPrincipalForPayment(msrPaymentCapacity, stressRate, tenureMonths)
    : undefined;

  const candidates: Array<{ label: "LTV" | "TDSR" | "MSR"; value: Decimal }> = [
    { label: "LTV", value: ltvMaximum },
    { label: "TDSR", value: tdsrMaximum },
  ];
  if (msrMaximum) candidates.push({ label: "MSR", value: msrMaximum });
  const maximumLoan = Decimal.min(...candidates.map((candidate) => candidate.value));
  const bindingConstraint = candidates.find((candidate) => candidate.value.eq(maximumLoan))?.label ?? "LTV";
  const effectiveLoan = Decimal.min(requestedLoan, maximumLoan);

  constraints.push(
    `The ${reducedLtv ? "reduced" : "standard"} ${(ltvRatio.mul(100)).toString()}% LTV tier sets a maximum loan of S$${money(ltvMaximum)}.`,
  );
  constraints.push(
    `TDSR allows up to S$${money(tdsrMaximum)} after assessing income and existing debt at ${(stressRate.mul(100)).toString()}% p.a.`,
  );
  if (msrMaximum) {
    constraints.push(
      `MSR allows up to S$${money(msrMaximum)} using the configured ${decimal(config.rules.affordability.msr_ratio).mul(100).toString()}% mortgage-servicing limit.`,
    );
  }
  constraints.push(
    bindingConstraint === "MSR"
      ? "Your maximum loan here is limited by MSR, not TDSR."
      : bindingConstraint === "TDSR"
        ? "Your maximum loan here is limited by TDSR."
        : "Your maximum loan here is limited by the LTV ceiling.",
  );

  if (reducedLtv) {
    warnings.push(
      `The reduced LTV tier applies because the tenure exceeds the standard threshold or ends after income-weighted age ${config.rules.tenure.reduced_ltv_borrower_age_at_end}.`,
    );
  }
  if (requestedLoan.gt(ltvMaximum)) {
    warnings.push(
      `The requested loan exceeded the LTV ceiling and was capped from S$${money(requestedLoan)} to S$${money(ltvMaximum)} before affordability checks.`,
    );
  }
  if (requestedLoan.gt(maximumLoan) && bindingConstraint !== "LTV") {
    warnings.push(
      `Affordability checks reduced the usable loan to S$${money(maximumLoan)} under ${bindingConstraint}.`,
    );
  }
  if (input.borrowers.some((borrower) => borrower.income_type === "variable")) {
    warnings.push(
      `Variable income was weighted at ${variableIncomeWeight.mul(100).toString()}% for the affordability checks.`,
    );
  }
  warnings.push("Stamp duty is not included.");

  const { schedule, instalmentByPeriod, totalInterest, totalRepayable } = buildSchedule(
    effectiveLoan,
    tenureMonths,
    input.rate_schedule,
  );
  const downpayment = propertyPrice.minus(effectiveLoan);
  const minimumCash = Decimal.min(downpayment, propertyPrice.mul(minimumCashRatio));
  const stressPayment = monthlyPayment(effectiveLoan, stressRate, tenureMonths);
  const tdsrRatio = effectiveIncome.isZero()
    ? ZERO
    : stressPayment.plus(debtObligations).div(effectiveIncome);
  const msrRatio = effectiveIncome.isZero() ? ZERO : stressPayment.div(effectiveIncome);
  const agent = input.agent ?? {};
  const disclaimer =
    "Estimate only. Not an offer of credit or financial advice. Final terms are subject to lender approval.";

  const baseRate = decimal(input.rate_schedule[0].annual_rate);
  const lowerDelta = decimal(config.rules.rate_sensitivity.lower_delta);
  const upperDelta = decimal(config.rules.rate_sensitivity.upper_delta);
  const sensitivityStep = decimal(config.rules.rate_sensitivity.step);
  const basePayment = monthlyPayment(effectiveLoan, baseRate, tenureMonths);
  const rateSensitivity: MortgageResult["rate_sensitivity"] = [];
  for (let delta = lowerDelta; delta.lte(upperDelta); delta = delta.plus(sensitivityStep)) {
    const scenarioRate = Decimal.max(ZERO, baseRate.plus(delta));
    const payment = monthlyPayment(effectiveLoan, scenarioRate, tenureMonths);
    rateSensitivity.push({
      annual_rate: scenarioRate.toString(),
      monthly_instalment: money(payment),
      change_from_base: money(payment.minus(basePayment)),
    });
  }

  let cpf: MortgageResult["cpf"];
  if (input.cpf) {
    const usage = calculateCpfUsageLimit({
      purchase_price: input.property_price,
      valuation_at_purchase: input.cpf.valuation_at_purchase,
      tenure_type: input.cpf.tenure_type,
      remaining_lease_years: input.cpf.remaining_lease_years,
      owners: input.cpf.owners,
      cpf_used_to_date: input.cpf.cpf_used_to_date,
      retirement_sum_set_aside: input.cpf.retirement_sum_set_aside,
      initial_cpf_usage: input.cpf.initial_cpf_usage,
      monthly_instalments: schedule.map((row) => row.instalment),
    }, config);
    const drawdowns = [
      { month_index: 0, amount: usage.initial_cpf_payment },
      ...usage.funding_schedule
        .filter((row) => decimal(row.cpf_payment).gt(0))
        .map((row) => ({ month_index: row.month_index, amount: row.cpf_payment })),
    ];
    const accruedInterest = calculateCpfAccruedInterest({
      drawdowns,
      projection_months: tenureMonths,
      selected_year: input.cpf.selected_projection_year ?? Math.min(10, input.tenure_years),
    }, config);
    cpf = { usage, accrued_interest: accruedInterest };
  }

  return {
    monthly_instalment: schedule[0]?.instalment ?? "0.00",
    effective_loan_amount: money(effectiveLoan),
    requested_loan_amount: money(requestedLoan),
    maximum_loan_amount: money(maximumLoan),
    total_interest_paid: money(totalInterest),
    total_amount_repayable: money(totalRepayable),
    downpayment_breakdown: {
      total: money(downpayment),
      minimum_cash: money(minimumCash),
      cpf_or_cash: money(downpayment.minus(minimumCash)),
    },
    instalment_by_period: instalmentByPeriod,
    affordability: {
      effective_monthly_income: money(effectiveIncome),
      income_weighted_average_age: iwaa,
      stress_rate: stressRate.toString(),
      ltv_maximum: money(ltvMaximum),
      tdsr_maximum: money(tdsrMaximum),
      ...(msrMaximum ? { msr_maximum: money(msrMaximum) } : {}),
      tdsr_ratio: tdsrRatio.toDecimalPlaces(4).toString(),
      ...(msrApplies ? { msr_ratio: msrRatio.toDecimalPlaces(4).toString() } : {}),
      binding_constraint: bindingConstraint,
    },
    schedule,
    chart_series: chartFromSchedule(schedule),
    rate_sensitivity: rateSensitivity,
    ...(cpf ? { cpf } : {}),
    constraints_applied: constraints,
    warnings,
    rules: {
      effective_from: config.effective_from,
      verified_on: config.verified_on,
      review_due_on: config.review_due_on,
      source: input.loan_type === "hdb_concessionary"
        ? config.sources.hdb_concessionary_ltv
        : config.sources.bank_ltv_tdsr_msr,
    },
    content_factory: {
      template: "mortgage_result_v1",
      headline: {
        label: "Estimated monthly instalment",
        value: money(decimal(schedule[0]?.instalment ?? 0)),
        qualifier: instalmentByPeriod.length > 1 ? "First rate period" : "Across the loan",
      },
      breakdown: [
        { label: "Loan amount", value: money(effectiveLoan) },
        { label: "Downpayment", value: money(downpayment) },
        { label: "Total interest", value: money(totalInterest) },
      ],
      agent: {
        name: agent.name ?? "",
        cea_registration_number: agent.cea_registration_number ?? "",
        agency_name: agent.agency_name ?? "",
        photo_url: agent.photo_url ?? "",
      },
      branding: { mode: "homedash_with_agent", brand_name: "HomeDash" },
      formats: [
        { id: "square", width: 1080, height: 1080 },
        { id: "story", width: 1080, height: 1920 },
      ],
      rules_current_as_of: config.verified_on,
      disclaimer,
    },
  };
}
