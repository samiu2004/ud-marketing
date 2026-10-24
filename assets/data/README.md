# Local LLC pricing data

## Updating a state filing fee

1. Open `assets/data/llc-state-fees.json`.
2. Find the record by its two-letter `code`.
3. Change `formationFeeUsd` to the nonnegative USD amount (a number, not a quoted string). Do not add processing, card, optional expedited/certified-copy, annual-report, tax, or registered-agent renewal charges.
4. Retain mandatory initial statutory components where the filing requires them, and explain the components in the internal `notes` field.
5. Preserve `recurringFeeUsd`, `recurringFrequency`, internal classifications, notes, and source provenance. These fields are not displayed by the checker.
6. Unless an official government fee source has actually been checked, keep `officialVerificationStatus: "PENDING"`, `officialSourceUrl: null`, and `lastOfficialVerifiedDate: null`.
7. After a real official-source check, record the source HTTPS URL, a `YYYY-MM-DD` date, and `officialVerificationStatus: "VERIFIED"`. A source link and date appear only when all three fields are valid.
8. Preview `pricing.html`, verify the calculation, and redeploy through the normal approved process.

Changing one state's amount requires editing only its `formationFeeUsd` value. There are no live APIs, monitoring jobs, or databases.

## Provenance and validation

Imported from the owner-supplied `ud_marketing_50_state_llc_fee_research.csv`. The imported research has exactly 50 unique states. All 50 official verification statuses remain PENDING, with no invented source URLs or dates. Existing preliminary amounts and notes are preserved, including Nevada's combined initial amount. The records are not a verified government fee schedule.

The browser rejects invalid/missing/negative fees, duplicate state codes or names, missing states, and invalid package configuration. Missing fees are never treated as zero. A data failure disables calculation and offers a retry.

## Package configuration

`assets/data/llc-packages.json` contains the approved package names, service fees, inclusions, and support levels. Custom has `fee: null` and is excluded from calculations and the comparison table. Initial formation totals contain only fixed package fees plus the selected state's listed initial filing fee.

The page's static package cards and comparison table are kept crawlable. If approved package prices or inclusions change later, update both the package JSON and the matching markup in `pricing.html`. State-fee updates do not require HTML changes.

## Route and existing homepage

The full Pricing page is `/pricing.html`, matching the site's HTML route convention. The pre-existing homepage pricing section and its navigation were preserved under the master prompt's scope restriction; they still show the previous Launch/Grow/Expand offering until the owner authorizes a separate homepage update. Do not imply those older inclusive prices are additive service fees.

The Get Started form accepts Basic, Standard, Premium, Custom, and legacy package URLs. Optional `state=WY` style parameters preserve the selected formation state in the inquiry and WhatsApp handoff. Form submission remains inactive pending delivery integration.
