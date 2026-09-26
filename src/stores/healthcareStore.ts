"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export type Gender = "Male" | "Female" | "Other";

export type Patient = {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  phone: string;
  bloodGroup: string;
  condition: string;
  status: "Admitted" | "In Treatment" | "Outpatient" | "Recovered";
  lastVisit: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
};

export type QueueEntry = {
  id: string;
  token: string;
  patientName: string;
  doctor: string;
  department: string;
  priority: "Normal" | "Urgent" | "Critical";
  status: "Waiting" | "In Consultation" | "Completed";
  waitMinutes: number;
  arrivedAt: string;
};

export type Consultation = {
  id: string;
  patientName: string;
  doctor: string;
  date: string;
  diagnosis: string;
  vitals: string;
};

export type Prescription = {
  id: string;
  patientName: string;
  doctor: string;
  date: string;
  medicines: string;
};

export type BillingRecord = {
  id: string;
  invoiceNo: string;
  patientName: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  date: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string;
  status: "On Duty" | "Off Duty" | "On Leave";
};

const newId = (prefix: string) =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const today = new Date().toISOString().slice(0, 10);
const isoOffset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

const seedPatients: Patient[] = [
  { id: newId("pat"), name: "Aarav Mehta", gender: "Male", age: 34, phone: "+91 98200 11122", bloodGroup: "O+", condition: "Hypertension", status: "Admitted", lastVisit: isoOffset(-2) },
  { id: newId("pat"), name: "Priya Iyer", gender: "Female", age: 29, phone: "+91 98301 22233", bloodGroup: "A+", condition: "Migraine", status: "Outpatient", lastVisit: isoOffset(-7) },
  { id: newId("pat"), name: "Rohit Sharma", gender: "Male", age: 54, phone: "+91 98402 33344", bloodGroup: "B+", condition: "Type 2 Diabetes", status: "In Treatment", lastVisit: isoOffset(-1) },
  { id: newId("pat"), name: "Sneha Kapoor", gender: "Female", age: 41, phone: "+91 98503 44455", bloodGroup: "AB+", condition: "Post-Surgery Recovery", status: "Admitted", lastVisit: today },
  { id: newId("pat"), name: "Karan Verma", gender: "Male", age: 22, phone: "+91 98604 55566", bloodGroup: "O-", condition: "Sports Injury", status: "Outpatient", lastVisit: isoOffset(-3) },
  { id: newId("pat"), name: "Anita Desai", gender: "Female", age: 67, phone: "+91 98705 66677", bloodGroup: "A-", condition: "Arthritis", status: "Recovered", lastVisit: isoOffset(-14) },
  { id: newId("pat"), name: "Vikram Singh", gender: "Male", age: 38, phone: "+91 98806 77788", bloodGroup: "B-", condition: "Cardiology Check-up", status: "Outpatient", lastVisit: today },
  { id: newId("pat"), name: "Meera Nair", gender: "Female", age: 31, phone: "+91 98907 88899", bloodGroup: "O+", condition: "Routine Checkup", status: "Recovered", lastVisit: isoOffset(-21) },
];

const seedAppointments: Appointment[] = [
  { id: newId("apt"), patientId: "p1", patientName: "Aarav Mehta", doctor: "Dr. Sameer Roy", specialty: "Cardiology", date: today, time: "09:30", status: "Completed" },
  { id: newId("apt"), patientId: "p4", patientName: "Sneha Kapoor", doctor: "Dr. Anjali Bose", specialty: "General Surgery", date: today, time: "10:15", status: "In Progress" },
  { id: newId("apt"), patientId: "p3", patientName: "Rohit Sharma", doctor: "Dr. Vivek Khanna", specialty: "Endocrinology", date: today, time: "11:00", status: "Scheduled" },
  { id: newId("apt"), patientId: "p7", patientName: "Vikram Singh", doctor: "Dr. Sameer Roy", specialty: "Cardiology", date: today, time: "11:45", status: "Scheduled" },
  { id: newId("apt"), patientId: "p2", patientName: "Priya Iyer", doctor: "Dr. Neha Pillai", specialty: "Neurology", date: today, time: "14:00", status: "Scheduled" },
  { id: newId("apt"), patientId: "p5", patientName: "Karan Verma", doctor: "Dr. Arjun Kapoor", specialty: "Orthopedics", date: today, time: "15:30", status: "Scheduled" },
  { id: newId("apt"), patientId: "p8", patientName: "Meera Nair", doctor: "Dr. Anjali Bose", specialty: "General Medicine", date: isoOffset(1), time: "10:00", status: "Scheduled" },
];

