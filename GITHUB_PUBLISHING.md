# GitHub Publishing Guide

This guide publishes the HomeDash Singapore source code to GitHub and connects the repository to the existing Vercel website.

## Recommended repository settings

- **Repository name:** `homedash-singapore-presale`
- **Description:** `HomeDash Singapore presale landing page with mortgage and affordability calculators.`
- **Website:** `https://homedash-singapore-presale.vercel.app`
- **Topics:** `nextjs`, `typescript`, `singapore-property`, `mortgage-calculator`, `affordability-calculator`, `vercel`
- **Default branch:** `main`
- **Visibility:** Private is recommended until the owner explicitly approves public source distribution.

Publishing a repository publicly exposes its full tracked history. This project currently has no open-source license. A public repository without a license remains copyrighted, but contributors and users will not have clear reuse rights. Select and approve a license before presenting the project as open source.

## Before publishing

Run these commands from the project root:

```bash
git status --short
git log -1 --oneline
npm ci
npm run lint
npm test
npm run build:vercel
```

Confirm all of the following:

- Only intended source and documentation changes are committed.
- `.env*`, `.vercel/`, build output, credentials, and client data are not tracked.
- Calculator rules in `config/mortgage/` have a current review date and authoritative sources.
- The live production URL works at `/`, `/mortgage`, and `/affordability`.
- The repository visibility and licensing decision have been approved by the owner.

## Option A: Create the repository in the GitHub website

1. Sign in to GitHub and choose **New repository**.
2. Enter the recommended name, description, and visibility above.
3. Do **not** initialize the repository with a README, `.gitignore`, or license; these files are already managed locally.
4. Create the repository.
5. Copy the repository HTTPS or SSH URL.
6. In this project directory, add the remote and push:

```bash
git remote add origin https://github.com/OWNER/homedash-singapore-presale.git
git push -u origin main
```

For SSH-authenticated GitHub accounts, use:

```bash
git remote add origin git@github.com:OWNER/homedash-singapore-presale.git
git push -u origin main
```

Replace `OWNER` with the GitHub user or organization name. If `origin` already exists, inspect it with `git remote -v`; do not overwrite it until the destination is confirmed.

## Option B: Create and publish with GitHub CLI

Install and authenticate GitHub CLI, then run:

```bash
gh auth login
gh repo create homedash-singapore-presale \
  --private \
  --source=. \
  --remote=origin \
  --push \
  --description="HomeDash Singapore presale landing page with mortgage and affordability calculators." \
  --homepage="https://homedash-singapore-presale.vercel.app"
```

Change `--private` to `--public` only after public-source and license approval.

## Configure GitHub after the first push

1. Open **Settings → General** and confirm the default branch is `main`.
2. Open the repository's **About** settings and add the description, production URL, and recommended topics.
3. Open **Settings → Actions → General** and allow repository workflows.
4. Confirm the **Validate** workflow completes successfully.
5. Add a branch ruleset for `main`:
   - require a pull request before merging;
   - require the `test` status check;
   - require branches to be up to date before merging;
   - block force pushes and branch deletion;
   - require review from the project owner for production changes.
6. Enable Dependabot alerts and secret scanning where available.

## Connect GitHub to the existing Vercel site

The production website already exists on Vercel. Connect the GitHub repository to that existing Vercel project rather than importing it into a duplicate project.

1. Open the `homedash-singapore-presale` project in Vercel.
2. Go to **Settings → Git** and connect the GitHub repository.
3. Set the production branch to `main`.
4. Confirm these build settings:
   - Framework preset: **Next.js**
   - Root directory: repository root
   - Install command: `npm ci`
   - Build command: `npm run build:vercel`
5. Keep environment variables in Vercel settings, never in GitHub source.
6. Push a documentation-only branch or open a pull request to confirm Vercel creates a preview deployment.
7. Merge to `main` and verify the stable production alias remains:
   `https://homedash-singapore-presale.vercel.app`

## Post-publication verification

```bash
git remote -v
git branch -vv
git status --short
```

On GitHub, verify that:

- the README renders correctly and its production links open;
- the Actions workflow passes;
- no `.env`, `.vercel`, build, audit, or local analysis artifacts appear;
- media files load through GitHub and no tracked file exceeds GitHub's 100 MB limit;
- branch protection applies to `main`;
- the Vercel project points to this repository and production branch.

## Routine release workflow

```bash
git switch -c feature/short-description
# Make and test changes.
git add <intended-files>
git commit -m "Describe the change"
git push -u origin feature/short-description
```

Open a pull request, wait for the GitHub and Vercel checks, review the preview URL, then merge into `main`. Vercel will deploy the merged commit to production.

## Rollback

If a release fails, use the Vercel dashboard to promote the last verified deployment or run:

```bash
npx vercel rollback
```

Then revert the problematic Git commit through a pull request so GitHub and production return to the same source state.
