import { calculateAffordability, validateAffordabilityInput } from "@/lib/affordability/calculator";
import type { AffordabilityInput } from "@/lib/affordability/types";
import { resolveMortgageConfig } from "@/lib/mortgage/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "validation_error", field_errors: { request: ["Send a valid JSON request body."] } }, { status: 400 });
  }

  const calculationDate = typeof body === "object" && body && "calculation_date" in body && typeof body.calculation_date === "string"
    ? body.calculation_date
    : new Date().toISOString().slice(0, 10);
  try {
    const config = resolveMortgageConfig(calculationDate);
    const errors = validateAffordabilityInput(body, config);
    if (Object.keys(errors).length) return Response.json({ error: "validation_error", field_errors: errors }, { status: 400 });
    return Response.json(calculateAffordability(body as AffordabilityInput, config), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: "configuration_error", field_errors: { request: [error instanceof Error ? error.message : "The estimate could not be calculated."] } }, { status: 400 });
  }
}

