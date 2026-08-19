import { calculateCpfAccruedInterest } from "@/lib/cpf/accrued-interest";
import type { CpfAccruedInterestInput } from "@/lib/cpf/types";
import { resolveMortgageConfig } from "@/lib/mortgage/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: Partial<CpfAccruedInterestInput> & { calculation_date?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "validation_error", field_errors: { request: ["Send a valid JSON request body."] } }, { status: 400 });
  }

  if (!Array.isArray(body.drawdowns) || !Number.isInteger(body.projection_months) || Number(body.projection_months) < 1) {
    return Response.json(
      { error: "validation_error", field_errors: { request: ["Provide drawdowns and a positive whole-number projection_months value."] } },
      { status: 400 },
    );
  }

  try {
    const config = resolveMortgageConfig(body.calculation_date ?? new Date().toISOString().slice(0, 10));
    return Response.json(calculateCpfAccruedInterest(body as CpfAccruedInterestInput, config), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return Response.json(
      { error: "validation_error", field_errors: { request: [error instanceof Error ? error.message : "CPF accrued interest could not be calculated."] } },
      { status: 400 },
    );
  }
}

