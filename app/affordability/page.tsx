import type { Metadata } from "next";
import AffordabilityCalculator from "./affordability-calculator";

export const metadata: Metadata = {
  title: "Singapore Affordability Calculator | HomeDash Agent Tools",
  description: "Estimate a Singapore home budget or reverse-calculate the gaps using TDSR, MSR, LTV, CPF, cash and stamp duty.",
};

export default function AffordabilityPage() {
  return <AffordabilityCalculator />;
}

