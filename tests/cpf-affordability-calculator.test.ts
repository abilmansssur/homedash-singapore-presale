import assert from "node:assert/strict";
import test from "node:test";
import { calculateAffordability } from "../lib/affordability/calculator";
import type { AffordabilityInput } from "../lib/affordability/types";
import { calculateCpfAccruedInterest } from "../lib/cpf/accrued-interest";
import { calculateCpfUsageLimit } from "../lib/cpf/usage-limit";
import { resolveMortgageConfig } from "../lib/mortgage/config";
import { calculateStampDuty } from "../lib/stamp-duty/calculator";

const config = resolveMortgageConfig("2026-08-18");

function cpf(overrides: Partial<Parameters<typeof calculateCpfUsageLimit>[0]> = {}) {
  return calculateCpfUsageLimit({
    purchase_price: "500000",
    valuation_at_purchase: "480000",
    tenure_type: "leasehold_99",
    remaining_lease_years: 95,
    owners: [{ age: 35, cpf_oa_balance: "100000", monthly_oa_contribution: "1000" }],
    cpf_used_to_date: "0",
    retirement_sum_set_aside: false,
    initial_cpf_usage: "50000",
    monthly_instalments: ["2000", "2000"],
    ...overrides,
  }, config);
}

test("CPF case A: an adequate lease permits the full Valuation Limit", () => {
  const result = cpf();
  assert.equal(result.status, "unrestricted");
  assert.equal(result.lease_covers_to_age_95, true);
  assert.equal(result.valuation_limit, "480000.00");
  assert.equal(result.applicable_limit, "480000.00");
});

test("CPF cases B and C: restricted leases are partial, but 20 years or below is zero", () => {
  const restricted = cpf({ remaining_lease_years: 45, owners: [{ age: 45, cpf_oa_balance: 0, monthly_oa_contribution: 0 }] });
  assert.equal(restricted.status, "restricted_partial");
  assert.equal(restricted.applicable_limit, null);
  assert.match(restricted.message, /official calculator/i);

  const ineligible = cpf({ remaining_lease_years: 18, owners: [{ age: 40, cpf_oa_balance: 0, monthly_oa_contribution: 0 }] });
  assert.equal(ineligible.status, "ineligible");
  assert.equal(ineligible.applicable_limit, "0.00");
});

test("CPF cases D and E: removing the youngest owner recalculates the lease test", () => {
  const joint = cpf({ remaining_lease_years: 60, owners: [
    { age: 52, cpf_oa_balance: 0, monthly_oa_contribution: 0 },
    { age: 38, cpf_oa_balance: 0, monthly_oa_contribution: 0 },
  ] });
  assert.equal(joint.youngest_owner_age, 38);
  assert.equal(joint.status, "unrestricted");
  const olderOnly = cpf({ remaining_lease_years: 40, owners: [{ age: 52, cpf_oa_balance: 0, monthly_oa_contribution: 0 }] });
  assert.equal(olderOnly.youngest_owner_age, 52);
  assert.equal(olderOnly.status, "restricted_partial");
});

test("CPF case F: schedule names month 143 as the cash-only switch", () => {
  const result = cpf({
    purchase_price: "14200",
    valuation_at_purchase: "14200",
    owners: [{ age: 35, cpf_oa_balance: "14200", monthly_oa_contribution: "0" }],
    initial_cpf_usage: "0",
    monthly_instalments: Array.from({ length: 150 }, () => "100"),
  });
  assert.equal(result.cash_only_from_month, 143);
  assert.equal(result.funding_schedule[142].cash_payment, "100.00");
});

test("CPF accrued interest includes later monthly drawdowns", () => {
  const result = calculateCpfAccruedInterest({
    drawdowns: [{ month_index: 0, amount: "100000" }, { month_index: 12, amount: "12000" }],
    projection_months: 120,
    selected_year: 10,
  }, config);
  assert.equal(result.years.length, 10);
  assert.ok(Number(result.years.at(-1)?.accrued_interest) > 25000);
  assert.match(result.selected_year_summary, /year 10/i);
});

test("stamp duty applies current residential BSD brackets and foreigner ABSD", () => {
  const citizen = calculateStampDuty({ purchase_price: "1000000", buyer_residencies: ["citizen"], existing_residential_properties: 0 }, config);
  assert.equal(citizen.bsd, "24600.00");
  assert.equal(citizen.absd, "0.00");
  const foreigner = calculateStampDuty({ purchase_price: "1000000", buyer_residencies: ["foreigner"], existing_residential_properties: 0 }, config);
  assert.equal(foreigner.absd_rate, "0.6");
  assert.equal(foreigner.absd, "600000.00");
});

const baseAffordability: AffordabilityInput = {
  mode: "forward",
  target_property_price: "1000000",
  property_type: "private",
  loan_type: "bank",
  borrowers: [{ age: 35, gross_monthly_income: "12000", income_type: "fixed", residency: "citizen" }],
  existing_residential_properties: 0,
  existing_housing_loans: 0,
  monthly_debts: { car_loan: "500", personal_loan: "0", credit_cards: "0", student_loan: "0", other_debt: "0" },
  available_cash: "250000",
  available_cpf: "150000",
  tenure_years: 25,
  expected_annual_rate: "0.0275",
  calculation_date: "2026-08-18",
};

test("affordability returns all four ceilings and omits MSR for private property", () => {
  const result = calculateAffordability(baseAffordability, config);
  assert.equal(result.ceilings.length, 4);
  assert.equal(result.ceilings.find((ceiling) => ceiling.name === "MSR")?.applies, false);
  assert.ok(Number(result.stressed_monthly_instalment) >= Number(result.expected_monthly_instalment));
  assert.ok(Number(result.maximum_property_price) > 0);
});

test("MSR applies to HDB and reverse mode returns actionable gaps", () => {
  const result = calculateAffordability({
    ...baseAffordability,
    mode: "reverse",
    property_type: "hdb",
    target_property_price: "1200000",
    borrowers: [{ age: 35, gross_monthly_income: "5000", income_type: "fixed", residency: "citizen" }],
    available_cash: "20000",
    available_cpf: "30000",
  }, config);
  assert.equal(result.ceilings.find((ceiling) => ceiling.name === "MSR")?.applies, true);
  assert.ok(result.reverse);
  assert.ok(Number(result.reverse?.total_funds_shortfall) > 0);
  assert.doesNotMatch(result.content_factory.disclaimer, /pre-approved/i);
});

test("all-foreigner profiles cannot use entered CPF", () => {
  const result = calculateAffordability({
    ...baseAffordability,
    borrowers: [{ age: 35, gross_monthly_income: "30000", income_type: "fixed", residency: "foreigner" }],
    available_cpf: "500000",
  }, config);
  assert.equal(result.upfront.available_cpf, "0.00");
  assert.match(result.warnings.join(" "), /every borrower is a foreigner/i);
});

