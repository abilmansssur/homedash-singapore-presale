# HomeDash Singapore

HomeDash Singapore is a presale landing page for property agents and agencies, with practical mortgage and property-affordability calculators for the Singapore market.

## Live website

**Production:** https://homedash-singapore-presale.vercel.app

### Main pages

| Page | URL | Purpose |
| --- | --- | --- |
| Landing page | https://homedash-singapore-presale.vercel.app/ | HomeDash product overview, demos, pilot information, reviews, FAQ, and contact options |
| Mortgage Calculator | https://homedash-singapore-presale.vercel.app/mortgage | Estimates loan eligibility, repayments, CPF usage, duties, and affordability checks |
| Affordability Calculator | https://homedash-singapore-presale.vercel.app/affordability | Estimates a maximum property price or tests a target price against financing and upfront-funds constraints |

The two calculators are available from **Tools** in the landing-page navigation bar.

## How to use the website

### Landing page

1. Use the navigation bar to jump to Features, Pilot, Reviews, or FAQ.
2. Open **Tools** to launch either calculator.
3. Review the three HomeDash content workflows and their video demonstrations.
4. Use **Join the agent pilot** to reach the consultation booking section.
5. Use the email, WhatsApp, or global-site links in the footer for direct contact.

### Mortgage Calculator

1. Enter the property price and choose the property type: HDB, developer EC, resale EC, or private residential.
2. Choose the loan type where applicable, enter an optional requested loan, select the tenure, and state the number of existing housing loans.
3. Enter the loan's interest-rate schedule. Multiple rate periods can be added for packages that reprice over time.
4. Add each borrower with age, gross monthly income, income type, CPF OA balance, and expected monthly CPF contribution.
5. Add existing monthly debt commitments.
6. Provide lease information when CPF usage depends on the remaining lease.
7. Run the estimate and review:
   - effective loan and binding rule;
   - monthly repayment by rate period;
   - TDSR and, where applicable, MSR checks;
   - LTV and minimum-cash requirements;
   - estimated BSD and ABSD;
   - CPF usage limits and accrued-interest projection;
   - warnings, assumptions, and rate sensitivity.
8. Optionally add agent details and download or share the generated result card.

### Affordability Calculator

1. Choose **Maximum price** to estimate a purchase ceiling, or **Check a target** to test a specific property price.
2. Select the property and loan profile, tenure, expected interest rate, and number of existing properties or housing loans.
3. Add all borrowers, including age, gross monthly income, income type, and residency.
4. Enter monthly car, personal, credit-card, student, and other debt payments.
5. Enter available cash and CPF OA funds.
6. Run the calculation and review:
   - the estimated maximum or target property price;
   - TDSR, MSR, LTV, and cash-plus-CPF ceilings;
   - expected and stressed monthly repayments;
   - minimum cash, CPF, BSD, ABSD, and other upfront costs;
   - any income, debt, cash, or total-funds gap for a target price.
7. Optionally add agent details and export a square or 9:16 result card.

## Important calculation notes

- Results are estimates for planning and discussion; they are not loan approval, financial advice, tax advice, or a valuation.
- Actual eligibility and costs depend on the lender, HDB, CPF Board, MAS, IRAS, the property, and the borrowers' complete circumstances.
- Variable income is weighted for affordability calculations.
- MSR is only applied to relevant HDB and developer-EC cases.
- Rules are date-versioned in [`config/mortgage/2026-08-18.json`](config/mortgage/2026-08-18.json). Review the official sources and update the configuration when regulations change.
- Calculator inputs are used for the current calculation and are not saved by this application.

## Technology

- Next.js 16 App Router
- React 19
- TypeScript
- `decimal.js` for deterministic financial arithmetic
- Vercel production hosting
- Vinext/Vite configuration retained for the OpenAI Sites build target

## Local development

### Requirements

- Node.js 22.x
- npm

### Install and run

```bash
npm ci
npm run dev
```

Open http://localhost:3000. If port 3000 is occupied, use the URL printed by the development server.

### Useful commands

```bash
npm run dev             # Start the Vinext development server
npm run build           # Create the Vinext/Sites production build
npm run build:vercel    # Create the Next.js build used by Vercel
npm test                # Run calculator tests, build, and rendered-page tests
npm run test:mortgage   # Run calculator and CPF tests only
npm run lint            # Run ESLint
```

## API routes

All calculator endpoints accept JSON with `POST` and return JSON. Validation failures return HTTP 400 with field-level messages.

| Endpoint | Purpose |
| --- | --- |
| `/api/v1/calculators/mortgage` | Mortgage repayment, LTV, TDSR/MSR, CPF, duty, and sensitivity calculations |
| `/api/v1/calculators/affordability` | Maximum-price and target-price affordability calculations |
| `/api/v1/services/stamp-duty` | Residential BSD and ABSD estimate |
| `/api/v1/services/cpf/usage-limit` | CPF housing usage-limit estimate |
| `/api/v1/services/cpf/accrued-interest` | CPF accrued-interest projection |

The web interfaces are the recommended way to use these endpoints. For request and response types, see `lib/mortgage/types.ts`, `lib/affordability/types.ts`, and `lib/cpf/types.ts`.

## Project structure

```text
app/                         Pages, calculators, styles, and API routes
config/mortgage/             Date-versioned Singapore mortgage rules
lib/                         Financial calculation and validation logic
public/                      Logos, images, videos, and social preview assets
tests/                       Calculator and rendered-page tests
vercel.json                  Vercel build configuration
```

## Deployment

The source repository can be stored on GitHub, while Vercel serves the production website. GitHub Pages is not used because the application includes server-rendered pages and API routes.

For the complete repository creation, visibility, branch-protection, and verification checklist, see [`GITHUB_PUBLISHING.md`](GITHUB_PUBLISHING.md).

### Deploy to Vercel from a workstation

```bash
npm ci
npm test
npm run build:vercel
npx vercel deploy --prod
```

The repository is already configured through `vercel.json` to run `npm ci` and `npm run build:vercel`.

### Enable deployments from GitHub

1. Import the GitHub repository into Vercel or connect it from the existing Vercel project's Git settings.
2. Confirm the framework is **Next.js** and the project root is the repository root.
3. Keep the install command as `npm ci` and the build command as `npm run build:vercel`.
4. Set the production branch to `main`.
5. Vercel will then create previews for pull requests and production deployments for changes merged to `main`.

## Privacy and security

- Do not commit `.env*`, `.vercel/`, generated build output, or credentials.
- Do not put real client financial information into test fixtures or screenshots.
- Review dependency advisories and regulatory configuration before each production release.
- Treat exported result cards as estimates and keep the disclaimer visible.

Please report security issues privately using the process in [`SECURITY.md`](SECURITY.md). Development and pull-request guidance is available in [`CONTRIBUTING.md`](CONTRIBUTING.md).

