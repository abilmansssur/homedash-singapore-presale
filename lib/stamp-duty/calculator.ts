import Decimal from "decimal.js";
import type { MortgageConfig } from "@/lib/mortgage/types";

export type ResidencyStatus = "citizen" | "permanent_resident" | "foreigner";

export interface StampDutyInput {
  purchase_price: string | number;
  market_value?: string | number | null;
  buyer_residencies: ResidencyStatus[];
  existing_residential_properties: number;
}

export interface StampDutyResult {
  dutiable_value: string;
  bsd: string;
  absd_rate: string;
  absd: string;
  total_stamp_duty: string;
  rules: { verified_on: string; bsd_source: string; absd_source: string };
}

const ZERO = new Decimal(0);

function money(value: Decimal) {
  return value.floor().toFixed(2);
}

export function calculateStampDuty(input: StampDutyInput, config: MortgageConfig): StampDutyResult {
  const price = new Decimal(input.purchase_price);
  const marketValue = new Decimal(input.market_value ?? input.purchase_price);
  const dutiableValue = Decimal.max(price, marketValue);
  let priorLimit = ZERO;
  let bsd = ZERO;

  for (const bracket of config.rules.stamp_duty.bsd_brackets) {
    const upper = bracket.up_to === null ? dutiableValue : Decimal.min(dutiableValue, bracket.up_to);
    const taxable = Decimal.max(ZERO, upper.minus(priorLimit));
    bsd = bsd.plus(taxable.mul(bracket.rate));
    if (bracket.up_to === null || dutiableValue.lte(bracket.up_to)) break;
    priorLimit = new Decimal(bracket.up_to);
  }
  bsd = bsd.floor();

  const propertyIndex = Math.min(Math.max(0, input.existing_residential_properties), 2);
  const absdRate = Decimal.max(
    ...input.buyer_residencies.map((residency) =>
      new Decimal(config.rules.stamp_duty.absd_rates[residency][propertyIndex]),
    ),
  );
  const absd = dutiableValue.mul(absdRate).floor();

  return {
    dutiable_value: money(dutiableValue),
    bsd: money(bsd),
    absd_rate: absdRate.toString(),
    absd: money(absd),
    total_stamp_duty: money(bsd.plus(absd)),
    rules: {
      verified_on: config.verified_on,
      bsd_source: config.sources.iras_bsd,
      absd_source: config.sources.iras_absd,
    },
  };
}

