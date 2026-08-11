"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, isAfter, parseISO, addDays } from "date-fns";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CirclePlusIcon,
  FileText,
  MessageSquareText,
  Plane,
  Route,
  Ship,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/stores/bookingStore";
import { useEnquiryStore } from "@/stores/enquiryStore";
import { useItineraryStore } from "@/stores/itineraryStore";
import { useTravelDocumentStore } from "@/stores/travelDocumentStore";
import { StatusBadge } from "@/components/travel/status-badge";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: "default" | "amber" | "red" | "sky";
}) {
  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div
          className={cn(
            "grid size-8 place-items-center rounded-full",
            tone === "amber" && "bg-amber-50 text-amber-600",
            tone === "red" && "bg-red-50 text-red-600",
            tone === "sky" && "bg-sky-50 text-sky-600",
            tone === "default" && "bg-emerald-50 text-emerald-600"
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function TravelDashboardPage() {
  const router = useRouter();

  const enquiries = useEnquiryStore((s) => s.enquiries);
  const bookings = useBookingStore((s) => s.bookings);
  const itineraries = useItineraryStore((s) => s.itineraries);
  const documents = useTravelDocumentStore((s) => s.documents);

  const openEnquiries = useMemo(
    () => enquiries.filter((e) => e.status !== "Lost"),
    [enquiries]
  );
  const upcomingItineraries = useMemo(
    () =>
      itineraries.filter(
        (i) => i.status !== "Cancelled" && isAfter(parseISO(i.startDate), new Date())
      ),
    [itineraries]
  );
  const expiringDocuments = useMemo(
    () =>
      documents.filter(
        (d) =>
          d.expiresOn &&
          isAfter(parseISO(d.expiresOn), new Date()) &&
          isAfter(addDays(new Date(), 30), parseISO(d.expiresOn))
      ),
    [documents]
  );
  const confirmedBookings = useMemo(
    () => bookings.filter((b) => b.status === "Confirmed"),
    [bookings]
  );

  const recentEnquiries = openEnquiries.slice(0, 5);
  const recentBookings = bookings.slice(0, 5);

  const quickActions = [
    {
      label: "New Enquiry",
      description: "Log a travel request",
      icon: MessageSquareText,
      onClick: () => router.push("/dashboard/travel/enquiries"),
    },
    {
      label: "New Booking",
      description: "Book hotels, flights & more",
      icon: Ticket,
      onClick: () => router.push("/dashboard/travel/bookings"),
    },
    {
      label: "New Itinerary",
      description: "Plan a day-by-day trip",
      icon: Route,
      onClick: () => router.push("/dashboard/travel/itineraries"),
    },
    {
      label: "Add Supplier",
      description: "Hotels, airlines & more",
      icon: Building2,
      onClick: () => router.push("/dashboard/travel/suppliers/hotels"),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between p-1.5">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Travel</h1>
          <p className="text-sm text-gray-500">
            A snapshot of enquiries, bookings, itineraries and documents.
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/travel/enquiries")}>
          <CirclePlusIcon /> New Enquiry
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <StatCard
          label="Open enquiries"
          value={openEnquiries.length}
          icon={<MessageSquareText className="size-4" />}
          tone="sky"
        />
        <StatCard
          label="Confirmed bookings"
          value={confirmedBookings.length}
          icon={<Ticket className="size-4" />}
        />
        <StatCard
          label="Upcoming itineraries"
          value={upcomingItineraries.length}
          icon={<CalendarDays className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Documents expiring"
          value={expiringDocuments.length}
          icon={<FileText className="size-4" />}
          tone="red"
        />
      </div>

      {expiringDocuments.length > 0 && (
        <button
          type="button"
          onClick={() => router.push("/dashboard/travel/documents")}
          className="flex items-center justify-between gap-3 rounded-[20px] border border-amber-100 bg-amber-50/70 px-4 py-3 text-left text-sm text-amber-800 transition-colors hover:bg-amber-50"
        >
          <span className="flex items-center gap-2">
            <FileText className="size-4" />
            {expiringDocuments.length} travel document
            {expiringDocuments.length === 1 ? " is" : "s are"} expiring within 30
            days.
          </span>
          <ArrowRight className="size-4" />
        </button>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Recent enquiries
            </p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/travel/enquiries")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </button>
          </div>
          {recentEnquiries.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <MessageSquareText className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No enquiries yet.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {recentEnquiries.map((enquiry) => (
                <button
                  key={enquiry.id}
                  type="button"
                  onClick={() => router.push("/dashboard/travel/enquiries")}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {enquiry.customerName} · {enquiry.destination}
                    </p>
                    <p className="text-xs text-gray-400">
                      {enquiry.serviceType} ·{" "}
                      {format(parseISO(enquiry.startDate), "dd MMM")}
                    </p>
                  </div>
                  <StatusBadge status={enquiry.status} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">Recent bookings</p>
            <button
              type="button"
              onClick={() => router.push("/dashboard/travel/bookings")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Ticket className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No bookings yet.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {recentBookings.map((booking) => (
                <button
                  key={booking.id}
                  type="button"
                  onClick={() => router.push("/dashboard/travel/bookings")}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {booking.reference} · {booking.supplierName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {booking.customerName} · {booking.service}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="group flex cursor-pointer flex-col items-start gap-3 rounded-[20px] border border-gray-100 bg-white p-4 text-left shadow-sm transition-colors hover:border-sky-200 hover:bg-sky-50/40"
          >
            <action.icon className="size-5 text-sky-600" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {action.label}
              </p>
              <p className="text-xs text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 p-1.5 lg:grid-cols-4">
        <div className="flex items-center gap-3 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <Plane className="size-5 text-sky-600" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Itineraries</p>
            <p className="text-xs text-gray-500">{itineraries.length} planned</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
          <Ship className="size-5 text-sky-600" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Bookings</p>
            <p className="text-xs text-gray-500">{bookings.length} total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
