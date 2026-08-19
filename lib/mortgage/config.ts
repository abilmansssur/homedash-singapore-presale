import rules20260818 from "@/config/mortgage/2026-08-18.json";
import type { MortgageConfig } from "./types";

const CONFIGS = [rules20260818 as MortgageConfig].sort((a, b) =>
  a.effective_from.localeCompare(b.effective_from),
);

export function resolveMortgageConfig(calculationDate: string): MortgageConfig {
  const matching = CONFIGS.filter((config) => config.effective_from <= calculationDate).at(-1);
  if (!matching) {
    throw new Error(`No mortgage rules are configured for ${calculationDate}.`);
  }
  return matching;
}

export function getMortgageConfigs(): MortgageConfig[] {
  return [...CONFIGS];
}
