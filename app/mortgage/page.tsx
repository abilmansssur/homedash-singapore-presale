import type { Metadata } from "next";
import MortgageCalculator from "./mortgage-calculator";

export const metadata: Metadata = {
  title: "Singapore Mortgage Calculator | HomeDash Agent Tools",
  description:
    "Calculate Singapore mortgage repayments with multi-tranche rates, LTV, TDSR and MSR checks, then share a branded result card.",
};

export default function MortgageCalculatorPage() {
  return <MortgageCalculator />;
}
