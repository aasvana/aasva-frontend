"use client";

import * as React from "react";
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

const renderRichText = (html: string) => {
  if (!html) return null;
  if (!/<\/?[a-z][\s\S]*>/i.test(html)) {
    return <p className="whitespace-pre-line text-sm text-gray-900">{html}</p>;
  }
  return (
    <div
      className="rte-content text-sm text-gray-900"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-1">
      <span className="text-[10px] uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">{value || "-"}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-200 py-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ConfirmationVoucher({
  data,
  company,
}: {
  data: ConfirmationVoucherFormData;
  company: CompanyData;
}) {
  const d = data;

  return (
    <div className="bg-white px-6 py-6 md:px-10 md:py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4">
        <div>
          <div className="flex items-center gap-2">
            {company.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.logo}
                alt={company.name}
                className="size-9 rounded-md border border-gray-200 bg-white object-contain"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-md bg-gray-900 text-sm font-bold text-white">
                {company.shortName}
              </span>
            )}
            <span className="text-lg font-bold">{company.name}</span>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            Confirmation Voucher
          </h2>
          <p className="text-sm text-gray-500">Voucher No: {d.voucherNo}</p>
          <p className="text-sm text-gray-500">
            Booking Date: {formatDate(d.bookingDate)}
          </p>
        </div>
      </div>

      <Section title="Customer Details">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailRow label="Customer Name" value={d.customerName} />
          <DetailRow label="Agent" value={d.agentName} />
          <DetailRow label="Mobile No." value={d.mobileNo} />
          <DetailRow label="Email" value={d.emailAddress} />
          <DetailRow label="Company" value={d.companyName} />
          <DetailRow label="Journey Date" value={formatDate(d.journeyDate)} />
        </div>
      </Section>

      <Section title="Travel Details - Boarding">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <DetailRow label="Airline" value={d.boardingAirline} />
          <DetailRow label="Date" value={formatDate(d.boardingDate)} />
          <DetailRow label="From" value={d.boardingFrom} />
          <DetailRow label="To" value={d.boardingTo} />
          <DetailRow label="Departure" value={d.boardingDepartureTime} />
          <DetailRow label="Arrival" value={d.boardingArrivalTime} />
        </div>
      </Section>

      <Section title="Travel Details - Returning">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <DetailRow label="Airline" value={d.returnAirline} />
          <DetailRow label="Date" value={formatDate(d.returnDate)} />
          <DetailRow label="From" value={d.returnFrom} />
          <DetailRow label="To" value={d.returnTo} />
          <DetailRow label="Departure" value={d.returnDepartureTime} />
          <DetailRow label="Arrival" value={d.returnArrivalTime} />
        </div>
      </Section>

      <Section title="Travellers">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Age</th>
              <th className="py-2 font-medium">Gender</th>
            </tr>
          </thead>
          <tbody>
            {d.travellers.map((t, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-2 pr-4 text-gray-900">{t.name}</td>
                <td className="py-2 pr-4 text-gray-900">{t.age}</td>
                <td className="py-2 capitalize text-gray-900">{t.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Hotels">
        {d.hotels.map((h, i) => (
          <div key={i} className="mb-4 rounded-md border border-gray-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <DetailRow label="Check-out" value={formatDate(h.checkoutDate)} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Package Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-500">
              Included
            </p>
            {renderRichText(d.packageIncluded)}
          </div>
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-500">
              Excluded
            </p>
            {renderRichText(d.packageExcluded)}
          </div>
        </div>
      </Section>

      <Section title="Tour Itinerary">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Subject</th>
              <th className="py-2 font-medium">Itinerary</th>
            </tr>
          </thead>
          <tbody>
            {d.itineraries.map((it, i) => (
              <tr key={i} className="border-b border-gray-100 align-top">
                <td className="py-2 pr-4 whitespace-nowrap text-gray-900">
                  {formatDate(it.date)}
                </td>
                <td className="py-2 pr-4 font-medium text-gray-900">
                  {it.subject}
                </td>
                <td className="py-2 whitespace-pre-line text-gray-900">
                  {it.itinerary}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="General Details">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        </div>
      </Section>

      <Section title="Official Details">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailRow label="Payment Type" value={d.paymentType} />
          <DetailRow label="Total Amount" value={d.totalAmount} />
          <DetailRow label="Amount Received" value={d.amountReceived} />
          <DetailRow label="Amount Balanced" value={d.amountBalanced} />
        </div>
      </Section>

      <div className="border-t border-gray-200 pt-4 text-center text-xs text-gray-500">
        This is a system-generated confirmation voucher. Please verify all
        details before travel.
      </div>
    </div>
  );
}
