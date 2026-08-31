# Contributing

## Development workflow

1. Create a branch from the latest `main`.
2. Keep changes focused and do not commit generated output, credentials, or client data.
3. Update tests and documentation when behavior changes.
4. Run the local validation commands.
5. Open a pull request and verify both GitHub Actions and the Vercel preview.

```bash
npm ci
npm run lint
npm test
npm run build:vercel
```

## Financial calculation changes

Changes to mortgage, affordability, CPF, BSD, ABSD, TDSR, MSR, LTV, or tenure rules require extra care:

- cite the authoritative Singapore government or regulator source;
- create a new date-versioned configuration when rules change;
- record the effective, verification, and next-review dates;
- add fixtures for the changed behavior and important boundaries;
- keep monetary arithmetic deterministic and avoid binary floating-point calculations;
- preserve plain-language warnings and the user-facing disclaimer.

## Pull requests

Every pull request should explain:

- what changed and why;
- which pages, calculators, APIs, or rules are affected;
- how the change was tested;
- whether screenshots or Vercel preview checks were completed;
- any regulatory sources or assumptions used.

Do not merge directly into `main` without passing tests and reviewing the Vercel preview for user-facing changes.
