import type { MortgageConfig } from "@/lib/mortgage/types";

export type TenureType = "freehold" | "leasehold_99" | "leasehold_999" | "other";

export interface CpfOwnerInput {
  age: number;
  cpf_oa_balance: string | number;
  monthly_oa_contribution: string | number;
}

export interface CpfUsageLimitInput {
  purchase_price: string | number;
  valuation_at_purchase: string | number;
  tenure_type: TenureType;
  remaining_lease_years?: number | null;
  owners: CpfOwnerInput[];
  cpf_used_to_date?: string | number;
  retirement_sum_set_aside: boolean;
  initial_cpf_usage?: string | number;
  monthly_instalments?: Array<string | number>;
}

export interface CpfFundingRow {
  month_index: number;
  opening_oa_balance: string;
  oa_contribution: string;
  cpf_payment: string;
  cash_payment: string;
  cumulative_cpf_used: string;
  closing_oa_balance: string;
}

export interface CpfUsageLimitResult {
  status: "unrestricted" | "restricted_partial" | "ineligible";
  youngest_owner_age: number;
  lease_covers_to_age_95: boolean;
  valuation_limit: string;
  withdrawal_limit: string;
  applicable_limit: string | null;
  cpf_used_to_date: string;
  cpf_remaining_limit: string | null;
  initial_cpf_payment: string;
  cash_only_from_month: number | null;
  funding_schedule: CpfFundingRow[];
  message: string;
  official_calculator_url: string;
  rules: Pick<MortgageConfig, "effective_from" | "verified_on" | "review_due_on"> & { source: string };
}

export interface CpfDrawdownInput {
  month_index: number;
  amount: string | number;
}

export interface CpfAccruedInterestInput {
  drawdowns: CpfDrawdownInput[];
  projection_months: number;
  selected_year?: number;
}

export interface CpfAccruedInterestYear {
  year: number;
  cpf_principal: string;
  accrued_interest: string;
  estimated_refund: string;
}

export interface CpfAccruedInterestResult {
  annual_rate: string;
  selected_year: number;
  selected_year_summary: string;
  year_10_summary: string | null;
  years: CpfAccruedInterestYear[];
  disclaimer: string;
  source: string;
  verified_on: string;
}

