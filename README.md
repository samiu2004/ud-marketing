# UD Marketing — static website

Responsive, dependency-free website for https://udmarketing.online. All styles, icons, illustrations, scripts, and social preview artwork are local. No framework, build step, database, customer account, paid API, analytics, or web checkout.

## Preview

Serve this directory with any static HTTP server. For example, with Node installed: npx --yes serve .

Use an HTTP server rather than opening the HTML directly because page links begin at the site root.

## GitHub → Cloudflare Pages

1. Create or choose your GitHub repository and upload the CONTENTS of this folder at the repository root (index.html, assets, guides, and the other files).
2. In Cloudflare Workers & Pages, create a Pages project and connect the repository.
3. Choose the production branch. Framework preset: None. Leave build command empty. Build output directory: / (repository root). No environment variables are required.
4. Deploy and inspect the assigned pages.dev address. Add udmarketing.online and, if wanted, www.udmarketing.online under Custom domains. Follow Cloudflare's DNS instructions.
5. Cloudflare Pages serves extensionless URLs for .html files. The authored .html links remain valid and may redirect to their clean equivalent. The root 404.html handles unknown routes.

Domain ownership, DNS configuration, repository creation, and deployment are not performed by creating these files. Verify the live domain before announcing launch.

## Pages

Home, Services, About, Guides, Contact, Privacy, Service Terms, six complete articles, and a custom 404. The guide library has topic filters, live search, and reset/empty states. The verification article has an official registry selector. Contact topic selection creates a WhatsApp message without sending it. No form inputs are persisted.

## Editing

Pages contain their content as plain HTML. Shared styles are assets/site.css; shared interactions are assets/site.js. Edit all page headers/footers consistently for navigation changes. For a new guide, duplicate an article, update its title, canonical URL, description, heading, schema, sources and review date; add its card to guides.html and update sitemap.xml. Do not change review dates without reviewing the underlying material.

## Content notes before launch

- Business name, contact, 50+ clients, three years of experience, all-state coverage, and customer countries were supplied by the owner; they are not independently audited.
- No invented testimonials, partner logos, offices, credentials, approval rates, fixed prices, or completion promises are included.
- Bank of America public guidance does not establish a universal no-visit path for nonresident applicants. Copy offers case-specific application assistance rather than a guaranteed remote account. Obtain current written bank confirmation for the actual proposed process before making a stronger claim.
- FinCEN BOI guidance reviewed October 15, 2026 exempts US-created entities; services and the BOI article explain applicability rather than implying mandatory filing for every US LLC.
- Formation document names vary by state; an LLC does not universally receive a separate Certificate of Incorporation.
- ITIN eligibility requires a federal tax purpose. An ITIN is not automatically needed by every foreign LLC owner.
- Amazon support is registration guidance, verification coaching, and appeal preparation, with no guaranteed approval or impersonation.
- Privacy and service-information pages describe this implementation. The owner should confirm operational document-handling arrangements and written order/refund terms before accepting customers. This site collects no documents or payments.
- No testimonials are displayed pending real, approved customer material.

## Motion and accessibility

Animations use CSS/SVG and IntersectionObserver. Content remains readable with JavaScript disabled. Reduced-motion users receive static visuals and no reveal movement. Semantic headings, skip navigation, labelled controls, focus styles, keyboard menu dismissal, and native FAQ disclosures are included.
