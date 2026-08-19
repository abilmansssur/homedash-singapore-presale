import assert from "node:assert/strict";
import test from "node:test";
import { calculateMortgage, validateMortgageInput } from "../lib/mortgage/calculator";
import { resolveMortgageConfig } from "../lib/mortgage/config";
import type { MortgageConfig, MortgageInput } from "../lib/mortgage/types";
import { POST } from "../app/api/v1/calculators/mortgage/route";

const config = resolveMortgageConfig("2026-08-18");

const base: Omit<MortgageInput, "property_price" | "rate_schedule"> = {
  property_type: "private",
  loan_type: "bank",
  tenure_years: 25,
  borrowers: [{ age: 35, gross_monthly_income: "50000", income_type: "fixed" }],
  existing_housing_loans: 0,
  monthly_debt_obligations: "0",
  calculation_date: "2026-08-18",
};

function calculate(overrides: Partial<MortgageInput>) {
  return calculateMortgage(
    {
      ...base,
      property_price: "1000000",
      rate_schedule: [{ from_month: 1, to_month: null, annual_rate: "0.035" }],
      ...overrides,
    },
    config,
  );
}

test("fixture A: flat 3.5% rate is pinned to exact decimal results", () => {
  const result = calculate({ loan_amount: "750000" });
  assert.equal(result.monthly_instalment, "3754.68");
  assert.equal(result.total_interest_paid, "376403.03");
  assert.equal(result.total_amount_repayable, "1126403.03");
  assert.equal(result.schedule.length, 300);
  assert.equal(result.schedule.at(-1)?.closing_balance, "0.00");
});

test("fixture B: HDB concessionary repayment is pinned", () => {
  const result = calculate({
    property_price: "650000",
    property_type: "hdb",
    loan_type: "hdb_concessionary",
    loan_amount: "400000",
    rate_schedule: [{ from_month: 1, to_month: null, annual_rate: "0.026" }],
  });
  assert.equal(result.monthly_instalment, "1814.68");
  assert.equal(result.total_interest_paid, "144403.41");
  assert.equal(result.schedule.at(-1)?.closing_balance, "0.00");
});

test("fixture C: every rate change recomputes the instalment", () => {
  const result = calculate({
    loan_amount: "750000",
    rate_schedule: [
      { from_month: 1, to_month: 12, annual_rate: "0.0225" },
      { from_month: 13, to_month: 24, annual_rate: "0.0255" },
      { from_month: 25, to_month: null, annual_rate: "0.031" },
    ],
  });
  assert.deepEqual(
    result.instalment_by_period.map((period) => period.monthly_instalment),
    ["3270.98", "3379.46", "3576.09"],
  );
  assert.equal(result.total_interest_paid, "316804.83");
  assert.equal(result.schedule.at(-1)?.closing_balance, "0.00");
});

test("fixture D: 35-year first loan uses the reduced LTV tier", () => {
  const result = calculate({
    property_price: "1500000",
    loan_amount: null,
    tenure_years: 35,
  });
  assert.equal(result.effective_loan_amount, "825000.00");
  assert.equal(result.affordability.binding_constraint, "LTV");
  assert.match(result.warnings.join(" "), /reduced LTV tier/i);
  assert.equal(result.schedule.length, 420);
});

test("fixture E: HDB buyer on S$5,000 income is MSR-bound", () => {
  const result = calculate({
    property_price: "650000",
    property_type: "hdb",
    borrowers: [{ age: 35, gross_monthly_income: "5000", income_type: "fixed" }],
    rate_schedule: [{ from_month: 1, to_month: null, annual_rate: "0.03" }],
  });
  assert.equal(result.affordability.binding_constraint, "MSR");
  assert.equal(result.maximum_loan_amount, "284178.72");
  assert.match(result.constraints_applied.at(-1) ?? "", /limited by MSR, not TDSR/i);
});

test("zero-interest input uses principal divided by months", () => {
  const result = calculate({
    property_price: "200000",
    loan_amount: "120000",
    tenure_years: 10,
    rate_schedule: [{ from_month: 1, to_month: null, annual_rate: "0" }],
  });
  assert.equal(result.monthly_instalment, "1000.00");
  assert.equal(result.total_interest_paid, "0.00");
  assert.equal(result.schedule.at(-1)?.closing_balance, "0.00");
});

test("requested loans above LTV are capped with a plain-language warning", () => {
  const result = calculate({ loan_amount: "900000" });
  assert.equal(result.effective_loan_amount, "750000.00");
  assert.match(result.warnings.join(" "), /exceeded the LTV ceiling and was capped/i);
});

test("variable income is weighted at 70 percent", () => {
  const result = calculate({
    property_type: "hdb",
    borrowers: [{ age: 35, gross_monthly_income: "5000", income_type: "variable" }],
  });
  assert.equal(result.affordability.effective_monthly_income, "3500.00");
  assert.match(result.warnings.join(" "), /weighted at 70%/i);
});

test("MSR output is absent for private property", () => {
  const result = calculate({ loan_amount: "750000" });
  assert.equal(result.affordability.msr_maximum, undefined);
  assert.equal(result.affordability.msr_ratio, undefined);
  assert.doesNotMatch(result.constraints_applied.join(" "), /MSR allows/i);
});

test("changing the effective config changes the output without calculator code changes", () => {
  const changedConfig = structuredClone(config) as MortgageConfig;
  changedConfig.rules.ltv.bank["0"].standard = "0.70";
  const result = calculateMortgage(
    {
      ...base,
      property_price: "1000000",
      rate_schedule: [{ from_month: 1, to_month: null, annual_rate: "0.035" }],
    },
    changedConfig,
  );
  assert.equal(result.effective_loan_amount, "700000.00");
});

test("invalid loan combinations and rate gaps return field errors", () => {
  const input: MortgageInput = {
    ...base,
    property_price: "800000",
    property_type: "private",
    loan_type: "hdb_concessionary",
    rate_schedule: [
      { from_month: 1, to_month: 12, annual_rate: "0.02" },
      { from_month: 14, to_month: null, annual_rate: "0.03" },
    ],
  };
  const errors = validateMortgageInput(input, config);
  assert.match(errors.loan_type?.[0] ?? "", /only be used for an HDB flat/i);
  assert.match(errors.rate_schedule?.[0] ?? "", /contiguous/i);
});

test("API returns field-level 400 errors and no partial result", async () => {
  const response = await POST(new Request("https://homedash.test/api/v1/calculators/mortgage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ property_price: "0", calculation_date: "2026-08-18" }),
  }));
  const payload = await response.json();
  assert.equal(response.status, 400);
  assert.equal(payload.error, "validation_error");
  assert.ok(payload.field_errors.property_price);
  assert.equal("schedule" in payload, false);
});
