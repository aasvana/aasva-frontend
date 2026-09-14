"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { hotelMealPlans } from "@/constants/hotelMealPlans";
import { hotelRoomTypes } from "@/constants/hotelRoomTypes";
import { CompanyData } from "@/stores/companyStore";
import { ConfirmationVoucherFormData } from "@/app/pages/dashboard/confirmationvouchers/schema";

const mealTypeLabel = (code: string) =>
  hotelMealPlans.find((m) => m.code === code)?.name ?? code;

const roomTypeLabel = (code: string) =>
  hotelRoomTypes.find((r) => r.code === code)?.name ?? code;

const formatDate = (value: Date | string | undefined) => {
  if (!value) return "-";
  const d = typeof value === "string" ? new Date(value) : value;
  if (isNaN(d.getTime())) return "-";
  return format(d, "dd MMM yyyy");
};

const stripHtml = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>|<\/div>|<\/li>/gi, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

function renderableLogo(logo?: string | null): string | null {
  if (!logo) return null;
  if (/^data:image\//i.test(logo)) return logo;
  if (/\.(png|jpe?g|gif|bmp|tiff)(\?|#|$)/i.test(logo)) {
    if (typeof window !== "undefined") {
      return new URL(logo, window.location.origin).href;
    }
    return logo;
  }
  return null;
}

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
  brandLogo: {
    width: 24,
    height: 24,
    objectFit: "contain",
  },
  brandName: {
    fontSize: 14,
    fontWeight: "bold",
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
    width: "25%",
    paddingRight: 12,
    marginBottom: 6,
  },
  cellThird: {
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
  hotelCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
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
});

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "-"}</Text>
    </View>
  );
}

export function CvPreviewDocument({
  data,
  company,
}: {
  data: ConfirmationVoucherFormData;
  company: CompanyData;
}) {
  const d = data;
  const logoSource = renderableLogo(company.logo);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            {logoSource ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <Image src={logoSource} style={styles.brandLogo} />
            ) : (
              <View style={styles.brandBadge}>
                <Text>{company.shortName}</Text>
              </View>
            )}
            <Text style={styles.brandName}>{company.name}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>Confirmation Voucher</Text>
            <Text style={styles.headerMeta}>Voucher No: {d.voucherNo}</Text>
            <Text style={styles.headerMeta}>
              Booking Date: {formatDate(d.bookingDate)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <View style={styles.grid}>
            <DetailRow label="Customer Name" value={d.customerName} />
            <DetailRow label="Agent" value={d.agentName} />
            <DetailRow label="Mobile No." value={d.mobileNo} />
            <DetailRow label="Email" value={d.emailAddress} />
            <DetailRow label="Company" value={d.companyName} />
            <DetailRow label="Journey Date" value={formatDate(d.journeyDate)} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Details - Boarding</Text>
          <View style={styles.grid}>
            <DetailRow label="Airline" value={d.boardingAirline} />
            <DetailRow label="Date" value={formatDate(d.boardingDate)} />
            <DetailRow label="From" value={d.boardingFrom} />
            <DetailRow label="To" value={d.boardingTo} />
            <DetailRow label="Departure" value={d.boardingDepartureTime} />
            <DetailRow label="Arrival" value={d.boardingArrivalTime} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travel Details - Returning</Text>
          <View style={styles.grid}>
            <DetailRow label="Airline" value={d.returnAirline} />
            <DetailRow label="Date" value={formatDate(d.returnDate)} />
            <DetailRow label="From" value={d.returnFrom} />
            <DetailRow label="To" value={d.returnTo} />
            <DetailRow label="Departure" value={d.returnDepartureTime} />
            <DetailRow label="Arrival" value={d.returnArrivalTime} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Travellers</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { width: "50%" }]}>
                Name
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Age
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
                Gender
              </Text>
            </View>
            {d.travellers.map((t, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "50%" }]}>
                  {t.name}
                </Text>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {t.age}
                </Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {t.gender}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hotels</Text>
          {d.hotels.map((h, i) => (
            <View key={i} style={styles.hotelCard}>
              <View style={styles.grid}>
                <DetailRow label="Destination" value={h.destination} />
                <DetailRow label="Hotel" value={h.hotelName} />
                <DetailRow label="Meal Type" value={mealTypeLabel(h.mealType)} />
                <DetailRow
                  label="Room Category"
                  value={roomTypeLabel(h.roomCategory)}
                />
                <DetailRow label="Room" value={h.room} />
                <DetailRow label="Max Occupancy" value={h.maxOccupancy} />
                <DetailRow label="Adults" value={h.adults} />
                <DetailRow label="Children" value={h.children} />
                <DetailRow label="Extra Mattress" value={h.extraMattress} />
                <DetailRow label="Check-in" value={formatDate(h.checkinDate)} />
                <DetailRow
                  label="Check-out"
                  value={formatDate(h.checkoutDate)}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Package Details</Text>
          <View style={styles.grid}>
            <View style={[styles.cell, { width: "50%" }]}>
              <Text style={styles.label}>Included</Text>
              <Text style={styles.value}>{stripHtml(d.packageIncluded)}</Text>
            </View>
            <View style={[styles.cell, { width: "50%" }]}>
              <Text style={styles.label}>Excluded</Text>
              <Text style={styles.value}>{stripHtml(d.packageExcluded)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tour Itinerary</Text>
          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                Date
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
                Subject
              </Text>
              <Text style={[styles.tableHeaderCell, { width: "50%" }]}>
                Itinerary
              </Text>
            </View>
            {d.itineraries.map((it, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: "20%" }]}>
                  {formatDate(it.date)}
                </Text>
                <Text style={[styles.tableCell, { width: "30%" }]}>
                  {it.subject}
                </Text>
                <Text style={[styles.tableCell, { width: "50%" }]}>
                  {it.itinerary}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General Details</Text>
          <View style={styles.grid}>
            <DetailRow label="Check-in Time" value={d.checkinTime} />
            <DetailRow label="Check-out Time" value={d.checkoutTime} />
            <DetailRow label="Smoking Policy" value={d.smokingPolicy} />
            <DetailRow
              label="Consumption of Liquor"
              value={d.consumptionOfLiquor}
            />
            <DetailRow
              label="Assistance"
              value={`${d.assistanceName} - ${d.assistancePhone}`}
            />
            <DetailRow
              label="Support"
              value={`${d.supportName} - ${d.supportPhone}`}
            />
            <DetailRow
              label="Emergency"
              value={`${d.emergencyName} - ${d.emergencyPhone}`}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Official Details</Text>
          <View style={styles.grid}>
            <DetailRow label="Payment Type" value={d.paymentType} />
            <DetailRow label="Total Amount" value={d.totalAmount} />
            <DetailRow label="Amount Received" value={d.amountReceived} />
            <DetailRow label="Amount Balanced" value={d.amountBalanced} />
          </View>
        </View>

        <Text style={styles.footer}>
          This is a system-generated confirmation voucher. Please verify all
          details before travel.
        </Text>
      </Page>
    </Document>
  );
}