const seedQueue: QueueEntry[] = [
  { id: newId("q"), token: "A-014", patientName: "Sneha Kapoor", doctor: "Dr. Anjali Bose", department: "Surgery", priority: "Critical", status: "In Consultation", waitMinutes: 5, arrivedAt: "10:10" },
  { id: newId("q"), token: "A-015", patientName: "Rohit Sharma", doctor: "Dr. Vivek Khanna", department: "Endocrinology", priority: "Urgent", status: "Waiting", waitMinutes: 14, arrivedAt: "10:31" },
  { id: newId("q"), token: "A-016", patientName: "Vikram Singh", doctor: "Dr. Sameer Roy", department: "Cardiology", priority: "Normal", status: "Waiting", waitMinutes: 22, arrivedAt: "10:39" },
  { id: newId("q"), token: "A-017", patientName: "Priya Iyer", doctor: "Dr. Neha Pillai", department: "Neurology", priority: "Normal", status: "Waiting", waitMinutes: 31, arrivedAt: "10:48" },
  { id: newId("q"), token: "A-018", patientName: "Karan Verma", doctor: "Dr. Arjun Kapoor", department: "Orthopedics", priority: "Urgent", status: "Waiting", waitMinutes: 45, arrivedAt: "11:02" },
];

const seedConsultations: Consultation[] = [
  { id: newId("cns"), patientName: "Aarav Mehta", doctor: "Dr. Sameer Roy", date: today, diagnosis: "Stage 1 Hypertension", vitals: "BP 142/92 · HR 78" },
  { id: newId("cns"), patientName: "Rohit Sharma", doctor: "Dr. Vivek Khanna", date: isoOffset(-1), diagnosis: "Type 2 Diabetes — HbA1c 7.4", vitals: "FBS 156 · PPBS 210" },
  { id: newId("cns"), patientName: "Karan Verma", doctor: "Dr. Arjun Kapoor", date: isoOffset(-3), diagnosis: "Mild ACL Sprain", vitals: "HR 82 · BP 120/80" },
  { id: newId("cns"), patientName: "Meera Nair", doctor: "Dr. Anjali Bose", date: isoOffset(-21), diagnosis: "Routine — Stable", vitals: "BP 118/76 · HR 70" },
];

const seedPrescriptions: Prescription[] = [
  { id: newId("rx"), patientName: "Aarav Mehta", doctor: "Dr. Sameer Roy", date: today, medicines: "Amlodipine 5mg · Atorvastatin 10mg" },
  { id: newId("rx"), patientName: "Rohit Sharma", doctor: "Dr. Vivek Khanna", date: isoOffset(-1), medicines: "Metformin 500mg · Glimepiride 2mg" },
  { id: newId("rx"), patientName: "Karan Verma", doctor: "Dr. Arjun Kapoor", date: isoOffset(-3), medicines: "Ibuprofen 400mg · Theraflex Cream" },
];

const seedBilling: BillingRecord[] = [
  { id: newId("bill"), invoiceNo: "HINV-2001", patientName: "Aarav Mehta", amount: 8400, status: "Paid", date: today },
  { id: newId("bill"), invoiceNo: "HINV-2002", patientName: "Sneha Kapoor", amount: 24600, status: "Pending", date: today },
  { id: newId("bill"), invoiceNo: "HINV-2003", patientName: "Karan Verma", amount: 1650, status: "Overdue", date: isoOffset(-9) },
  { id: newId("bill"), invoiceNo: "HINV-2004", patientName: "Rohit Sharma", amount: 3200, status: "Pending", date: isoOffset(-1) },
];

const seedStaff: StaffMember[] = [
  { id: newId("stf"), name: "Dr. Sameer Roy", role: "Doctor", department: "Cardiology", status: "On Duty" },
  { id: newId("stf"), name: "Dr. Anjali Bose", role: "Doctor", department: "General Surgery", status: "On Duty" },
  { id: newId("stf"), name: "Dr. Vivek Khanna", role: "Doctor", department: "Endocrinology", status: "On Duty" },
  { id: newId("stf"), name: "Dr. Neha Pillai", role: "Doctor", department: "Neurology", status: "On Duty" },
  { id: newId("stf"), name: "Dr. Arjun Kapoor", role: "Doctor", department: "Orthopedics", status: "On Leave" },
  { id: newId("stf"), name: "Nurse Priya Menon", role: "Nurse", department: "Wards", status: "On Duty" },
  { id: newId("stf"), name: "Nurse Aditya Rao", role: "Nurse", department: "ICU", status: "On Duty" },
];

