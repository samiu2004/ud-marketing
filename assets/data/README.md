# Local LLC pricing data

## Updating a state filing fee

1. Open `assets/data/llc-state-fees.json`.
2. Find the record by its two-letter `code`.
3. Change `formationFeeUsd` to the nonnegative USD amount (a number, not a quoted string). Do not add processing, card, optional expedited/certified-copy, annual-report, tax, or registered-agent renewal charges.
4. Retain mandatory initial statutory components where the filing requires them, and explain the components in the internal `notes` field.
5. Preserve `recurringFeeUsd`, `recurringFrequency`, internal classifications, notes, and source provenance. These fields are not displayed by the checker.
6. Unless an official government fee source has actually been checked, keep `officialVerificationStatus: "PENDING"`, `officialSourceUrl: null`, and `lastOfficialVerifiedDate: null`.
7. After a real official-source check, record the source HTTPS URL, a `YYYY-MM-DD` date, and `officialVerificationStatus: "VERIFIED"`. A compact official-source link appears only when all three fields are valid; the verification date is included in its title and accessible label.
8. Preview `pricing.html`, verify the calculation, and redeploy through the normal approved process.

Changing one state's amount requires editing only its `formationFeeUsd` value. There are no live APIs, monitoring jobs, or databases.

## Provenance and validation

Imported from the owner-supplied `ud_marketing_50_state_llc_fee_research.csv`. The imported research has exactly 50 unique states. Florida was checked against https://dos.fl.gov/sunbiz/forms/fees/ on 2026-10-25: the required $100 filing fee plus $25 registered-agent fee totals $125. The other 49 official verification statuses remain PENDING. No other fees were changed. Existing preliminary amounts and notes are preserved, including Nevada's combined initial amount. The records are not a verified government fee schedule.

The browser rejects invalid/missing/negative fees, duplicate state codes or names, missing states, and invalid package configuration. Missing fees are never treated as zero. A data failure disables calculation and offers a retry.

## Package configuration

`assets/data/llc-packages.json` contains the approved package names, service fees, inclusions, and support levels. Custom has `fee: null` and is excluded from calculations and the comparison table. Initial formation totals contain only fixed package fees plus the selected state's listed initial filing fee.

The homepage and Pricing page cards share this configuration. After an approved package edit, run `node scripts/sync-pricing.cjs` from the repository root to refresh both sets of crawlable cards. Review the detailed comparison table separately if entitlements change. State-fee updates require only their JSON value; they do not require HTML changes.

## Route and existing homepage

The full Pricing page is `/pricing.html`, matching the site's HTML route convention. The homepage now displays the same Basic, Standard, Premium, and Custom packages. Its fee controls link to `/pricing.html?package=...#fee-checker`, preserving package selection. All fixed package prices exclude state filing fees.

The Get Started form accepts Basic, Standard, Premium, Custom, and legacy package URLs. Optional `state=WY` style parameters preserve the selected formation state in the inquiry and WhatsApp handoff. Form submission remains inactive pending delivery integration.
