import type { AgentInput, IncomeType, LoanType, PropertyType } from "@/lib/mortgage/types";
import type { ResidencyStatus, StampDutyResult } from "@/lib/stamp-duty/calculator";

export type AffordabilityMode = "forward" | "reverse";

export interface AffordabilityBorrowerInput {
  age: number;
  gross_monthly_income: string | number;
  income_type: IncomeType;
  residency: ResidencyStatus;
}

export interface DebtBreakdownInput {
  car_loan?: string | number;
  personal_loan?: string | number;
  credit_cards?: string | number;
  student_loan?: string | number;
  other_debt?: string | number;
}

export interface AffordabilityInput {
  mode: AffordabilityMode;
  target_property_price?: string | number | null;
  property_type: PropertyType;
  loan_type: LoanType;
  borrowers: AffordabilityBorrowerInput[];
  existing_residential_properties: number;
  existing_housing_loans: number;
  monthly_debts: DebtBreakdownInput;
  available_cash: string | number;
  available_cpf: string | number;
  tenure_years: number;
  expected_annual_rate: string | number;
  legal_fees?: string | number;
  valuation_fee?: string | number;
  miscellaneous_fees?: string | number;
  calculation_date?: string;
  agent?: AgentInput;
}

export type CeilingName = "TDSR" | "MSR" | "LTV" | "CASH_CPF";

export interface AffordabilityCeiling {
  name: CeilingName;
  maximum_loan: string | null;
  maximum_property_price: string | null;
  applies: boolean;
  explanation: string;
}

export interface AffordabilityResult {
  mode: AffordabilityMode;
  affordable: boolean | null;
  target_property_price: string | null;
  maximum_property_price: string;
  maximum_loan_amount: string;
  assumed_loan_amount: string;
  stressed_monthly_instalment: string;
  expected_monthly_instalment: string;
  stress_rate: string;
  expected_rate: string;
  effective_monthly_income: string;
  full_monthly_income: string;
  total_monthly_debt: string;
  income_weighted_average_age: number;
  ceilings: AffordabilityCeiling[];
  binding_constraints: CeilingName[];
  stamp_duty: StampDutyResult;
  upfront: {
    minimum_cash: string;
    cash_and_cpf_required: string;
    available_cash: string;
    available_cpf: string;
    other_fees: string;
  };
  reverse: null | {
    additional_effective_monthly_income: string;
    minimum_cash_shortfall: string;
    total_funds_shortfall: string;
    cpf_shortfall: string;
    monthly_debt_reduction: string;
    explanation: string;
  };
  warnings: string[];
  rules: { effective_from: string; verified_on: string; review_due_on: string; source: string };
  content_factory: {
    template: "affordability_result_v1";
    headline: { label: string; value: string; qualifier: string };
    breakdown: Array<{ label: string; value: string }>;
    agent: Required<AgentInput>;
    formats: Array<{ id: "square" | "story"; width: number; height: number }>;
    rules_current_as_of: string;
    disclaimer: string;
  };
}

export type AffordabilityFieldErrors = Record<string, string[]>;

