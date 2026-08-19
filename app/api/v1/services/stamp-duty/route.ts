import { resolveMortgageConfig } from "@/lib/mortgage/config";
import { calculateStampDuty, type StampDutyInput } from "@/lib/stamp-duty/calculator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as StampDutyInput & { calculation_date?: string };
    const config = resolveMortgageConfig(body.calculation_date ?? new Date().toISOString().slice(0, 10));
    return Response.json(calculateStampDuty(body, config), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json(
      { error: "validation_error", field_errors: { request: [error instanceof Error ? error.message : "Stamp duty could not be calculated."] } },
      { status: 400 },
    );
  }
}

