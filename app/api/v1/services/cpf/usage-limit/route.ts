import { calculateCpfUsageLimit } from "@/lib/cpf/usage-limit";
import type { CpfUsageLimitInput } from "@/lib/cpf/types";
import { resolveMortgageConfig } from "@/lib/mortgage/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Partial<CpfUsageLimitInput> & { calculation_date?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "validation_error", field_errors: { request: ["Send a valid JSON request body."] } }, { status: 400 });
  }

  if (!Array.isArray(body.owners) || body.owners.length === 0) {
    return Response.json({ error: "validation_error", field_errors: { owners: ["Add at least one CPF owner."] } }, { status: 400 });
  }

  try {
    const config = resolveMortgageConfig(body.calculation_date ?? new Date().toISOString().slice(0, 10));
    return Response.json(calculateCpfUsageLimit(body as CpfUsageLimitInput, config), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return Response.json(
      { error: "validation_error", field_errors: { request: [error instanceof Error ? error.message : "CPF usage could not be calculated."] } },
      { status: 400 },
    );
  }
}

