export type PropertyType = "hdb" | "ec_developer" | "ec_resale" | "private";
export type LoanType = "bank" | "hdb_concessionary";
export type IncomeType = "fixed" | "variable";

export interface RatePeriodInput {
  from_month: number;
  to_month: number | null;
  annual_rate: string | number;
}

export interface BorrowerInput {
  age: number;
  gross_monthly_income: string | number;
  income_type: IncomeType;
}

export interface AgentInput {
  name?: string;
  cea_registration_number?: string;
  agency_name?: string;
  photo_url?: string;
}

export interface MortgageCpfInput {
  valuation_at_purchase: string | number;
  tenure_type: "freehold" | "leasehold_99" | "leasehold_999" | "other";
  remaining_lease_years?: number | null;
  owners: Array<{
    age: number;
    cpf_oa_balance: string | number;
    monthly_oa_contribution: string | number;
  }>;
  cpf_used_to_date?: string | number;
  retirement_sum_set_aside: boolean;
  initial_cpf_usage?: string | number;
  selected_projection_year?: number;
}

export interface MortgageInput {
  property_price: string | number;
  property_type: PropertyType;
  loan_type: LoanType;
  loan_amount?: string | number | null;
  tenure_years: number;
  rate_schedule: RatePeriodInput[];
  borrowers: BorrowerInput[];
  existing_housing_loans: number;
  monthly_debt_obligations?: string | number;
  calculation_date?: string;
  agent?: AgentInput;
  cpf?: MortgageCpfInput;
}

export interface MortgageConfig {
  effective_from: string;
  source: string;
  verified_on: string;
  verified_by: string;
  review_due_on: string;
  sources: Record<string, string>;
  notes: string[];
  rules: {
    ltv: {
      bank: Record<string, {
        standard: string;
        reduced: string;
        minimum_cash_standard: string;
        minimum_cash_reduced: string;
      }>;
      hdb_concessionary: { standard: string; minimum_cash: string };
    };
    tenure: {
      private_bank: { maximum_years: number; reduced_ltv_above_years: number };
      hdb_bank: { maximum_years: number; reduced_ltv_above_years: number };
      ec_bank: { maximum_years: number; reduced_ltv_above_years: number };
      hdb_concessionary: { maximum_years: number; maximum_borrower_age_at_end: number };
      reduced_ltv_borrower_age_at_end: number;
      iwaa_rounding: "ceiling";
    };
    affordability: {
      tdsr_ratio: string;
      msr_ratio: string;
      variable_income_weight: string;
      stress_rate_floor: Record<LoanType, string>;
      msr_property_types: PropertyType[];
      joint_binding_threshold: string;
      iteration_tolerance: string;
      price_round_down_increment: string;
      default_legal_fees: string;
      default_valuation_fee: string;
      default_miscellaneous_fees: string;
    };
    cpf: {
      valuation_limit_multiplier: string;
      withdrawal_limit_multiplier: string;
      minimum_remaining_lease_years_exclusive: number;
      lease_coverage_age: number;
      oa_interest_rate: string;
      current_brs: string;
      current_frs: string;
      current_ers: string;
      official_calculator_url: string;
      accrued_interest_crossover_ratio: string;
    };
    stamp_duty: {
      bsd_brackets: Array<{ up_to: string | null; rate: string }>;
      absd_rates: Record<"citizen" | "permanent_resident" | "foreigner", string[]>;
    };
    rate_sensitivity: {
      lower_delta: string;
      upper_delta: string;
      step: string;
    };
  };
}

export type FieldErrors = Record<string, string[]>;

export interface MortgageScheduleRow {
  month_index: number;
  opening_balance: string;
  instalment: string;
  interest_component: string;
  principal_component: string;
  closing_balance: string;
  annual_rate: string;
}

export interface MortgageResult {
  monthly_instalment: string;
  effective_loan_amount: string;
  requested_loan_amount: string;
  maximum_loan_amount: string;
  total_interest_paid: string;
  total_amount_repayable: string;
  downpayment_breakdown: { total: string; minimum_cash: string; cpf_or_cash: string };
  instalment_by_period: Array<{
    from_month: number;
    to_month: number;
    annual_rate: string;
    monthly_instalment: string;
  }>;
  affordability: {
    effective_monthly_income: string;
    income_weighted_average_age: number;
    stress_rate: string;
    ltv_maximum: string;
    tdsr_maximum: string;
    msr_maximum?: string;
    tdsr_ratio: string;
    msr_ratio?: string;
    binding_constraint: "LTV" | "TDSR" | "MSR";
  };
  schedule: MortgageScheduleRow[];
  chart_series: Array<{ year: number; principal: string; interest: string }>;
  rate_sensitivity: Array<{
    annual_rate: string;
    monthly_instalment: string;
    change_from_base: string;
  }>;
  cpf?: {
    usage: import("@/lib/cpf/types").CpfUsageLimitResult;
    accrued_interest: import("@/lib/cpf/types").CpfAccruedInterestResult;
  };
  constraints_applied: string[];
  warnings: string[];
  rules: {
    effective_from: string;
    verified_on: string;
    review_due_on: string;
    source: string;
  };
  content_factory: {
    template: "mortgage_result_v1";
    headline: { label: string; value: string; qualifier: string };
    breakdown: Array<{ label: string; value: string }>;
    agent: Required<AgentInput>;
    branding: { mode: "homedash_with_agent"; brand_name: "HomeDash" };
    formats: Array<{ id: "square" | "story"; width: number; height: number }>;
    rules_current_as_of: string;
    disclaimer: string;
  };
}
