"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { AffordabilityFieldErrors, AffordabilityResult } from "@/lib/affordability/types";
import type { PropertyType } from "@/lib/mortgage/types";
import type { ResidencyStatus } from "@/lib/stamp-duty/calculator";
import styles from "./affordability.module.css";

type BorrowerRow = { age: string; income: string; incomeType: "fixed" | "variable"; residency: ResidencyStatus };
type ExportFormat = "square" | "story";

interface FormState {
  mode: "forward" | "reverse";
  targetPrice: string;
  propertyType: PropertyType;
  loanType: "bank" | "hdb_concessionary";
  tenure: string;
  expectedRate: string;
  existingProperties: number;
  existingLoans: number;
  borrowers: BorrowerRow[];
  carLoan: string;
  personalLoan: string;
  creditCards: string;
  studentLoan: string;
  otherDebt: string;
  cash: string;
  cpf: string;
  agentName: string;
  ceaNumber: string;
  agencyName: string;
}

const initialForm: FormState = {
  mode: "forward",
  targetPrice: "1000000",
  propertyType: "private",
  loanType: "bank",
  tenure: "25",
  expectedRate: "2.75",
  existingProperties: 0,
  existingLoans: 0,
  borrowers: [{ age: "35", income: "10000", incomeType: "fixed", residency: "citizen" }],
  carLoan: "0",
  personalLoan: "0",
  creditCards: "0",
  studentLoan: "0",
  otherDebt: "0",
  cash: "200000",
  cpf: "150000",
  agentName: "",
  ceaNumber: "",
  agencyName: "",
};

const propertyOptions: Array<{ value: PropertyType; label: string }> = [
  { value: "hdb", label: "HDB" },
  { value: "ec_developer", label: "New EC" },
  { value: "ec_resale", label: "Resale EC" },
  { value: "private", label: "Private" },
];

const money = (value: string | number) => new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  maximumFractionDigits: 0,
}).format(Number(value));

const percent = (value: string | number) => `${(Number(value) * 100).toFixed(2).replace(/\.?0+$/, "")}%`;

function percentToRate(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? String(numeric / 100) : "0";
}

function ErrorText({ errors, field }: { errors: AffordabilityFieldErrors; field: string }) {
  return errors[field]?.[0] ? <small className={styles.error}>{errors[field][0]}</small> : null;
}

