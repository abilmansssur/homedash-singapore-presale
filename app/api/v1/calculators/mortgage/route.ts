import { calculateMortgage, validateMortgageInput } from "@/lib/mortgage/calculator";
import { resolveMortgageConfig } from "@/lib/mortgage/config";
import type { MortgageInput } from "@/lib/mortgage/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "validation_error", field_errors: { request: ["Send a valid JSON request body."] } },
      { status: 400 },
    );
  }

  const calculationDate =
    typeof body === "object" && body && "calculation_date" in body && typeof body.calculation_date === "string"
      ? body.calculation_date
      : new Date().toISOString().slice(0, 10);

  let config;
  try {
    config = resolveMortgageConfig(calculationDate);
  } catch (error) {
    return Response.json(
      {
        error: "configuration_error",
        field_errors: { calculation_date: [error instanceof Error ? error.message : "Rules are unavailable."] },
      },
      { status: 400 },
    );
  }

  const fieldErrors = validateMortgageInput(body, config);
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ error: "validation_error", field_errors: fieldErrors }, { status: 400 });
  }

  return Response.json(calculateMortgage(body as MortgageInput, config), {
    headers: { "Cache-Control": "no-store" },
  });
}
