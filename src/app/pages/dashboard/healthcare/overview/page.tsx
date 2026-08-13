"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  CalendarPlus,
  ClipboardList,
  DollarSign,
  ListOrdered,
  Receipt,
  Stethoscope,
  Users,
} from "lucide-react";
import {
  HEALTHCARE_QUICK_LINKS,
  HealthcareStatCard,
  appointmentPill,
  priorityPill,
  queuePill,
} from "@/components/healthcare/healthcare-ui";
import { useHealthcareStore } from "@/stores/healthcareStore";
import { useClientReady } from "@/hooks/useClientReady";
import { cn } from "@/lib/utils";

const QUICK_LINKS = HEALTHCARE_QUICK_LINKS.filter(
  (l) => l.label !== "Overview"
);

export default function HealthcareOverviewPage() {
  const router = useRouter();
  const patients = useHealthcareStore((s) => s.patients);
  const appointments = useHealthcareStore((s) => s.appointments);
  const queue = useHealthcareStore((s) => s.queue);
  const consultations = useHealthcareStore((s) => s.consultations);
  const billing = useHealthcareStore((s) => s.billing);
  const staff = useHealthcareStore((s) => s.staff);

  const today = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const todaysAppointments = appointments.filter((a) => a.date === today);
    const inQueue = queue.filter((q) => q.status === "Waiting" || q.status === "In Consultation");
    const todaysConsultations = consultations.filter((c) => c.date === today);
    const pendingBills = billing.filter(
      (b) => b.status === "Pending" || b.status === "Overdue"
    );
    const doctorsOnDuty = staff.filter(
      (s) => s.role === "Doctor" && s.status === "On Duty"
    );
    return {
      patients: patients.length,
      todaysAppointments: todaysAppointments.length,
      inQueue: inQueue.length,
      todaysConsultations: todaysConsultations.length,
      pendingBills: pendingBills.length,
      doctorsOnDuty: doctorsOnDuty.length,
      admitted: patients.filter((p) => p.status === "Admitted").length,
      pendingAmount: pendingBills.reduce((s, b) => s + b.amount, 0),
    };
  }, [patients, appointments, queue, consultations, billing, staff, today]);

  const liveQueue = useMemo(
    () =>
      [...queue]
        .filter((q) => q.status !== "Completed")
        .sort((a, b) => {
          const priority: Record<string, number> = {
            Critical: 0,
            Urgent: 1,
            Normal: 2,
          };
          if (priority[a.priority] !== priority[b.priority]) {
            return priority[a.priority] - priority[b.priority];
          }
          return b.waitMinutes - a.waitMinutes;
        })
        .slice(0, 5),
    [queue]
  );

  const todaysAppts = useMemo(
    () =>
      appointments
        .filter((a) => a.date === today)
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(0, 5),
    [appointments, today]
  );

  const recentConsultations = useMemo(
    () =>
      [...consultations]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 4),
    [consultations]
  );

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Healthcare Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Today&apos;s patient flow, doctors on duty and pending work.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/healthcare/appointments")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Calendar className="size-4" /> Appointments
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/healthcare/appointments")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <CalendarPlus className="size-4" /> New Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <HealthcareStatCard
          label="Total Patients"
          value={stats.patients}
          icon={<Users className="size-4" />}
        />
        <HealthcareStatCard
          label="Today's Appointments"
          value={stats.todaysAppointments}
          icon={<Calendar className="size-4" />}
          tone="violet"
        />
        <HealthcareStatCard
          label="In Queue"
          value={stats.inQueue}
          icon={<ListOrdered className="size-4" />}
          tone="amber"
        />
        <HealthcareStatCard
          label="Doctors on Duty"
          value={stats.doctorsOnDuty}
          icon={<Stethoscope className="size-4" />}
          tone="sky"
        />
        <HealthcareStatCard
          label="Pending Bills"
          value={stats.pendingBills}
          icon={<Receipt className="size-4" />}
          tone="rose"
        />
        <HealthcareStatCard
          label="Today's Consultations"
          value={stats.todaysConsultations}
          icon={<ClipboardList className="size-4" />}
          tone="teal"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Live Queue</p>
              <p className="text-xs text-gray-500">
                Patients waiting or in consultation
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/healthcare/queue")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Open queue <ArrowRight className="size-3.5" />
            </button>
          </div>

          {liveQueue.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <ListOrdered className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No patients in queue.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {liveQueue.map((q) => (
                <div
                  key={q.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-gray-100 text-xs font-bold text-gray-700">
                      {q.token}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {q.patientName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {q.department} · {q.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {priorityPill(q.priority)}
                    {queuePill(q.status)}
                    <span className="w-12 text-right text-xs font-medium text-gray-500">
                      {q.waitMinutes}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Today&apos;s Appointments
              </p>
              <p className="text-xs text-gray-500">
                Scheduled consultations across departments
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/healthcare/appointments")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              View all <ArrowRight className="size-3.5" />
            </button>
          </div>

          {todaysAppts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Calendar className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No appointments today.</p>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-gray-100">
              {todaysAppts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-xs font-bold text-violet-700">
                      {a.time}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {a.patientName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {a.specialty} · {a.doctor}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {appointmentPill(a.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Recent Consultations
              </p>
              <p className="text-xs text-gray-500">
                Latest diagnoses and vitals recorded
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/healthcare/consultations")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              Open <ArrowRight className="size-3.5" />
            </button>
          </div>
          {recentConsultations.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Stethoscope className="size-8 text-gray-300" />
              <p className="text-sm text-gray-500">No consultations yet.</p>
            </div>
          ) : (
            <div className="mt-3 flex flex-col gap-3">
              {recentConsultations.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {c.patientName}
                    </p>
                    <span className="text-[11px] font-medium text-gray-500">
                      {c.date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {c.doctor} · {c.vitals}
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-700">
                    {c.diagnosis}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Pending Bills</p>
              <p className="text-xs text-gray-500">
                Outstanding invoices to collect
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/dashboard/healthcare/billing")}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:underline"
            >
              View <ArrowRight className="size-3.5" />
            </button>
          </div>
          {(() => {
            const pending = billing
              .filter((b) => b.status === "Pending" || b.status === "Overdue")
              .slice(0, 4);
            if (pending.length === 0) {
              return (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                  <DollarSign className="size-8 text-gray-300" />
                  <p className="text-sm text-gray-500">All bills are settled.</p>
                </div>
              );
            }
            return (
              <div className="mt-3 divide-y divide-gray-100">
                {pending.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {b.invoiceNo}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {b.patientName}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-semibold text-gray-800",
                          b.status === "Overdue" && "text-rose-600"
                        )}
                      >
                        ₹{b.amount.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          b.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        )}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Healthcare Modules
            </p>
            <p className="text-xs text-gray-500">
              Jump into any sub-section of the healthcare workspace
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK_LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <button
                key={l.label}
                type="button"
                onClick={() => router.push(l.href)}
                className="group flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-3 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl",
                      l.tone
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="truncate text-sm font-semibold text-gray-800">
                    {l.label}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-gray-400 group-hover:text-emerald-600" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
