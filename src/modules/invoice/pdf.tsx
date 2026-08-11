"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import {
  INVOICE_STATUS_LABELS,
  PAYMENT_MODE_LABELS,
  InvoiceBusiness,
  InvoiceStatus,
  formatMoney,
} from "./constants";
import {
  InvoiceFormData,
  computeTotals,
  toNumber,
  resolveBusiness,
  hasBankDetails,
} from "./schema";

const formatDate = (value: Date | string | undefined) => {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "-";
  return format(d, "dd MMM yyyy");
};

const sealVariant: Record<InvoiceStatus, { color: string; borderColor: string }> = {
  draft: { color: "#64748b", borderColor: "#94a3b8" },
  sent: { color: "#2563eb", borderColor: "#3b82f6" },
  partially_paid: { color: "#d97706", borderColor: "#f59e0b" },
  paid: { color: "#059669", borderColor: "#10b981" },
  overdue: { color: "#dc2626", borderColor: "#ef4444" },
  cancelled: { color: "#6b7280", borderColor: "#9ca3af" },
};

const styles = StyleSheet.create({
  page: {
    paddingVertical: 32,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandBadge: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#111827",
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 24,
  },
  brandName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  brandSub: {
    fontSize: 8,
    color: "#6b7280",
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  headerMeta: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  statusBadge: {
    marginTop: 4,
    fontSize: 8,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
    color: "#374151",
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#374151",
    marginBottom: 6,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: "33.33%",
    paddingRight: 12,
    marginBottom: 6,
  },
  label: {
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#6b7280",
  },
  value: {
    fontSize: 9,
    marginTop: 1,
  },
  partyBlock: {
    width: "50%",
    paddingRight: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableHeaderRow: {
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderCell: {
    padding: 6,
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#6b7280",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 6,
    fontSize: 9,
  },
  totals: {
    position: "relative",
    marginTop: 10,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    width: "45%",
    justifyContent: "space-between",
    paddingVertical: 1.5,
    fontSize: 9,
    color: "#6b7280",
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    marginTop: 2,
    paddingTop: 3,
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
  },
  footer: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    textAlign: "center",
    fontSize: 8,
    color: "#6b7280",
  },
  sealWrap: {
    position: "absolute",
    bottom: 2,
    left: 0,
  },
  seal: {
    transform: "rotate(-12deg)",
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 3,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
});

export function InvoiceDocument({
  data,
  business,
}: {
  data: InvoiceFormData;
  business?: InvoiceBusiness;
}) {
  const totals = computeTotals(data);
  const currency = data.currency;
  const shipTo = data.sameAsBilling ? data.billTo : data.shipTo;
  const resolvedBusiness = business ?? resolveBusiness(data);
  const paymentMode = data.paymentMode ?? "bank_transfer";
  const showBank =
    paymentMode === "bank_transfer" && hasBankDetails(data.bank);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <View style={styles.brandBadge}>
                <Text>{resolvedBusiness.name.slice(0, 1)}</Text>
              </View>
              <Text style={styles.brandName}>{resolvedBusiness.name}</Text>
            </View>
            <Text style={styles.brandSub}>{resolvedBusiness.address}</Text>
            <Text style={styles.brandSub}>
              {resolvedBusiness.email} · {resolvedBusiness.phone}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Invoice</Text>
            <Text style={styles.headerMeta}>#{data.invoiceNo}</Text>
            <Text style={styles.statusBadge}>
              {INVOICE_STATUS_LABELS[data.status]}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.grid}>
            <View style={styles.partyBlock}>
              <Text style={styles.label}>Bill To</Text>
              <Text style={styles.value}>{data.billTo.name || "-"}</Text>
              {data.billTo.company ? (
                <Text style={styles.value}>{data.billTo.company}</Text>
              ) : null}
              {data.billTo.address ? (
                <Text style={styles.value}>{data.billTo.address}</Text>
              ) : null}
              {data.billTo.email ? (
                <Text style={styles.value}>{data.billTo.email}</Text>
              ) : null}
            </View>
            <View style={styles.partyBlock}>
              <Text style={styles.label}>Ship To</Text>
              <Text style={styles.value}>{shipTo?.name || "-"}</Text>
              {shipTo?.company ? (
                <Text style={styles.value}>{shipTo.company}</Text>
              ) : null}
              {shipTo?.address ? (
                <Text style={styles.value}>{shipTo.address}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.grid}>
            <View style={styles.cell}>
              <Text style={styles.label}>Issue Date</Text>
              <Text style={styles.value}>{formatDate(data.issueDate)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.label}>Due Date</Text>
              <Text style={styles.value}>{formatDate(data.dueDate)}</Text>
            </View>
            <View style={styles.cell}>
              <Text style={styles.label}>Currency</Text>
              <Text style={styles.value}>{currency}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Line Items</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { width: "44%" }]}>
                Description
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "10%" }]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, { width: "16%" }]}>
                Rate
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "10%" }]}>
                Tax %
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Amount
              </Text>
            </View>
            {data.items.map((item, i) => {
              const amount =
                toNumber(item.qty) * toNumber(item.rate) +
                (toNumber(item.qty) *
                  toNumber(item.rate) *
                  toNumber(item.taxRate)) /
                  100;
              return (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: "44%" }]}>
                    {item.description || "-"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>
                    {toNumber(item.qty)}
                  </Text>
                  <Text style={[styles.tableCell, { width: "16%" }]}>
                    {formatMoney(toNumber(item.rate), currency)}
                  </Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>
                    {toNumber(item.taxRate)}%
                  </Text>
                  <Text style={[styles.tableCell, { width: "20%" }]}>
                    {formatMoney(amount, currency)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.totals}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{formatMoney(totals.subtotal, currency)}</Text>
            </View>
            {totals.discountAmount > 0 ? (
              <View style={styles.totalRow}>
                <Text>Discount</Text>
                <Text>{formatMoney(totals.discountAmount, currency)}</Text>
              </View>
            ) : null}
            <View style={styles.totalRow}>
              <Text>Tax</Text>
              <Text>{formatMoney(totals.tax, currency)}</Text>
            </View>
            <View style={[styles.totalRow, styles.totalRowFinal]}>
              <Text>Total</Text>
              <Text>{formatMoney(totals.total, currency)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Amount Paid</Text>
              <Text>{formatMoney(totals.paid, currency)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Balance Due</Text>
              <Text>{formatMoney(totals.balance, currency)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Payment Mode</Text>
              <Text>{PAYMENT_MODE_LABELS[paymentMode]}</Text>
            </View>
            <View style={styles.sealWrap}>
              <View
                style={[
                  styles.seal,
                  {
                    color: sealVariant[data.status].color,
                    borderColor: sealVariant[data.status].borderColor,
                  },
                ]}
              >
                <Text>{INVOICE_STATUS_LABELS[data.status]}</Text>
              </View>
            </View>
          </View>
        </View>

        {data.notes ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.value}>{data.notes}</Text>
          </View>
        ) : null}

        {data.terms ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Terms &amp; Conditions</Text>
            <Text style={styles.value}>{data.terms}</Text>
          </View>
        ) : null}

        {showBank ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Details</Text>
            <View style={styles.grid}>
              {data.bank.bankName ? (
                <View style={styles.cell}>
                  <Text style={styles.label}>Bank</Text>
                  <Text style={styles.value}>{data.bank.bankName}</Text>
                </View>
              ) : null}
              {data.bank.accountName ? (
                <View style={styles.cell}>
                  <Text style={styles.label}>Account Name</Text>
                  <Text style={styles.value}>{data.bank.accountName}</Text>
                </View>
              ) : null}
              {data.bank.accountNumber ? (
                <View style={styles.cell}>
                  <Text style={styles.label}>Account No.</Text>
                  <Text style={styles.value}>{data.bank.accountNumber}</Text>
                </View>
              ) : null}
              {data.bank.ifscCode ? (
                <View style={styles.cell}>
                  <Text style={styles.label}>IFSC</Text>
                  <Text style={styles.value}>{data.bank.ifscCode}</Text>
                </View>
              ) : null}
              {data.bank.swiftCode ? (
                <View style={styles.cell}>
                  <Text style={styles.label}>SWIFT</Text>
                  <Text style={styles.value}>{data.bank.swiftCode}</Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        <Text style={styles.footer}>
          This is a system-generated invoice. Please verify all details before
          payment.
        </Text>
      </Page>
    </Document>
  );
}