type HealthcareState = {
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueEntry[];
  consultations: Consultation[];
  prescriptions: Prescription[];
  billing: BillingRecord[];
  staff: StaffMember[];

  addPatient: (p: Omit<Patient, "id">) => void;
  updatePatient: (id: string, p: Omit<Patient, "id">) => void;
  deletePatient: (id: string) => void;

  addAppointment: (a: Omit<Appointment, "id">) => void;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => void;
  deleteAppointment: (id: string) => void;

  advanceQueue: (id: string) => void;
  completeQueueEntry: (id: string) => void;
  addQueueEntry: (q: Omit<QueueEntry, "id">) => void;

  addConsultation: (c: Omit<Consultation, "id">) => void;
  deleteConsultation: (id: string) => void;

  addPrescription: (p: Omit<Prescription, "id">) => void;
  deletePrescription: (id: string) => void;

  addBilling: (b: Omit<BillingRecord, "id">) => void;
  markBillingPaid: (id: string) => void;
  deleteBilling: (id: string) => void;

  addStaff: (s: Omit<StaffMember, "id">) => void;
  updateStaff: (id: string, s: Omit<StaffMember, "id">) => void;
  deleteStaff: (id: string) => void;

  resetAll: () => void;
};

const updateIn = <T extends { id: string }>(
  list: T[],
  id: string,
  patch: Partial<Omit<T, "id">>
): T[] => list.map((item) => (item.id === id ? { ...item, ...patch } : item));

const deleteFrom = <T extends { id: string }>(list: T[], id: string): T[] =>
  list.filter((item) => item.id !== id);

export const useHealthcareStore = create<HealthcareState>()(
  persist(
    (set) => ({
      patients: seedPatients,
      appointments: seedAppointments,
      queue: seedQueue,
      consultations: seedConsultations,
      prescriptions: seedPrescriptions,
      billing: seedBilling,
      staff: seedStaff,

      addPatient: (p) =>
        set((s) => ({ patients: [{ id: newId("pat"), ...p }, ...s.patients] })),
      updatePatient: (id, p) =>
        set((s) => ({ patients: updateIn(s.patients, id, p) })),
      deletePatient: (id) =>
        set((s) => ({ patients: deleteFrom(s.patients, id) })),

      addAppointment: (a) =>
        set((s) => ({ appointments: [{ id: newId("apt"), ...a }, ...s.appointments] })),
      updateAppointmentStatus: (id, status) =>
        set((s) => ({ appointments: updateIn(s.appointments, id, { status }) })),
      deleteAppointment: (id) =>
        set((s) => ({ appointments: deleteFrom(s.appointments, id) })),

      addQueueEntry: (q) =>
        set((s) => ({ queue: [{ id: newId("q"), ...q }, ...s.queue] })),
      advanceQueue: (id) =>
        set((s) => ({
          queue: updateIn(s.queue, id, { status: "In Consultation" }),
        })),
      completeQueueEntry: (id) =>
        set((s) => ({
          queue: updateIn(s.queue, id, { status: "Completed" }),
        })),

      addConsultation: (c) =>
        set((s) => ({ consultations: [{ id: newId("cns"), ...c }, ...s.consultations] })),
      deleteConsultation: (id) =>
        set((s) => ({ consultations: deleteFrom(s.consultations, id) })),

      addPrescription: (p) =>
        set((s) => ({ prescriptions: [{ id: newId("rx"), ...p }, ...s.prescriptions] })),
      deletePrescription: (id) =>
        set((s) => ({ prescriptions: deleteFrom(s.prescriptions, id) })),

      addBilling: (b) =>
        set((s) => ({ billing: [{ id: newId("bill"), ...b }, ...s.billing] })),
      markBillingPaid: (id) =>
        set((s) => ({ billing: updateIn(s.billing, id, { status: "Paid" }) })),
      deleteBilling: (id) =>
        set((s) => ({ billing: deleteFrom(s.billing, id) })),

      addStaff: (member) =>
        set((state) => ({ staff: [{ id: newId("stf"), ...member }, ...state.staff] })),
      updateStaff: (id, st) =>
        set((s) => ({ staff: updateIn(s.staff, id, st) })),
      deleteStaff: (id) =>
        set((s) => ({ staff: deleteFrom(s.staff, id) })),

      resetAll: () =>
        set({
          patients: seedPatients,
          appointments: seedAppointments,
          queue: seedQueue,
          consultations: seedConsultations,
          prescriptions: seedPrescriptions,
          billing: seedBilling,
          staff: seedStaff,
        }),
    }),
    {
      name: "xmerge_healthcare",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useHealthcareStore.persist.rehydrate();
});
