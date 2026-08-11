# @xmerge/invoice

Self-contained invoice module for Next.js + shadcn/ui apps: zod schema, TanStack Query hooks, localStorage persistence, a single-page industrial create/edit form, an HTML preview, and PDF export via `@react-pdf/renderer`.

The same source lives at `src/modules/invoice` in this repo and is exported as the package's public API — so it can be consumed in-app, copied into another project, or published to npm as-is.

## Features

- Full business invoice model: seller company (optional, "Your Company"), bill-to/ship-to, line items with per-line tax %, discount (none/%/fixed), subtotal/tax/total, amount paid & balance due, mode of payment (bank transfer/cash/cheque/card/other) with bank details shown only for bank transfer, notes, and terms.
- Zod schema + derived types, live totals, currency-aware money formatting.
- localStorage persistence with date revival, plus `@tanstack/react-query` hooks (list/get/save/update/delete).
- Draft autosave/restore (create mode) and full state layer via zustand (`useInvoiceStore`).
- Single-page industrial form (`InvoiceForm`) with sectioned layout and full-form validation.
- HTML preview (`InvoicePreview`), preview drawer, and A4 PDF (`InvoiceDocument` / `downloadInvoicePdf`).

## Requirements (peer dependencies)

- React 18+, Next.js 14+
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `@tanstack/react-query`, `zustand`, `sonner`, `date-fns`, `lucide-react`, `@react-pdf/renderer`
- shadcn/ui components: `button`, `input`, `label`, `textarea`, `checkbox`, `badge`, `calendar`, `popover`, `select`, `table`, `drawer`, `tooltip`
- A `cn` helper at `@/lib/utils` and the `@/` path alias mapped to your `src` directory

## Usage

```tsx
import { InvoiceForm } from "@xmerge/invoice";

export default function CreateInvoice() {
  return <InvoiceForm mode="create" />;
}
```

## Public API

- `invoiceSchema`, `invoiceStepFieldMap`, `computeTotals`, `toNumber`, `normalizeInvoiceData`, `mergeInvoiceDefaults`, `resolveBusiness`, `hasBankDetails`, types: `InvoiceFormData`, `InvoiceParty`, `InvoiceLineItem`, `InvoiceBankDetails`, `InvoiceCompany`, `InvoiceTotals`
- Constants: `INVOICE_STATUSES`, `INVOICE_STATUS_LABELS`, `DISCOUNT_TYPES`, `CURRENCIES`, `DEFAULT_TAX_RATES`, `PAYMENT_MODES`, `PAYMENT_MODE_LABELS`, `DEFAULT_BUSINESS`, `formatMoney`
- Storage: `saveInvoice`, `getInvoice`, `getInvoices`, `updateInvoice`, `deleteInvoice`, `reviveDates`
- Hooks: `useInvoices`, `useInvoice`, `useSaveInvoice`, `useUpdateInvoice`, `useDeleteInvoice`, `useInvoiceStore` (full state layer: `invoices`, `ready`, `hydrate`, `addInvoice`, `updateInvoiceById`, `deleteInvoiceById`, `getInvoiceById`, plus draft/preview state), `useInvoiceDraftStore` (alias kept for compatibility)
- Components: `InvoiceForm`, `InvoicePreview`, `InvoicePreviewDrawer`, `InvoiceDocument`, and form sections: `InvoiceHeaderFields`, `CompanySection`, `PartiesSection`, `LineItemsSection`, `PaymentSection`
- Helpers: `createInvoiceDefaults`, `downloadInvoicePdf`

## Build

```bash
npm install --legacy-peer-deps
npm run build   # tsup -> dist/ (esm + cjs + dts)
```
