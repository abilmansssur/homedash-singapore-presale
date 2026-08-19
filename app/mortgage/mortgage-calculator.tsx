"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FieldErrors, MortgageResult, PropertyType } from "@/lib/mortgage/types";
import styles from "./mortgage.module.css";

type RateRow = { from: number; to: number | null; rate: string };
type BorrowerRow = { age: string; income: string; incomeType: "fixed" | "variable"; cpfBalance: string; cpfContribution: string };
type ExportFormat = "square" | "story";

interface FormState {
  propertyPrice: string;
  propertyType: PropertyType;
  loanType: "bank" | "hdb_concessionary";
  requestedLoan: string;
  tenure: string;
  existingLoans: number;
  debts: string;
  rates: RateRow[];
  borrowers: BorrowerRow[];
  agentName: string;
  ceaNumber: string;
  agencyName: string;
  valuation: string;
  tenureType: "freehold" | "leasehold_99" | "leasehold_999" | "other";
  remainingLease: string;
  cpfUsedToDate: string;
  initialCpfUsage: string;
  retirementSumSetAside: boolean;
  projectionYear: string;
}

const initialForm: FormState = {
  propertyPrice: "1200000",
  propertyType: "private",
  loanType: "bank",
  requestedLoan: "",
  tenure: "25",
  existingLoans: 0,
  debts: "0",
  rates: [
    { from: 1, to: 12, rate: "2.25" },
    { from: 13, to: 24, rate: "2.55" },
    { from: 25, to: null, rate: "3.10" },
  ],
  borrowers: [{ age: "35", income: "10000", incomeType: "fixed", cpfBalance: "150000", cpfContribution: "1400" }],
  agentName: "",
  ceaNumber: "",
  agencyName: "",
  valuation: "1200000",
  tenureType: "freehold",
  remainingLease: "95",
  cpfUsedToDate: "0",
  initialCpfUsage: "100000",
  retirementSumSetAside: false,
  projectionYear: "10",
};

const propertyOptions: Array<{ value: PropertyType; label: string; short: string }> = [
  { value: "hdb", label: "HDB flat", short: "HDB" },
  { value: "ec_developer", label: "Developer EC", short: "New EC" },
  { value: "ec_resale", label: "Resale EC", short: "Resale EC" },
  { value: "private", label: "Private residential", short: "Private" },
];

const formatMoney = (value: string | number, decimals = 0) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value));

const formatPercent = (value: string | number, decimals = 1) =>
  `${(Number(value || 0) * 100).toFixed(decimals).replace(/\.?0+$/, "")}%`;

