import Decimal from "decimal.js";
import { calculateStampDuty } from "@/lib/stamp-duty/calculator";
import type { MortgageConfig, PropertyType } from "@/lib/mortgage/types";
import type {
  AffordabilityFieldErrors,
  AffordabilityInput,
  AffordabilityResult,
  CeilingName,
} from "./types";

Decimal.set({ precision: 50, rounding: Decimal.ROUND_HALF_UP });

const ZERO = new Decimal(0);
const ONE = new Decimal(1);

function decimal(value: string | number | undefined | null) {
  return new Decimal(value ?? 0);
}

function money(value: Decimal) {
  return value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toFixed(2);
}

function addError(errors: AffordabilityFieldErrors, field: string, message: string) {
  errors[field] = [...(errors[field] ?? []), message];
}

function monthlyPayment(principal: Decimal, annualRate: Decimal, months: number) {
  if (principal.lte(0) || months <= 0) return ZERO;
  const monthlyRate = annualRate.div(12);
  if (monthlyRate.isZero()) return principal.div(months);
  const growth = ONE.plus(monthlyRate).pow(months);
  return principal.mul(monthlyRate).mul(growth).div(growth.minus(ONE));
}

function maximumPrincipal(payment: Decimal, annualRate: Decimal, months: number) {
  if (payment.lte(0) || months <= 0) return ZERO;
  const monthlyRate = annualRate.div(12);
  if (monthlyRate.isZero()) return payment.mul(months);
  const growth = ONE.plus(monthlyRate).pow(months);
  return payment.mul(growth.minus(ONE)).div(monthlyRate.mul(growth));
}

function tenureRuleKey(propertyType: PropertyType) {
  if (propertyType === "hdb") return "hdb_bank" as const;
  if (propertyType === "private") return "private_bank" as const;
  return "ec_bank" as const;
}

function iwaa(input: AffordabilityInput) {
  const total = input.borrowers.reduce((sum, borrower) => sum.plus(borrower.gross_monthly_income), ZERO);
  if (total.isZero()) return 0;
  return input.borrowers
    .reduce((sum, borrower) => sum.plus(decimal(borrower.gross_monthly_income).mul(borrower.age)), ZERO)
    .div(total)
    .ceil()
    .toNumber();
}

function ltvProfile(input: AffordabilityInput, config: MortgageConfig, averageAge: number) {
  if (input.loan_type === "hdb_concessionary") {
    return {
      ratio: decimal(config.rules.ltv.hdb_concessionary.standard),
      minimumCashRatio: decimal(config.rules.ltv.hdb_concessionary.minimum_cash),
      reduced: false,
    };
  }

  const tenureRule = config.rules.tenure[tenureRuleKey(input.property_type)];
  const reduced = input.tenure_years > tenureRule.reduced_ltv_above_years ||
    averageAge + input.tenure_years > config.rules.tenure.reduced_ltv_borrower_age_at_end;
  const tier = config.rules.ltv.bank[String(Math.min(input.existing_housing_loans, 2))];
  return {
    ratio: decimal(reduced ? tier.reduced : tier.standard),
    minimumCashRatio: decimal(reduced ? tier.minimum_cash_reduced : tier.minimum_cash_standard),
    reduced,
  };
}