function Icon({ name }: { name: "wallet" | "income" | "home" | "share" | "lock" | "check" }) {
  const paths = {
    wallet: <><path d="M4 7h15v12H4z" /><path d="M4 9V5h12v4m0 4h4v4h-4a2 2 0 0 1 0-4Z" /></>,
    income: <><circle cx="12" cy="12" r="9" /><path d="M15 8.5c-.8-.7-1.8-1-3-1-1.7 0-3 .9-3 2s1 1.8 3.1 2.3c2 .5 2.9 1.2 2.9 2.4 0 1.3-1.3 2.3-3 2.3-1.3 0-2.4-.4-3.2-1.2M12 5.5v13" /></>,
    home: <path d="m3 11 9-7 9 7v9H6v-9m4 9v-5h4v5" />,
    share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.5m-7.6 6.9 7.6 4.5" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function createShareCard(result: AffordabilityResult, form: FormState, format: ExportFormat) {
  const dimensions = format === "square" ? { width: 1080, height: 1080 } : { width: 1080, height: 1920 };
  const canvas = document.createElement("canvas");
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser could not prepare the share card.");
  const story = format === "story";
  const pad = 78;
  context.fillStyle = "#071637";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const glow = context.createRadialGradient(920, 120, 20, 920, 120, 680);
  glow.addColorStop(0, "rgba(255,100,0,.38)");
  glow.addColorStop(1, "rgba(255,100,0,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.font = "800 44px Arial";
  context.fillText("HomeDash", pad, 115);
  context.fillStyle = "#ff7626";
  context.font = "700 23px Arial";
  context.textAlign = "right";
  context.fillText("SINGAPORE AFFORDABILITY", canvas.width - pad, 108);
  context.textAlign = "left";
  const top = story ? 390 : 275;
  context.fillStyle = "#a9b4d4";
  context.font = "700 23px Arial";
  context.fillText(result.content_factory.headline.label.toUpperCase(), pad, top);
  context.fillStyle = "#fff";
  context.font = `800 ${story ? 96 : 88}px Arial`;
  context.fillText(money(result.content_factory.headline.value), pad, top + 110);
  context.fillStyle = "#ff8c45";
  context.font = "600 25px Arial";
  context.fillText(result.content_factory.headline.qualifier, pad, top + 158);
  const panelTop = story ? 690 : 520;
  const panelHeight = story ? 500 : 315;
  context.fillStyle = "rgba(255,255,255,.08)";
  context.beginPath();
  context.roundRect(pad, panelTop, canvas.width - pad * 2, panelHeight, 32);
  context.fill();
  const items = [
    ["Maximum loan", money(result.maximum_loan_amount)],
    ["Expected payment", `${money(result.expected_monthly_instalment)}/mo`],
    ["Stressed payment", `${money(result.stressed_monthly_instalment)}/mo`],
    ["Binding checks", result.binding_constraints.join(" + ") || "Within limits"],
  ];
  items.forEach(([label, value], index) => {
    const x = story ? pad + 48 : pad + 48 + (index % 2) * 450;
    const y = panelTop + 72 + (story ? index * 100 : Math.floor(index / 2) * 125);
    context.fillStyle = "#8f9abf";
    context.font = "700 18px Arial";
    context.fillText(label.toUpperCase(), x, y);
    context.fillStyle = label === "Binding checks" ? "#ff8c45" : "#fff";
    context.font = "700 32px Arial";
    context.fillText(value, x, y + 43);
  });
  const identityTop = story ? 1360 : 910;
  context.fillStyle = "#fff";
  context.font = "700 29px Arial";
  context.fillText(form.agentName || "Prepared with HomeDash", pad, identityTop);
  context.fillStyle = "#a9b4d4";
  context.font = "500 20px Arial";
  context.fillText([form.ceaNumber ? `CEA ${form.ceaNumber}` : "", form.agencyName].filter(Boolean).join(" · ") || "Singapore Agent Tools", pad, identityTop + 40);
  context.fillStyle = "#ff8c45";
  context.font = "700 19px Arial";
  context.fillText(`RULES CURRENT AS OF ${result.rules.verified_on}`, pad, story ? 1620 : 1000);
  context.fillStyle = "#8390b6";
  context.font = "500 16px Arial";
  context.fillText("Estimate only · subject to lender and agency assessment · homedash.ai", pad, canvas.height - 60);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) throw new Error("The share card could not be generated.");
  return blob;
}

export default function AffordabilityCalculator() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<AffordabilityResult | null>(null);
  const [errors, setErrors] = useState<AffordabilityFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("square");
  const [exportStatus, setExportStatus] = useState("");
  const resultRef = useRef<HTMLElement>(null);

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => setForm((current) => ({ ...current, [field]: value }));
  const updateBorrower = (index: number, field: keyof BorrowerRow, value: string) => setForm((current) => ({
    ...current,
    borrowers: current.borrowers.map((borrower, borrowerIndex) => borrowerIndex === index ? { ...borrower, [field]: value } as BorrowerRow : borrower),
  }));

  const calculate = async () => {
    setLoading(true);
    setErrors({});
    setExportStatus("");
    try {
      const response = await fetch("/api/v1/calculators/affordability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: form.mode,
          target_property_price: form.mode === "reverse" ? form.targetPrice : form.targetPrice || null,
          property_type: form.propertyType,
          loan_type: form.loanType,
          borrowers: form.borrowers.map((borrower) => ({ age: Number(borrower.age), gross_monthly_income: borrower.income, income_type: borrower.incomeType, residency: borrower.residency })),
          existing_residential_properties: form.existingProperties,
          existing_housing_loans: form.existingLoans,
          monthly_debts: { car_loan: form.carLoan, personal_loan: form.personalLoan, credit_cards: form.creditCards, student_loan: form.studentLoan, other_debt: form.otherDebt },
          available_cash: form.cash,
          available_cpf: form.cpf,
          tenure_years: Number(form.tenure),
          expected_annual_rate: percentToRate(form.expectedRate),
          calculation_date: new Date().toISOString().slice(0, 10),
          agent: { name: form.agentName, cea_registration_number: form.ceaNumber, agency_name: form.agencyName },
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setErrors(payload.field_errors ?? { request: ["The affordability estimate could not be calculated."] });
        setResult(null);
        return;
      }
      setResult(payload as AffordabilityResult);
      window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    } catch {
      setErrors({ request: ["Could not reach the calculator. Check the connection and try again."] });
    } finally {
      setLoading(false);
    }
  };

  const exportCard = async (share: boolean) => {
    if (!result) return;
    if (form.agentName.trim() && !form.ceaNumber.trim()) {
      setExportStatus("Add the agent’s CEA registration number before exporting a named card.");
      return;
    }
    try {
      setExportStatus("Preparing image…");
      const blob = await createShareCard(result, form, exportFormat);
      const file = new File([blob], `homedash-affordability-${exportFormat}.png`, { type: "image/png" });
      if (share && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "HomeDash affordability estimate", text: "A Singapore home-affordability estimate prepared with HomeDash." });
        setExportStatus("Share sheet opened.");
      } else {
        downloadBlob(blob, file.name);
        setExportStatus(share ? "Image downloaded — ready to attach in WhatsApp." : "PNG downloaded.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setExportStatus(error instanceof Error ? error.message : "The image could not be generated.");
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand}><Image src="/homedash-logo.png" alt="HomeDash" width={476} height={186} priority unoptimized /></Link>
        <div><span>Agent tools</span><strong>Affordability calculator</strong></div>
        <Link href="/" className={styles.homeLink}>Home ↗</Link>
      </header>

      <section className={styles.hero}>
        <div><p className={styles.eyebrow}>Singapore affordability · Rules verified 18 Aug 2026</p><h1>Know the budget.<br /><em>Name the gap.</em></h1><p>Test income, debt, LTV, cash, CPF and stamp duty in one client-ready estimate.</p></div>
        <aside><Icon name="lock" /><span><strong>Stateless by design</strong>Income, debt and funds are never saved.</span></aside>
      </section>

      <nav className={styles.modeTabs} aria-label="Calculator mode">
        <button type="button" className={form.mode === "forward" ? styles.activeMode : ""} onClick={() => update("mode", "forward")}><Icon name="home" /><span><strong>What can I afford?</strong><small>Find a maximum purchase price</small></span></button>
        <button type="button" className={form.mode === "reverse" ? styles.activeMode : ""} onClick={() => update("mode", "reverse")}><Icon name="income" /><span><strong>What do I need?</strong><small>Work backwards from a target</small></span></button>
      </nav>

      <div className={styles.workspace}>
        <section className={styles.formPanel} aria-label="Affordability details">
          <div className={styles.sectionTitle}><b>01</b><span><h2>Target & property</h2><p>Choose the home and financing profile.</p></span></div>
          <label className={styles.wide}><span>{form.mode === "reverse" ? "Target property price" : "Price to test (optional)"}</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.targetPrice} onChange={(event) => update("targetPrice", event.target.value)} /></div><ErrorText errors={errors} field="target_property_price" /></label>
          <fieldset><legend>Property type</legend><div className={styles.segments}>{propertyOptions.map((option) => <button type="button" key={option.value} className={form.propertyType === option.value ? styles.selected : ""} onClick={() => { update("propertyType", option.value); if (option.value !== "hdb") update("loanType", "bank"); }}>{option.label}</button>)}</div></fieldset>
          {form.propertyType === "hdb" && <fieldset><legend>Loan provider</legend><div className={styles.twoSegments}><button type="button" className={form.loanType === "bank" ? styles.selected : ""} onClick={() => update("loanType", "bank")}>Bank loan</button><button type="button" className={form.loanType === "hdb_concessionary" ? styles.selected : ""} onClick={() => update("loanType", "hdb_concessionary")}>HDB loan</button></div></fieldset>}
          <div className={styles.twoCols}><label><span>Loan tenure</span><div className={styles.suffix}><input type="number" min="1" max="35" value={form.tenure} onChange={(event) => update("tenure", event.target.value)} /><b>years</b></div><ErrorText errors={errors} field="tenure_years" /></label><label><span>Expected rate p.a.</span><div className={styles.suffix}><input inputMode="decimal" value={form.expectedRate} onChange={(event) => update("expectedRate", event.target.value)} /><b>%</b></div></label></div>
          <div className={styles.twoCols}><label><span>Properties owned now</span><select value={form.existingProperties} onChange={(event) => update("existingProperties", Number(event.target.value))}><option value="0">None</option><option value="1">One</option><option value="2">Two or more</option></select></label><label><span>Existing housing loans</span><select value={form.existingLoans} onChange={(event) => update("existingLoans", Number(event.target.value))}><option value="0">None</option><option value="1">One</option><option value="2">Two or more</option></select></label></div>

          <div className={styles.divider} />
          <div className={styles.sectionTitle}><b>02</b><span><h2>Borrowers & income</h2><p>Variable income is weighted for TDSR.</p></span></div>
          {form.borrowers.map((borrower, index) => <div className={styles.borrower} key={index}><div className={styles.borrowerHead}><strong>Borrower {index + 1}</strong>{form.borrowers.length > 1 && <button type="button" onClick={() => update("borrowers", form.borrowers.filter((_, i) => i !== index))}>Remove</button>}</div><div className={styles.borrowerGrid}><label><span>Age</span><input type="number" min="18" max="100" value={borrower.age} onChange={(event) => updateBorrower(index, "age", event.target.value)} /><ErrorText errors={errors} field={`borrowers.${index}.age`} /></label><label><span>Gross monthly income</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={borrower.income} onChange={(event) => updateBorrower(index, "income", event.target.value)} /></div></label><label><span>Income type</span><select value={borrower.incomeType} onChange={(event) => updateBorrower(index, "incomeType", event.target.value)}><option value="fixed">Fixed salary</option><option value="variable">Variable / commission</option></select></label><label><span>Residency</span><select value={borrower.residency} onChange={(event) => updateBorrower(index, "residency", event.target.value)}><option value="citizen">Singapore citizen</option><option value="permanent_resident">Permanent resident</option><option value="foreigner">Foreigner</option></select></label></div></div>)}
          <button type="button" className={styles.addButton} onClick={() => update("borrowers", [...form.borrowers, { age: "35", income: "5000", incomeType: "fixed", residency: "citizen" }])}>+ Add joint borrower</button>

          <div className={styles.divider} />
          <div className={styles.sectionTitle}><b>03</b><span><h2>Monthly commitments</h2><p>Itemise every recurring credit obligation.</p></span></div>
          <div className={styles.debtGrid}>{([ ["Car loan", "carLoan"], ["Personal loan", "personalLoan"], ["Credit cards", "creditCards"], ["Student loan", "studentLoan"], ["Other debt", "otherDebt"] ] as Array<[string, keyof FormState]>).map(([label, field]) => <label key={field}><span>{label}</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={String(form[field])} onChange={(event) => update(field, event.target.value as never)} /></div></label>)}</div>

          <div className={styles.divider} />
          <div className={styles.sectionTitle}><b>04</b><span><h2>Available funds</h2><p>Minimum cash is kept separate from CPF.</p></span></div>
          <div className={styles.twoCols}><label><span>Available cash</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.cash} onChange={(event) => update("cash", event.target.value)} /></div></label><label><span>Available CPF OA</span><div className={styles.moneyInput}><b>S$</b><input inputMode="decimal" value={form.cpf} onChange={(event) => update("cpf", event.target.value)} /></div></label></div>
          {errors.request && <div className={styles.requestError} role="alert">{errors.request[0]}</div>}
          <button type="button" className={styles.calculate} onClick={calculate} disabled={loading}>{loading ? "Checking every ceiling…" : form.mode === "reverse" ? "Calculate the gaps →" : "Calculate affordability →"}</button>
          <p className={styles.privacy}><Icon name="lock" />No financial values are persisted or logged</p>
        </section>

        <aside className={styles.resultPanel} ref={resultRef} aria-live="polite">
          {!result ? <div className={styles.empty}><span><Icon name="wallet" /></span><p className={styles.eyebrow}>Four checks. One useful answer.</p><h2>Your affordability result appears here.</h2><p>The model returns every ceiling, the actual and stressed payments, plus a specific gap analysis in reverse mode.</p><ul><li><Icon name="check" />TDSR and applicable MSR</li><li><Icon name="check" />LTV and minimum cash</li><li><Icon name="check" />BSD, ABSD, fees, cash and CPF</li></ul></div> : <div className={styles.results}>
            <div className={styles.resultMeta}><span>Estimate ready</span><span>Rules: {result.rules.verified_on}</span></div>
            <div className={styles.headline}><p>{result.mode === "reverse" ? "Target property price" : "Estimated maximum property price"}</p><h2>{money(result.mode === "reverse" ? result.target_property_price! : result.maximum_property_price)}</h2><span>{result.affordable === null ? "Across all four checks" : result.affordable ? "Fits the modelled limits" : `Maximum modelled price ${money(result.maximum_property_price)}`}</span></div>
            {result.affordable !== null && <div className={result.affordable ? styles.pass : styles.gap}><strong>{result.affordable ? "Target fits" : "Target has gaps"}</strong><p>{result.affordable ? "Income, loan and available funds fit the configured checks." : "Use the gap analysis below before framing the next client step."}</p></div>}

            <section className={styles.resultSection}><div className={styles.resultHeading}><span><p className={styles.eyebrow}>All checks returned</p><h3>Affordability ceilings</h3></span><b>{result.binding_constraints.join(" + ")}</b></div><div className={styles.ceilingGrid}>{result.ceilings.map((ceiling) => <article key={ceiling.name} className={!ceiling.applies ? styles.notApplicable : result.binding_constraints.includes(ceiling.name) ? styles.binding : ""}><span>{ceiling.name === "CASH_CPF" ? "CASH + CPF" : ceiling.name}</span><strong>{ceiling.applies ? money(ceiling.maximum_loan ?? ceiling.maximum_property_price ?? 0) : "Not applicable"}</strong><small>{ceiling.maximum_loan ? "Maximum loan" : ceiling.applies ? "Maximum price" : "For this property type"}</small><p>{ceiling.explanation}</p></article>)}</div></section>

            <section className={styles.resultSection}><div className={styles.resultHeading}><span><p className={styles.eyebrow}>Monthly payment</p><h3>Expected vs stressed</h3></span><b>{percent(result.stress_rate)} stress</b></div><div className={styles.paymentCompare}><div><span>Expected at {percent(result.expected_rate)}</span><strong>{money(result.expected_monthly_instalment)}<small>/mo</small></strong></div><div><span>Stressed at {percent(result.stress_rate)}</span><strong>{money(result.stressed_monthly_instalment)}<small>/mo</small></strong></div></div><p className={styles.assumption}>Assumed loan for this view: {money(result.assumed_loan_amount)} · IWAA {result.income_weighted_average_age}</p></section>

            <section className={styles.resultSection}><div className={styles.resultHeading}><span><p className={styles.eyebrow}>Upfront requirement</p><h3>Cash, CPF & duties</h3></span><b>{money(result.upfront.cash_and_cpf_required)}</b></div><div className={styles.fundRows}><span>Minimum cash <b>{money(result.upfront.minimum_cash)}</b></span><span>BSD <b>{money(result.stamp_duty.bsd)}</b></span><span>ABSD ({percent(result.stamp_duty.absd_rate)}) <b>{money(result.stamp_duty.absd)}</b></span><span>Legal, valuation & misc. <b>{money(result.upfront.other_fees)}</b></span><span>Cash available <b>{money(result.upfront.available_cash)}</b></span><span>CPF available <b>{money(result.upfront.available_cpf)}</b></span></div></section>

            {result.reverse && <section className={`${styles.resultSection} ${styles.reverseSection}`}><div className={styles.resultHeading}><span><p className={styles.eyebrow}>Reverse calculation</p><h3>What would need to change</h3></span></div><div className={styles.gapGrid}><div><span>Extra effective income</span><strong>{money(result.reverse.additional_effective_monthly_income)}<small>/mo</small></strong></div><div><span>Or reduce monthly debt</span><strong>{money(result.reverse.monthly_debt_reduction)}<small>/mo</small></strong></div><div><span>Minimum cash shortfall</span><strong>{money(result.reverse.minimum_cash_shortfall)}</strong></div><div><span>Total funds shortfall</span><strong>{money(result.reverse.total_funds_shortfall)}</strong></div></div><p>{result.reverse.explanation}</p></section>}

            <details className={styles.details}><summary>Warnings & assumptions <span>+</span></summary><ul>{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></details>

            <section className={styles.shareSection}><div className={styles.shareTitle}><Icon name="share" /><span><p className={styles.eyebrow}>Content Factory</p><h3>Export a two-panel result.</h3><p>Panel one leads with the answer; panel two carries checks, identity and disclaimer.</p></span></div><div className={styles.agentGrid}><label><span>Agent name</span><input value={form.agentName} onChange={(event) => update("agentName", event.target.value)} placeholder="Your name" /></label><label><span>CEA registration no.</span><input value={form.ceaNumber} onChange={(event) => update("ceaNumber", event.target.value)} placeholder="R012345A" /></label><label><span>Agency</span><input value={form.agencyName} onChange={(event) => update("agencyName", event.target.value)} placeholder="Agency name" /></label></div><div className={`${styles.preview} ${exportFormat === "story" ? styles.storyPreview : ""}`}><div><Image src="/homedash-logo.png" alt="HomeDash" width={476} height={186} unoptimized /><span>Affordability</span></div><p>{result.content_factory.headline.label}</p><strong>{money(result.content_factory.headline.value)}</strong><em>{result.binding_constraints.join(" + ")}</em><small>{form.agentName || "Prepared with HomeDash"}{form.ceaNumber ? ` · CEA ${form.ceaNumber}` : ""}</small></div><div className={styles.exportControls}><button type="button" className={exportFormat === "square" ? styles.exportActive : ""} onClick={() => setExportFormat("square")}>Square</button><button type="button" className={exportFormat === "story" ? styles.exportActive : ""} onClick={() => setExportFormat("story")}>9:16 story</button><button type="button" onClick={() => exportCard(true)}>Share</button><button type="button" onClick={() => exportCard(false)}>Download PNG</button></div>{exportStatus && <p className={styles.exportStatus}>{exportStatus}</p>}</section>
            <footer><p>Rules current as of {result.rules.verified_on}. <a href={result.rules.source} target="_blank" rel="noreferrer">Primary source ↗</a></p><p>{result.content_factory.disclaimer}</p></footer>
          </div>}
        </aside>
      </div>
    </main>
  );
}