function percentToRate(value: string) {
  const normalized = value.trim();
  if (!normalized) return "0";
  const [whole = "0", fraction = ""] = normalized.split(".");
  const digits = `${whole}${fraction}`.replace(/^0+(?=\d)/, "");
  const scale = fraction.length + 2;
  if (digits.length <= scale) return `0.${digits.padStart(scale, "0")}`;
  return `${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
}

function FieldError({ errors, field }: { errors: FieldErrors; field: string }) {
  const message = errors[field]?.[0];
  return message ? <span className={styles.fieldError}>{message}</span> : null;
}

function Icon({ name }: { name: "home" | "rate" | "people" | "check" | "share" | "lock" }) {
  const paths = {
    home: <path d="m3 10 9-7 9 7v10H6V10m4 10v-6h4v6" />,
    rate: <><path d="M4 19 19 4" /><circle cx="7" cy="7" r="2.5" /><circle cx="17" cy="17" r="2.5" /></>,
    people: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-2.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V20M16 4.5a3 3 0 0 1 0 6M17 13a4 4 0 0 1 3.5 4v3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
) {
  const words = text.split(" ");
  let line = "";
  let lineNumber = 0;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width > maxWidth && line) {
      context.fillText(line, x, y + lineNumber * lineHeight);
      line = word;
      lineNumber += 1;
      if (lineNumber >= maxLines - 1) break;
    } else {
      line = test;
    }
  }
  context.fillText(line, x, y + lineNumber * lineHeight);
}

async function createShareCard(
  result: MortgageResult,
  form: FormState,
  format: ExportFormat,
  photoUrl: string,
): Promise<Blob> {
  const dimensions = format === "square" ? { width: 1080, height: 1080 } : { width: 1080, height: 1920 };
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Your browser could not prepare the share card.");

  const { width, height } = dimensions;
  const story = format === "story";
  const pad = 76;
  context.fillStyle = "#071637";
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(width * 0.85, 100, 10, width * 0.85, 100, 650);
  glow.addColorStop(0, "rgba(255,100,0,.34)");
  glow.addColorStop(1, "rgba(255,100,0,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#ffffff";
  roundedRect(context, pad, pad, 260, 80, 22);
  context.fill();
  try {
    const logo = await loadImage("/homedash-logo.png");
    context.drawImage(logo, pad + 22, pad + 19, 216, 42);
  } catch {
    context.fillStyle = "#19265b";
    context.font = "700 34px Inter, Arial";
    context.fillText("HomeDash", pad + 28, pad + 51);
  }

  context.fillStyle = "#ff6400";
  context.font = "700 24px Inter, Arial";
  context.textAlign = "right";
  context.fillText("SINGAPORE MORTGAGE ESTIMATE", width - pad, pad + 50);
  context.textAlign = "left";

  const headlineY = story ? 330 : 270;
  context.fillStyle = "#aeb9d8";
  context.font = "600 25px Inter, Arial";
  context.fillText("ESTIMATED MONTHLY INSTALMENT", pad, headlineY);
  context.fillStyle = "#ffffff";
  context.font = `750 ${story ? 96 : 88}px Inter, Arial`;
  context.fillText(formatMoney(result.monthly_instalment), pad, headlineY + 105);
  context.fillStyle = "#ff8b42";
  context.font = "600 25px Inter, Arial";
  context.fillText(
    result.instalment_by_period.length > 1 ? "First rate period · rates reprice by tranche" : "Monthly rest estimate",
    pad,
    headlineY + 152,
  );

  const panelY = story ? 590 : 500;
  const panelHeight = story ? 430 : 290;
  context.fillStyle = "rgba(255,255,255,.075)";
  roundedRect(context, pad, panelY, width - pad * 2, panelHeight, 30);
  context.fill();

  const items = [
    ["Loan amount", formatMoney(result.effective_loan_amount)],
    ["Downpayment", formatMoney(result.downpayment_breakdown.total)],
    ["Total interest", formatMoney(result.total_interest_paid)],
    ["Binding rule", result.affordability.binding_constraint],
  ];
  const columns = story ? 1 : 2;
  const itemWidth = (width - pad * 2 - 90) / columns;
  items.forEach(([label, value], index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = pad + 45 + column * itemWidth;
    const y = panelY + 66 + row * (story ? 92 : 118);
    context.fillStyle = "#8e9ac0";
    context.font = "600 20px Inter, Arial";
    context.fillText(label.toUpperCase(), x, y);
    context.fillStyle = label === "Binding rule" ? "#ff8b42" : "#ffffff";
    context.font = `700 ${label === "Binding rule" ? 38 : 36}px Inter, Arial`;
    context.fillText(value, x, y + 45);
  });

  const agentY = story ? 1120 : 835;
  if (photoUrl) {
    try {
      const photo = await loadImage(photoUrl);
      const size = story ? 150 : 112;
      context.save();
      context.beginPath();
      context.arc(pad + size / 2, agentY + size / 2, size / 2, 0, Math.PI * 2);
      context.clip();
      const scale = Math.max(size / photo.width, size / photo.height);
      const drawWidth = photo.width * scale;
      const drawHeight = photo.height * scale;
      context.drawImage(photo, pad + (size - drawWidth) / 2, agentY + (size - drawHeight) / 2, drawWidth, drawHeight);
      context.restore();
    } catch {
      // The identity text still renders if a local photo cannot be decoded.
    }
  }

  const agentOffset = photoUrl ? (story ? 190 : 145) : 0;
  context.fillStyle = "#ffffff";
  context.font = `700 ${story ? 38 : 28}px Inter, Arial`;
  context.fillText(form.agentName || "Prepared with HomeDash", pad + agentOffset, agentY + 40);
  context.fillStyle = "#aeb9d8";
  context.font = `500 ${story ? 25 : 19}px Inter, Arial`;
  const credentials = [form.ceaNumber ? `CEA ${form.ceaNumber}` : "", form.agencyName].filter(Boolean).join(" · ");
  context.fillText(credentials || "Singapore Agent Tools", pad + agentOffset, agentY + (story ? 82 : 74));

  const ruleY = story ? 1430 : 970;
  context.fillStyle = "#ff8b42";
  context.font = "700 22px Inter, Arial";
  context.fillText(`RULES CURRENT AS OF ${result.rules.verified_on}`, pad, ruleY);
  context.fillStyle = "#8e9ac0";
  context.font = `500 ${story ? 23 : 16}px Inter, Arial`;
  wrapText(
    context,
    result.content_factory.disclaimer,
    pad,
    ruleY + 48,
    width - pad * 2,
    story ? 34 : 24,
    3,
  );
  context.textAlign = "right";
  context.fillStyle = "#66739d";
  context.font = "500 18px Inter, Arial";
  context.fillText("homedash.ai · Stamp duty not included", width - pad, height - 64);
  context.textAlign = "left";

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("The share card could not be generated.");
  return blob;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function MortgageCalculator() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("square");
  const [shareStatus, setShareStatus] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  const tenureMaximum = form.loanType === "hdb_concessionary" ? 25 : form.propertyType === "hdb" ? 30 : 35;
  const chartMaximum = useMemo(() => {
    if (!result) return 1;
    return Math.max(
      ...result.chart_series.map((point) => Number(point.principal) + Number(point.interest)),
      1,
    );
  }, [result]);

  const updateForm = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [field]: value }));

  const choosePropertyType = (propertyType: PropertyType) => {
    const loanType = propertyType === "hdb" ? form.loanType : "bank";
    const max = loanType === "hdb_concessionary" ? 25 : propertyType === "hdb" ? 30 : 35;
    setForm((current) => ({
      ...current,
      propertyType,
      loanType,
      tenure: String(Math.min(Number(current.tenure) || max, max)),
    }));
  };

  const chooseLoanType = (loanType: FormState["loanType"]) => {
    const max = loanType === "hdb_concessionary" ? 25 : form.propertyType === "hdb" ? 30 : 35;
    setForm((current) => ({
      ...current,
      loanType,
      tenure: String(Math.min(Number(current.tenure) || max, max)),
    }));
  };

  const updateRate = (index: number, field: "rate" | "to", value: string) => {
    setForm((current) => {
      const rates = current.rates.map((rate) => ({ ...rate }));
      if (field === "rate") rates[index].rate = value;
      if (field === "to") {
        const nextEnd = Math.max(rates[index].from, Number(value) || rates[index].from);
        rates[index].to = nextEnd;
        if (rates[index + 1]) rates[index + 1].from = nextEnd + 1;
      }
      return { ...current, rates };
    });
  };

  const addRatePeriod = () => {
    setForm((current) => {
      const rates = current.rates.map((rate) => ({ ...rate }));
      const last = rates.at(-1)!;
      const end = last.to ?? last.from + 11;
      last.to = end;
      rates.push({ from: end + 1, to: null, rate: last.rate });
      return { ...current, rates };
    });
  };

  const removeLastRate = () => {
    setForm((current) => {
      if (current.rates.length === 1) return current;
      const rates = current.rates.slice(0, -1).map((rate) => ({ ...rate }));
      rates[rates.length - 1].to = null;
      return { ...current, rates };
    });
  };

  const updateBorrower = (index: number, field: keyof BorrowerRow, value: string) => {
    setForm((current) => ({
      ...current,
      borrowers: current.borrowers.map((borrower, borrowerIndex) =>
        borrowerIndex === index ? { ...borrower, [field]: value } as BorrowerRow : borrower,
      ),
    }));
  };

  const calculate = async () => {
    setLoading(true);
    setErrors({});
    setShareStatus("");
    try {
      const response = await fetch("/api/v1/calculators/mortgage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_price: form.propertyPrice,
          property_type: form.propertyType,
          loan_type: form.loanType,
          loan_amount: form.requestedLoan || null,
          tenure_years: Number(form.tenure),
          rate_schedule: form.rates.map((rate) => ({
            from_month: rate.from,
            to_month: rate.to,
            annual_rate: percentToRate(rate.rate),
          })),
          borrowers: form.borrowers.map((borrower) => ({
            age: Number(borrower.age),
            gross_monthly_income: borrower.income,
            income_type: borrower.incomeType,
          })),
          existing_housing_loans: form.existingLoans,
          monthly_debt_obligations: form.debts || "0",
          calculation_date: new Date().toISOString().slice(0, 10),
          agent: {
            name: form.agentName,
            cea_registration_number: form.ceaNumber,
            agency_name: form.agencyName,
          },
          cpf: {
            valuation_at_purchase: form.valuation,
            tenure_type: form.tenureType,
            remaining_lease_years: form.tenureType === "freehold" || form.tenureType === "leasehold_999" ? null : Number(form.remainingLease),
            owners: form.borrowers.map((borrower) => ({
              age: Number(borrower.age),
              cpf_oa_balance: borrower.cpfBalance,
              monthly_oa_contribution: borrower.cpfContribution,
            })),
            cpf_used_to_date: form.cpfUsedToDate,
            retirement_sum_set_aside: form.retirementSumSetAside,
            initial_cpf_usage: form.initialCpfUsage,
            selected_projection_year: Number(form.projectionYear),
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setErrors(payload.field_errors ?? { request: ["The estimate could not be calculated."] });
        setResult(null);
        return;
      }
      setResult(payload as MortgageResult);
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch {
      setErrors({ request: ["Could not reach the calculator. Check your connection and try again."] });
    } finally {
      setLoading(false);
    }
  };

  const exportCard = async (share: boolean) => {
    if (!result) return;
    if (form.agentName.trim() && !form.ceaNumber.trim()) {
      setShareStatus("Add the agent’s CEA registration number before exporting a named card.");
      return;
    }
    setExporting(true);
    setShareStatus("");
    try {
      const blob = await createShareCard(result, form, exportFormat, photoUrl);
      const file = new File([blob], `homedash-mortgage-${exportFormat}.png`, { type: "image/png" });
      if (share && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "HomeDash mortgage estimate",
          text: "A Singapore mortgage estimate prepared with HomeDash.",
        });
        setShareStatus("Share sheet opened.");
      } else {
        downloadBlob(blob, file.name);
        setShareStatus(share ? "Image downloaded — it’s ready to attach in WhatsApp." : "PNG downloaded.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareStatus(error instanceof Error ? error.message : "The share card could not be prepared.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Back to HomeDash Singapore">
          <Image src="/homedash-logo.png" alt="HomeDash" width={476} height={186} priority unoptimized />
        </Link>
        <div className={styles.headerTitle}>
          <span>Agent tools</span>
          <strong>Mortgage calculator</strong>
        </div>
        <Link href="/" className={styles.backLink}>Home <span aria-hidden="true">↗</span></Link>
      </header>

      <section className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>Singapore lending rules · Verified 18 Aug 2026</p>
          <h1>Make the monthly number <em>make sense.</em></h1>
          <p>Model real multi-year bank packages, check the Singapore affordability limits, and leave with a client-ready card.</p>
        </div>
        <aside className={styles.trustNote}>
          <Icon name="lock" />
          <div><strong>Nothing is saved</strong><span>Client income and debt stay in this calculation only.</span></div>
        </aside>
      </section>

      <div className={styles.workspace}>
        <section className={styles.formPanel} aria-label="Mortgage details">
          <div className={styles.sectionHeading}>
            <span>01</span><div><h2>Property & loan</h2><p>Start with the purchase and financing profile.</p></div>
          </div>

          <label className={styles.fieldWide}>
            <span>Property price</span>
            <div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.propertyPrice} onChange={(event) => updateForm("propertyPrice", event.target.value)} aria-invalid={Boolean(errors.property_price)} /></div>
            <FieldError errors={errors} field="property_price" />
          </label>

          <fieldset className={styles.fieldset}>
            <legend>Property type</legend>
            <div className={styles.segmentGrid}>
              {propertyOptions.map((option) => (
                <button key={option.value} type="button" className={form.propertyType === option.value ? styles.segmentActive : ""} onClick={() => choosePropertyType(option.value)} aria-pressed={form.propertyType === option.value} title={option.label}>{option.short}</button>
              ))}
            </div>
            <FieldError errors={errors} field="property_type" />
          </fieldset>

          {form.propertyType === "hdb" && (
            <fieldset className={styles.fieldset}>
              <legend>Loan provider</legend>
              <div className={styles.twoSegments}>
                <button type="button" className={form.loanType === "bank" ? styles.segmentActive : ""} onClick={() => chooseLoanType("bank")} aria-pressed={form.loanType === "bank"}>Bank loan</button>
                <button type="button" className={form.loanType === "hdb_concessionary" ? styles.segmentActive : ""} onClick={() => chooseLoanType("hdb_concessionary")} aria-pressed={form.loanType === "hdb_concessionary"}>HDB loan</button>
              </div>
              <FieldError errors={errors} field="loan_type" />
            </fieldset>
          )}

          <div className={styles.twoColumns}>
            <label>
              <span>Requested loan <small>Optional</small></span>
              <div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" placeholder="Use maximum" value={form.requestedLoan} onChange={(event) => updateForm("requestedLoan", event.target.value)} /></div>
              <FieldError errors={errors} field="loan_amount" />
            </label>
            <label>
              <span>Loan tenure</span>
              <div className={styles.suffixInput}><input type="number" min="1" max={tenureMaximum} value={form.tenure} onChange={(event) => updateForm("tenure", event.target.value)} /><b>years</b></div>
              <FieldError errors={errors} field="tenure_years" />
            </label>
          </div>

          <fieldset className={styles.fieldset}>
            <legend>Existing housing loans</legend>
            <div className={styles.threeSegments}>
              {[{ value: 0, label: "None" }, { value: 1, label: "One" }, { value: 2, label: "Two or more" }].map((option) => (
                <button key={option.value} type="button" className={form.existingLoans === option.value ? styles.segmentActive : ""} onClick={() => updateForm("existingLoans", option.value)} aria-pressed={form.existingLoans === option.value}>{option.label}</button>
              ))}
            </div>
          </fieldset>

          <div className={styles.divider} />
          <div className={styles.sectionHeading}>
            <span>02</span><div><h2>Interest-rate schedule</h2><p>Add each tranche exactly as it appears in the package.</p></div>
          </div>

          <div className={styles.rateList}>
            {form.rates.map((rate, index) => (
              <div className={styles.rateRow} key={`${index}-${rate.from}`}>
                <div className={styles.ratePeriod}>
                  <small>Period {index + 1}</small>
                  <strong>Month {rate.from}–{rate.to ?? "end"}</strong>
                </div>
                {index < form.rates.length - 1 && (
                  <label><span>Ends</span><input type="number" min={rate.from} value={rate.to ?? ""} onChange={(event) => updateRate(index, "to", event.target.value)} aria-label={`Rate period ${index + 1} ending month`} /></label>
                )}
                <label className={styles.rateInput}><span>Rate p.a.</span><div><input inputMode="decimal" value={rate.rate} onChange={(event) => updateRate(index, "rate", event.target.value)} aria-label={`Rate period ${index + 1} annual rate`} /><b>%</b></div></label>
              </div>
            ))}
          </div>
          <FieldError errors={errors} field="rate_schedule" />
          <div className={styles.rowActions}>
            <button type="button" onClick={addRatePeriod}>+ Add rate period</button>
            {form.rates.length > 1 && <button type="button" onClick={removeLastRate}>Remove last</button>}
          </div>

          <div className={styles.divider} />
          <div className={styles.sectionHeading}>
            <span>03</span><div><h2>Borrowers & commitments</h2><p>Used only for this TDSR and MSR estimate.</p></div>
          </div>

          <div className={styles.borrowerList}>
            {form.borrowers.map((borrower, index) => (
              <div className={styles.borrowerCard} key={index}>
                <div className={styles.borrowerTitle}><Icon name="people" /><strong>Borrower {index + 1}</strong>{form.borrowers.length > 1 && <button type="button" onClick={() => updateForm("borrowers", form.borrowers.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove borrower ${index + 1}`}>Remove</button>}</div>
                <div className={styles.borrowerFields}>
                  <label><span>Age</span><input type="number" min="18" max="100" value={borrower.age} onChange={(event) => updateBorrower(index, "age", event.target.value)} /><FieldError errors={errors} field={`borrowers.${index}.age`} /></label>
                  <label><span>Gross monthly income</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={borrower.income} onChange={(event) => updateBorrower(index, "income", event.target.value)} /></div><FieldError errors={errors} field={`borrowers.${index}.gross_monthly_income`} /></label>
                  <label><span>Income type</span><select value={borrower.incomeType} onChange={(event) => updateBorrower(index, "incomeType", event.target.value)}><option value="fixed">Fixed salary</option><option value="variable">Variable / commission</option></select></label>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className={styles.addBorrower} onClick={() => updateForm("borrowers", [...form.borrowers, { age: "35", income: "5000", incomeType: "fixed", cpfBalance: "0", cpfContribution: "0" }])}>+ Add joint borrower</button>

          <label className={styles.fieldWide}>
            <span>Other monthly debt obligations <small>Car, personal, card and student loans</small></span>
            <div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.debts} onChange={(event) => updateForm("debts", event.target.value)} /></div>
            <FieldError errors={errors} field="monthly_debt_obligations" />
          </label>

          <div className={styles.divider} />
          <div className={styles.sectionHeading}>
            <span>04</span><div><h2>CPF housing plan</h2><p>Model the usage ceiling, monthly CPF-to-cash switch and refund on sale.</p></div>
          </div>

          <div className={styles.twoColumns}>
            <label>
              <span>Valuation at purchase</span>
              <div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.valuation} onChange={(event) => updateForm("valuation", event.target.value)} /></div>
              <FieldError errors={errors} field="cpf.valuation_at_purchase" />
            </label>
            <label>
              <span>Property tenure</span>
              <select value={form.tenureType} onChange={(event) => updateForm("tenureType", event.target.value as FormState["tenureType"])}>
                <option value="freehold">Freehold</option>
                <option value="leasehold_99">99-year leasehold</option>
                <option value="leasehold_999">999-year leasehold</option>
                <option value="other">Other lease</option>
              </select>
            </label>
          </div>
          {form.tenureType !== "freehold" && form.tenureType !== "leasehold_999" && <label className={styles.fieldWide}>
            <span>Remaining lease</span>
            <div className={styles.suffixInput}><input type="number" min="0" value={form.remainingLease} onChange={(event) => updateForm("remainingLease", event.target.value)} /><b>years</b></div>
            <FieldError errors={errors} field="cpf.remaining_lease_years" />
          </label>}

          <div className={styles.cpfOwners}>
            {form.borrowers.map((borrower, index) => <div key={index}>
              <strong>Owner {index + 1} · age {borrower.age || "—"}</strong>
              <label><span>Current CPF OA</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={borrower.cpfBalance} onChange={(event) => updateBorrower(index, "cpfBalance", event.target.value)} /></div></label>
              <label><span>Monthly OA contribution</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={borrower.cpfContribution} onChange={(event) => updateBorrower(index, "cpfContribution", event.target.value)} /></div></label>
            </div>)}
          </div>

          <div className={styles.twoColumns}>
            <label><span>CPF used to date</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.cpfUsedToDate} onChange={(event) => updateForm("cpfUsedToDate", event.target.value)} /></div></label>
            <label><span>CPF for purchase</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.initialCpfUsage} onChange={(event) => updateForm("initialCpfUsage", event.target.value)} /></div></label>
          </div>
          <div className={styles.twoColumns}>
            <label><span>Refund projection point</span><div className={styles.suffixInput}><input type="number" min="1" max={form.tenure} value={form.projectionYear} onChange={(event) => updateForm("projectionYear", event.target.value)} /><b>years</b></div></label>
            <label className={styles.checkboxField}><input type="checkbox" checked={form.retirementSumSetAside} onChange={(event) => updateForm("retirementSumSetAside", event.target.checked)} /><span>Retirement-sum gate is met</span></label>
          </div>
          <p className={styles.cpfNote}>The 120% Withdrawal Limit is modelled only when you confirm the retirement-sum gate. Restricted leases return a partial result and link to CPF’s official calculator.</p>

          {errors.request && <div className={styles.requestError} role="alert">{errors.request[0]}</div>}
          <button type="button" className={styles.calculateButton} onClick={calculate} disabled={loading}>
            {loading ? <><span className={styles.spinner} /> Checking the numbers…</> : <>Calculate repayment <span aria-hidden="true">→</span></>}
          </button>
          <p className={styles.formFootnote}><Icon name="lock" /> Stateless calculation · no client financial data is stored</p>
        </section>

        <aside className={styles.resultPanel} ref={resultRef} aria-live="polite">
          {!result ? (
            <div className={styles.emptyResult}>
              <div className={styles.emptyIcon}><Icon name="home" /></div>
              <p className={styles.eyebrow}>Your client-ready estimate</p>
              <h2>The useful part appears here.</h2>
              <p>Calculate to see the repayment periods, the binding Singapore rule, downpayment, and share-ready result.</p>
              <ul>
                <li><Icon name="check" /> Multi-tranche repayment schedule</li>
                <li><Icon name="check" /> LTV, TDSR and applicable MSR</li>
                <li><Icon name="check" /> WhatsApp-ready branded card</li>
              </ul>
            </div>
          ) : (
            <div className={styles.results}>
              <div className={styles.resultTopline}><span>Estimate ready</span><span>Rules: {result.rules.verified_on}</span></div>
              <div className={styles.headlineResult}>
                <p>Estimated monthly instalment</p>
                <h2>{formatMoney(result.monthly_instalment)}</h2>
                <span>{result.instalment_by_period.length > 1 ? "First rate period" : "Across the loan"}</span>
              </div>

              {result.instalment_by_period.length > 1 && (
                <div className={styles.periods}>
                  {result.instalment_by_period.map((period, index) => (
                    <div key={period.from_month}>
                      <span>Period {index + 1} · Months {period.from_month}–{period.to_month}</span>
                      <strong>{formatMoney(period.monthly_instalment)} <small>/mo</small></strong>
                      <em>{formatPercent(period.annual_rate, 3)} p.a.</em>
                    </div>
                  ))}
                </div>
              )}

              <section className={styles.resultSection}>
                <div className={styles.resultSectionHeading}><div><p className={styles.eyebrow}>Rate sensitivity</p><h3>What if rates move?</h3></div><span>±1 percentage point</span></div>
                <div className={styles.sensitivityGrid}>
                  {result.rate_sensitivity.map((scenario) => <div key={scenario.annual_rate} className={Number(scenario.change_from_base) === 0 ? styles.sensitivityBase : ""}><span>{formatPercent(scenario.annual_rate, 2)}</span><strong>{formatMoney(scenario.monthly_instalment)}<small>/mo</small></strong><em>{Number(scenario.change_from_base) === 0 ? "Base" : `${Number(scenario.change_from_base) > 0 ? "+" : ""}${formatMoney(scenario.change_from_base)}`}</em></div>)}
                </div>
              </section>

              <div className={`${styles.bindingCard} ${styles[`binding${result.affordability.binding_constraint}`]}`}>
                <span>{result.affordability.binding_constraint}</span>
                <div><strong>{result.constraints_applied.at(-1)}</strong><p>Maximum estimated loan: {formatMoney(result.maximum_loan_amount)}</p></div>
              </div>

              <div className={styles.metrics}>
                <div><span>Loan used</span><strong>{formatMoney(result.effective_loan_amount)}</strong></div>
                <div><span>Total interest</span><strong>{formatMoney(result.total_interest_paid)}</strong></div>
                <div><span>Total repayable</span><strong>{formatMoney(result.total_amount_repayable)}</strong></div>
                <div><span>IWAA</span><strong>{result.affordability.income_weighted_average_age} years</strong></div>
              </div>

              <section className={styles.resultSection}>
                <div className={styles.resultSectionHeading}><div><p className={styles.eyebrow}>Upfront funds</p><h3>Downpayment breakdown</h3></div><strong>{formatMoney(result.downpayment_breakdown.total)}</strong></div>
                <div className={styles.downpaymentBar}>
                  <span style={{ width: `${Math.min(100, Number(result.downpayment_breakdown.minimum_cash) / Number(result.downpayment_breakdown.total || 1) * 100)}%` }} />
                </div>
                <div className={styles.legend}><span><i />Minimum cash <b>{formatMoney(result.downpayment_breakdown.minimum_cash)}</b></span><span><i />CPF OA or cash <b>{formatMoney(result.downpayment_breakdown.cpf_or_cash)}</b></span></div>
                <p className={styles.placeholder}>Stamp duty not included</p>
              </section>

              {result.cpf && <section className={`${styles.resultSection} ${styles.cpfResult}`}>
                <div className={styles.resultSectionHeading}><div><p className={styles.eyebrow}>CPF housing plan</p><h3>Usage limit & refund</h3></div><span className={styles[`cpfStatus_${result.cpf.usage.status}`]}>{result.cpf.usage.status.replace("_", " ")}</span></div>
                <div className={styles.cpfMessage}><strong>Youngest owner: {result.cpf.usage.youngest_owner_age}</strong><p>{result.cpf.usage.message}</p></div>
                <div className={styles.cpfMetrics}>
                  <div><span>Valuation Limit</span><strong>{formatMoney(result.cpf.usage.valuation_limit)}</strong></div>
                  <div><span>Withdrawal Limit</span><strong>{formatMoney(result.cpf.usage.withdrawal_limit)}</strong></div>
                  <div><span>Applicable CPF limit</span><strong>{result.cpf.usage.applicable_limit === null ? "Official calculator" : formatMoney(result.cpf.usage.applicable_limit)}</strong></div>
                  <div><span>CPF used at purchase</span><strong>{formatMoney(result.cpf.usage.initial_cpf_payment)}</strong></div>
                </div>
                {result.cpf.usage.cash_only_from_month && <div className={styles.cashSwitch}>CPF reaches the configured ceiling in the projection. Payments switch to cash-only from month <strong>{result.cpf.usage.cash_only_from_month}</strong>.</div>}
                {result.cpf.usage.status === "restricted_partial" && <a className={styles.cpfOfficial} href={result.cpf.usage.official_calculator_url} target="_blank" rel="noreferrer">Open CPF Housing Usage Calculator ↗</a>}
                <div className={styles.cpfRefund}><p>{result.cpf.accrued_interest.selected_year_summary}</p>{result.cpf.accrued_interest.year_10_summary && result.cpf.accrued_interest.selected_year !== 10 && <p>{result.cpf.accrued_interest.year_10_summary}</p>}</div>
                <div className={styles.cpfTableWrap}><table><thead><tr><th>Year</th><th>CPF principal</th><th>Accrued interest</th><th>Est. refund</th></tr></thead><tbody>{result.cpf.accrued_interest.years.filter((row) => row.year === 1 || row.year % 5 === 0 || row.year === result.cpf!.accrued_interest.selected_year || row.year === result.cpf!.accrued_interest.years.at(-1)?.year).map((row) => <tr key={row.year}><td>{row.year}</td><td>{formatMoney(row.cpf_principal)}</td><td>{formatMoney(row.accrued_interest)}</td><td>{formatMoney(row.estimated_refund)}</td></tr>)}</tbody></table></div>
                <p className={styles.cpfDisclaimer}>{result.cpf.accrued_interest.disclaimer} <a href={result.cpf.accrued_interest.source} target="_blank" rel="noreferrer">CPF source ↗</a></p>
              </section>}

              <section className={styles.resultSection}>
                <div className={styles.resultSectionHeading}><div><p className={styles.eyebrow}>Over time</p><h3>Principal vs interest</h3></div><span>Annual totals</span></div>
                <div className={styles.chart} role="img" aria-label="Annual principal and interest repayment chart">
                  {result.chart_series.map((point) => {
                    const principalHeight = Number(point.principal) / chartMaximum * 100;
                    const interestHeight = Number(point.interest) / chartMaximum * 100;
                    return <div className={styles.chartYear} key={point.year} title={`Year ${point.year}: ${formatMoney(point.principal)} principal, ${formatMoney(point.interest)} interest`}><div><span style={{ height: `${principalHeight}%` }} /><i style={{ height: `${interestHeight}%` }} /></div>{(point.year === 1 || point.year % 5 === 0 || point.year === result.chart_series.length) && <small>{point.year}</small>}</div>;
                  })}
                </div>
                <div className={styles.chartLegend}><span><i />Principal</span><span><i />Interest</span></div>
              </section>

              <details className={styles.details}>
                <summary>How the limits were applied <span>+</span></summary>
                <ul>{result.constraints_applied.slice(0, -1).map((constraint) => <li key={constraint}>{constraint}</li>)}</ul>
              </details>
              <details className={styles.details}>
                <summary>Warnings & assumptions <span>+</span></summary>
                <ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
              </details>
              <details className={styles.details}>
                <summary>Amortisation schedule <span>+</span></summary>
                <div className={styles.scheduleWrap}><table><thead><tr><th>Month</th><th>Instalment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{result.schedule.map((row) => <tr key={row.month_index}><td>{row.month_index}</td><td>{formatMoney(row.instalment)}</td><td>{formatMoney(row.principal_component)}</td><td>{formatMoney(row.interest_component)}</td><td>{formatMoney(row.closing_balance)}</td></tr>)}</tbody></table></div>
              </details>

              <section className={styles.shareSection}>
                <div className={styles.shareHeading}><span><Icon name="share" /></span><div><p className={styles.eyebrow}>Content Factory export</p><h3>Send the answer, not a screenshot.</h3><p>Add your identity once, then share a polished PNG.</p></div></div>
                <div className={styles.agentFields}>
                  <label><span>Agent name</span><input value={form.agentName} onChange={(event) => updateForm("agentName", event.target.value)} placeholder="Your name" /></label>
                  <label><span>CEA registration no.</span><input value={form.ceaNumber} onChange={(event) => updateForm("ceaNumber", event.target.value)} placeholder="R012345A" /></label>
                  <label><span>Agency</span><input value={form.agencyName} onChange={(event) => updateForm("agencyName", event.target.value)} placeholder="Agency name" /></label>
                  <label className={styles.photoField}><span>Agent photo</span><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (photoUrl) URL.revokeObjectURL(photoUrl); setPhotoUrl(file ? URL.createObjectURL(file) : ""); }} /><b>{photoUrl ? "Photo ready ✓" : "Choose photo"}</b></label>
                </div>

                <div className={`${styles.cardPreview} ${exportFormat === "story" ? styles.cardPreviewStory : ""}`}>
                  <div className={styles.previewBrand}><Image src="/homedash-logo.png" alt="HomeDash" width={476} height={186} unoptimized /><span>Mortgage estimate</span></div>
                  <p>Estimated monthly instalment</p><strong>{formatMoney(result.monthly_instalment)}</strong><em>First rate period</em>
                  <div className={styles.previewMetrics}><span>Loan <b>{formatMoney(result.effective_loan_amount)}</b></span><span>Binding rule <b>{result.affordability.binding_constraint}</b></span></div>
                  <small>{form.agentName || "Prepared with HomeDash"}{form.ceaNumber ? ` · CEA ${form.ceaNumber}` : ""}</small>
                </div>

                <div className={styles.formatToggle}>
                  <button type="button" className={exportFormat === "square" ? styles.formatActive : ""} onClick={() => setExportFormat("square")}><span className={styles.squareIcon} />Square</button>
                  <button type="button" className={exportFormat === "story" ? styles.formatActive : ""} onClick={() => setExportFormat("story")}><span className={styles.storyIcon} />9:16 story</button>
                </div>
                <div className={styles.shareActions}><button type="button" onClick={() => exportCard(true)} disabled={exporting}><Icon name="share" />{exporting ? "Preparing…" : "Share image"}</button><button type="button" onClick={() => exportCard(false)} disabled={exporting}>Download PNG</button></div>
                {shareStatus && <p className={styles.shareStatus} role="status">{shareStatus}</p>}
              </section>

              <footer className={styles.resultFooter}>
                <p>Rules current as of {result.rules.verified_on}. <a href={result.rules.source} target="_blank" rel="noreferrer">Primary source ↗</a></p>
                <p>{result.content_factory.disclaimer}</p>
              </footer>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