export function validateAffordabilityInput(input: unknown, config: MortgageConfig): AffordabilityFieldErrors {
  const errors: AffordabilityFieldErrors = {};
  if (!input || typeof input !== "object") return { request: ["A JSON request body is required."] };
  const value = input as Partial<AffordabilityInput>;

  if (!(value.mode === "forward" || value.mode === "reverse")) addError(errors, "mode", "Choose forward or reverse mode.");
  if (!(["hdb", "ec_developer", "ec_resale", "private"] as const).includes(value.property_type as never)) addError(errors, "property_type", "Choose a supported residential property type.");
  if (!(["bank", "hdb_concessionary"] as const).includes(value.loan_type as never)) addError(errors, "loan_type", "Choose a bank or HDB concessionary loan.");
  if (value.loan_type === "hdb_concessionary" && value.property_type !== "hdb") addError(errors, "loan_type", "HDB concessionary loans apply only to HDB flats.");

  if (!Array.isArray(value.borrowers) || value.borrowers.length === 0) {
    addError(errors, "borrowers", "Add at least one borrower.");
  } else {
    value.borrowers.forEach((borrower, index) => {
      if (!Number.isInteger(borrower.age) || borrower.age < 18 || borrower.age > 100) addError(errors, `borrowers.${index}.age`, "Age must be from 18 to 100.");
      try {
        if (decimal(borrower.gross_monthly_income).lte(0)) addError(errors, `borrowers.${index}.gross_monthly_income`, "Income must be above S$0.");
      } catch { addError(errors, `borrowers.${index}.gross_monthly_income`, "Enter a valid income."); }
      if (!(borrower.income_type === "fixed" || borrower.income_type === "variable")) addError(errors, `borrowers.${index}.income_type`, "Choose fixed or variable income.");
      if (!(borrower.residency === "citizen" || borrower.residency === "permanent_resident" || borrower.residency === "foreigner")) addError(errors, `borrowers.${index}.residency`, "Choose a residency profile.");
    });
  }

  for (const field of ["available_cash", "available_cpf", "expected_annual_rate"] as const) {
    try {
      if (decimal(value[field]).lt(0)) addError(errors, field, "This amount cannot be negative.");
    } catch { addError(errors, field, "Enter a valid number."); }
  }
  if (!Number.isInteger(value.tenure_years) || Number(value.tenure_years) < 1 || Number(value.tenure_years) > 35) addError(errors, "tenure_years", "Tenure must be a whole number from 1 to 35 years.");
  if (![0, 1, 2].includes(value.existing_housing_loans ?? -1)) addError(errors, "existing_housing_loans", "Choose none, one, or two or more housing loans.");
  if (!Number.isInteger(value.existing_residential_properties) || Number(value.existing_residential_properties) < 0) addError(errors, "existing_residential_properties", "Property count cannot be negative.");
  if (value.mode === "reverse" || value.target_property_price !== null && value.target_property_price !== undefined && value.target_property_price !== "") {
    try {
      if (decimal(value.target_property_price).lte(0)) addError(errors, "target_property_price", "Enter a target property price above S$0.");
    } catch { addError(errors, "target_property_price", "Enter a valid target property price."); }
  }

  if (Object.keys(errors).length === 0) {
    const typed = value as AffordabilityInput;
    const averageAge = iwaa(typed);
    const maxTenure = typed.loan_type === "hdb_concessionary"
      ? Math.max(0, Math.min(config.rules.tenure.hdb_concessionary.maximum_years, config.rules.tenure.hdb_concessionary.maximum_borrower_age_at_end - averageAge))
      : config.rules.tenure[tenureRuleKey(typed.property_type)].maximum_years;
    if (typed.tenure_years > maxTenure) addError(errors, "tenure_years", `This borrower profile supports a maximum tenure of ${maxTenure} years.`);
  }
  return errors;
}

