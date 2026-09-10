# UltraOP — Official Gaming Creator Portal

Production rebuild of the UltraOP website.

## Project Direction

This repository is the final build target for the UltraOP website. It combines verified content and assets from the previous production website and the newer React-based reference implementation.

### Non-negotiable data

- Official YouTube channel IDs are treated as canonical identifiers and must not be changed unless explicitly instructed.
- Verified creator, social, business, support, and brand-campaign records are preserved.
- Existing production URLs and legacy content are considered migration references.
- Secrets and API credentials must remain server-side/environment-only and must never be committed.

## Planned stack

- React + TypeScript
- Vite
- Tailwind CSS
- Node/Express API layer where required
- Responsive, accessibility-minded UI
- Technical SEO and structured data
- Production-ready routing and legacy URL mapping