export function calculateAffordability(input: AffordabilityInput, config: MortgageConfig): AffordabilityResult {
  const rules = config.rules.affordability;
  const months = input.tenure_years * 12;
  const averageAge = iwaa(input);
  const ltv = ltvProfile(input, config, averageAge);
  const variableWeight = decimal(rules.variable_income_weight);
  const fullIncome = input.borrowers.reduce((sum, borrower) => sum.plus(borrower.gross_monthly_income), ZERO);
  const effectiveIncome = input.borrowers.reduce((sum, borrower) => {
    const income = decimal(borrower.gross_monthly_income);
    return sum.plus(borrower.income_type === "variable" ? income.mul(variableWeight) : income);
  }, ZERO);
  const debts = Object.values(input.monthly_debts ?? {}).reduce<Decimal>((sum, value) => sum.plus(decimal(value)), ZERO);
  const expectedRate = decimal(input.expected_annual_rate);
  const stressRate = Decimal.max(expectedRate, rules.stress_rate_floor[input.loan_type]);
  const tdsrCapacity = Decimal.max(ZERO, effectiveIncome.mul(rules.tdsr_ratio).minus(debts));
  const tdsrLoan = maximumPrincipal(tdsrCapacity, stressRate, months);
  const msrApplies = config.rules.affordability.msr_property_types.includes(input.property_type);
  const msrCapacity = fullIncome.mul(rules.msr_ratio);
  const msrLoan = msrApplies ? maximumPrincipal(msrCapacity, stressRate, months) : null;
  const serviceLoanCap = msrLoan ? Decimal.min(tdsrLoan, msrLoan) : tdsrLoan;
  const legalFees = decimal(input.legal_fees ?? rules.default_legal_fees);
  const valuationFee = decimal(input.valuation_fee ?? rules.default_valuation_fee);
  const miscellaneousFees = decimal(input.miscellaneous_fees ?? rules.default_miscellaneous_fees);
  const otherFees = legalFees.plus(valuationFee).plus(miscellaneousFees);
  const availableCash = decimal(input.available_cash);
  const allForeigners = input.borrowers.every((borrower) => borrower.residency === "foreigner");
  const availableCpf = allForeigners ? ZERO : decimal(input.available_cpf);
  const availableFunds = availableCash.plus(availableCpf);
  const residencies = input.borrowers.map((borrower) => borrower.residency);

  const positionAt = (price: Decimal, loanCap = serviceLoanCap) => {
    const loan = Decimal.min(price.mul(ltv.ratio), loanCap);
    const stamp = calculateStampDuty({
      purchase_price: price.toString(),
      buyer_residencies: residencies,
      existing_residential_properties: input.existing_residential_properties,
    }, config);
    const stampTotal = decimal(stamp.total_stamp_duty);
    const minimumCash = price.mul(ltv.minimumCashRatio);
    const totalUpfront = price.minus(loan).plus(stampTotal).plus(otherFees);
    return { loan, stamp, minimumCash, totalUpfront };
  };

  let low = ZERO;
  let high = new Decimal(100_000_000);
  const tolerance = decimal(rules.iteration_tolerance);
  while (high.minus(low).gt(tolerance)) {
    const midpoint = low.plus(high).div(2);
    const position = positionAt(midpoint);
    if (availableCash.gte(position.minimumCash) && availableFunds.gte(position.totalUpfront)) low = midpoint;
    else high = midpoint;
  }
  const roundDown = decimal(rules.price_round_down_increment);
  const maximumPrice = low.div(roundDown).floor().mul(roundDown);
  const maximumPosition = positionAt(maximumPrice);

  const targetPrice = input.target_property_price === null || input.target_property_price === undefined || input.target_property_price === ""
    ? maximumPrice
    : decimal(input.target_property_price);
  const targetPosition = positionAt(targetPrice);
  const ltvMaximum = targetPrice.mul(ltv.ratio);
  const assumedLoan = targetPosition.loan;
  const expectedPayment = monthlyPayment(assumedLoan, expectedRate, months);
  const stressPayment = monthlyPayment(assumedLoan, stressRate, months);
  const affordable = input.target_property_price === null || input.target_property_price === undefined || input.target_property_price === ""
    ? null
    : targetPrice.lte(maximumPrice);

  const loanCandidates: Array<{ name: CeilingName; value: Decimal }> = [{ name: "TDSR", value: tdsrLoan }];
  if (msrLoan) loanCandidates.push({ name: "MSR", value: msrLoan });
  loanCandidates.push({ name: "LTV", value: ltvMaximum });
  const minimumLoanCap = Decimal.min(...loanCandidates.map((candidate) => candidate.value));
  const threshold = decimal(rules.joint_binding_threshold);
  const bindingConstraints = loanCandidates
    .filter((candidate) => minimumLoanCap.isZero() ? candidate.value.isZero() : candidate.value.minus(minimumLoanCap).abs().div(minimumLoanCap).lte(threshold))
    .map((candidate) => candidate.name);
  const targetFundingGap = Decimal.max(ZERO, targetPosition.totalUpfront.minus(availableFunds));
  const targetCashGap = Decimal.max(ZERO, targetPosition.minimumCash.minus(availableCash));
  if (targetFundingGap.gt(0) || targetCashGap.gt(0) || targetPrice.eq(maximumPrice)) bindingConstraints.push("CASH_CPF");

  const neededLoanForFunds = Decimal.max(ZERO, targetPrice.plus(decimal(targetPosition.stamp.total_stamp_duty)).plus(otherFees).minus(availableFunds));
  const neededStressPayment = monthlyPayment(neededLoanForFunds, stressRate, months);
  const incomeNeededForTdsr = neededStressPayment.plus(debts).div(rules.tdsr_ratio);
  const tdsrIncomeShortfall = Decimal.max(ZERO, incomeNeededForTdsr.minus(effectiveIncome));
  const msrIncomeNeeded = msrApplies ? neededStressPayment.div(rules.msr_ratio) : ZERO;
  const incomeShortfall = Decimal.max(tdsrIncomeShortfall, Decimal.max(ZERO, msrIncomeNeeded.minus(fullIncome)));
  const debtReduction = Decimal.max(ZERO, neededStressPayment.plus(debts).minus(effectiveIncome.mul(rules.tdsr_ratio)));
  const cpfShortfall = availableCash.gte(targetPosition.minimumCash)
    ? Decimal.max(ZERO, targetPosition.totalUpfront.minus(availableCash).minus(availableCpf))
    : ZERO;
  const reverse = input.mode === "reverse" ? {
    additional_effective_monthly_income: money(incomeShortfall),
    minimum_cash_shortfall: money(targetCashGap),
    total_funds_shortfall: money(targetFundingGap),
    cpf_shortfall: money(cpfShortfall),
    monthly_debt_reduction: money(debtReduction),
    explanation: affordable
      ? "At the stated price, the modelled income, debt, LTV and available funds all fit within the configured limits."
      : `To reach ${money(targetPrice)}, address the stated income or debt gap and the upfront-funds gap. Meeting one gap does not override the other limits.`,
  } : null;

  const agent = input.agent ?? {};
  const warnings = [
    "Estimate only. Lenders and agencies make the final eligibility and credit decisions.",
    "Asset-based income is not modelled because the required pledging and amortisation parameters are not confirmed in the product rules.",
    "ABSD treaty reliefs, matrimonial remissions and refunds are not modelled; verify eligibility with IRAS.",
  ];
  if (allForeigners && decimal(input.available_cpf).gt(0)) warnings.push("Available CPF was treated as S$0 because every borrower is a foreigner.");
  if (input.borrowers.some((borrower) => borrower.income_type === "variable")) warnings.push(`Variable income was weighted at ${variableWeight.mul(100).toString()}% for TDSR; MSR uses full monthly income.`);
  if (ltv.reduced) warnings.push("The reduced LTV tier applies because of the selected tenure or income-weighted borrower age at loan maturity.");

  return {
    mode: input.mode,
    affordable,
    target_property_price: input.target_property_price === null || input.target_property_price === undefined || input.target_property_price === "" ? null : money(targetPrice),
    maximum_property_price: money(maximumPrice),
    maximum_loan_amount: money(maximumPosition.loan),
    assumed_loan_amount: money(assumedLoan),
    stressed_monthly_instalment: money(stressPayment),
    expected_monthly_instalment: money(expectedPayment),
    stress_rate: stressRate.toString(),
    expected_rate: expectedRate.toString(),
    effective_monthly_income: money(effectiveIncome),
    full_monthly_income: money(fullIncome),
    total_monthly_debt: money(debts),
    income_weighted_average_age: averageAge,
    ceilings: [
      { name: "TDSR", maximum_loan: money(tdsrLoan), maximum_property_price: null, applies: true, explanation: `55% of weighted income, less S$${money(debts)} in itemised monthly debt, assessed at the stress rate.` },
      { name: "MSR", maximum_loan: msrLoan ? money(msrLoan) : null, maximum_property_price: null, applies: msrApplies, explanation: msrApplies ? "30% of full monthly income for HDB and developer EC purchases." : "MSR does not apply to this property type." },
      { name: "LTV", maximum_loan: money(ltvMaximum), maximum_property_price: null, applies: true, explanation: `${ltv.ratio.mul(100).toString()}% LTV tier for this loan, tenure and housing-loan profile.` },
      { name: "CASH_CPF", maximum_loan: null, maximum_property_price: money(maximumPrice), applies: true, explanation: "Maximum price after minimum cash, CPF/cash downpayment, BSD, ABSD and configured transaction fees." },
    ],
    binding_constraints: [...new Set(bindingConstraints)],
    stamp_duty: targetPosition.stamp,
    upfront: {
      minimum_cash: money(targetPosition.minimumCash),
      cash_and_cpf_required: money(targetPosition.totalUpfront),
      available_cash: money(availableCash),
      available_cpf: money(availableCpf),
      other_fees: money(otherFees),
    },
    reverse,
    warnings,
    rules: { effective_from: config.effective_from, verified_on: config.verified_on, review_due_on: config.review_due_on, source: config.sources.bank_ltv_tdsr_msr },
    content_factory: {
      template: "affordability_result_v1",
      headline: { label: input.mode === "reverse" ? "Target property price" : "Estimated maximum property price", value: money(input.mode === "reverse" ? targetPrice : maximumPrice), qualifier: input.mode === "reverse" ? (affordable ? "Fits the modelled limits" : "Gap analysis shown") : "Across income, loan and funds checks" },
      breakdown: [
        { label: "Maximum loan", value: money(maximumPosition.loan) },
        { label: "Expected instalment", value: money(expectedPayment) },
        { label: "Binding checks", value: [...new Set(bindingConstraints)].join(" + ") },
      ],
      agent: { name: agent.name ?? "", cea_registration_number: agent.cea_registration_number ?? "", agency_name: agent.agency_name ?? "", photo_url: agent.photo_url ?? "" },
      formats: [{ id: "square", width: 1080, height: 1080 }, { id: "story", width: 1080, height: 1920 }],
      rules_current_as_of: config.verified_on,
      disclaimer: "Estimate only. Not an offer of credit, eligibility confirmation or financial advice. Final outcomes depend on lender, HDB, CPF and IRAS assessment.",
    },
  };
}

