"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export const CURRENT_MEMBER_ID = "mem_khan";

export const TEAM_STATUSES = ["Active", "Remote", "On Leave", "Inactive"] as const;
export const TASK_STATUSES = ["To Do", "In Progress", "In Review", "Done"] as const;
export const TASK_PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;
export const PROJECT_STATUSES = ["Planning", "Active", "On Hold", "Completed"] as const;
export const MEETING_STATUSES = ["Scheduled", "Ongoing", "Completed", "Cancelled"] as const;
export const ATTENDANCE_STATUSES = ["Present", "Absent", "Late", "Half Day", "WFA", "On Leave"] as const;
export const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Maternity", "Paternity", "Unpaid"] as const;
export const LEAVE_STATUSES = ["Pending", "Approved", "Rejected"] as const;
export const GOAL_STATUSES = ["Not Started", "On Track", "At Risk", "Achieved"] as const;
export const REVIEW_STATUSES = ["Draft", "In Progress", "Submitted", "Completed"] as const;
export const RECOGNITION_TYPES = ["Kudos", "Spot Bonus", "Employee of the Month", "Milestone", "Team Award"] as const;
export const DOCUMENT_CATEGORIES = ["Team", "Policy", "Employee"] as const;
export const ANNOUNCEMENT_CHANNELS = ["All Company", "Team", "Meetings"] as const;
export const ANNOUNCEMENT_PRIORITIES = ["Normal", "Important", "Urgent"] as const;

export type Department = {
  id: string;
  name: string;
  code: string;
  managerId: string;
  description: string;
};

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  departmentId: string;
  roleId: string;
  title: string;
  managerId: string;
  location: string;
  joinedAt: string;
  status: (typeof TEAM_STATUSES)[number];
  notes: string;
};

export type TeamRole = {
  id: string;
  name: string;
  level: string;
  description: string;
  permissions: string;
};

export type TeamChat = {
  id: string;
  type: "direct" | "group" | "channel";
  name: string;
  participants: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
  muted: string;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  senderId: string;
  body: string;
  timestamp: string;
};

export type MeetingRoom = {
  id: string;
  name: string;
  location: string;
  capacity: string;
  amenities: string;
  isAvailable: string;
};

export type TeamMeeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  organizerId: string;
  attendees: string;
  roomId: string;
  roomName: string;
  status: (typeof MEETING_STATUSES)[number];
  agenda: string;
  notes: string;
};

export type TeamProject = {
  id: string;
  name: string;
  code: string;
  leadId: string;
  description: string;
  status: (typeof PROJECT_STATUSES)[number];
  progress: string;
  startDate: string;
  endDate: string;
  color: string;
};

export type TeamTask = {
  id: string;
  title: string;
  assigneeId: string;
  projectId: string;
  status: (typeof TASK_STATUSES)[number];
  priority: (typeof TASK_PRIORITIES)[number];
  dueDate: string;
  notes: string;
};

export type TeamApproval = {
  id: string;
  type: string;
  subject: string;
  submittedBy: string;
  reviewer: string;
  status: "Pending" | "Approved" | "Rejected";
  amount: string;
  requestedAt: string;
  decidedAt: string;
  comment: string;
};

export type OnboardingPlan = {
  id: string;
  title: string;
  ownerId: string;
  defaultDays: string;
  description: string;
};

export type OnboardingChecklist = {
  id: string;
  title: string;
  planId: string;
  items: string;
};

export type NewJoiner = {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  startDate: string;
  planId: string;
  stage: string;
  status: "On Track" | "At Risk" | "Completed";
  buddyId: string;
  tasksDone: string;
  tasksTotal: string;
  notes: string;
};

export type AttendanceRecord = {
  id: string;
  memberId: string;
  date: string;
  status: (typeof ATTENDANCE_STATUSES)[number];
  checkIn: string;
  checkOut: string;
  hours: string;
  notes: string;
};

export type LeaveRequest = {
  id: string;
  memberId: string;
  type: (typeof LEAVE_TYPES)[number];
  from: string;
  to: string;
  days: string;
  reason: string;
  status: (typeof LEAVE_STATUSES)[number];
  approvedBy: string;
};

export type WorkHoursEntry = {
  id: string;
  memberId: string;
  week: string;
  planned: string;
  actual: string;
  overtime: string;
};

export type TeamGoal = {
  id: string;
  title: string;
  ownerId: string;
  period: string;
  category: string;
  progress: string;
  status: (typeof GOAL_STATUSES)[number];
};

export type PerformanceReview = {
  id: string;
  title: string;
  memberId: string;
  reviewerId: string;
  period: string;
  dueDate: string;
  status: (typeof REVIEW_STATUSES)[number];
  score: string;
  comments: string;
};

export type Recognition = {
  id: string;
  from: string;
  to: string;
  type: string;
  message: string;
  date: string;
};

export type TeamDocument = {
  id: string;
  name: string;
  category: (typeof DOCUMENT_CATEGORIES)[number];
  ownerId: string;
  size: string;
  type: string;
  uploadedAt: string;
  version: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  channel: (typeof ANNOUNCEMENT_CHANNELS)[number];
  priority: (typeof ANNOUNCEMENT_PRIORITIES)[number];
  publishedAt: string;
  pinned: string;
};

const newId = (prefix: string) =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().slice(0, 10);
};

const daysAgo = (d: number) => daysFromNow(-d);

const timeAgo = (h: number) => new Date(Date.now() - h * 36e5).toISOString();

const SEED_DEPARTMENTS: Department[] = [
  { id: "dep_eng", name: "Engineering", code: "ENG", managerId: "mem_khan", description: "Product engineering, platform and infrastructure." },
  { id: "dep_design", name: "Design", code: "DES", managerId: "mem_cooper", description: "Product, brand and experience design." },
  { id: "dep_sales", name: "Sales", code: "SAL", managerId: "mem_owens", description: "Revenue, account management and partnerships." },
  { id: "dep_mkt", name: "Marketing", code: "MKT", managerId: "mem_hassan", description: "Growth, content and brand marketing." },
  { id: "dep_ops", name: "Operations", code: "OPS", managerId: "mem_nguyen", description: "Logistics, delivery and vendor operations." },
  { id: "dep_fin", name: "Finance", code: "FIN", managerId: "mem_tanaka", description: "Accounting, treasury and planning." },
  { id: "dep_hr", name: "Human Resources", code: "HR", managerId: "mem_sharma", description: "People, talent and culture." },
  { id: "dep_support", name: "Support", code: "SUP", managerId: "mem_martin", description: "Customer success and support." },
];

const SEED_ROLES: TeamRole[] = [
  { id: "rol_admin", name: "Administrator", level: "L4", description: "Full access to all modules and settings.", permissions: "Manage everything, configure settings, manage members" },
  { id: "rol_manager", name: "Manager", level: "L3", description: "Manage team, approvals and reports.", permissions: "Team management, approve requests, view reports" },
  { id: "rol_lead", name: "Team Lead", level: "L2", description: "Lead a squad and review work.", permissions: "Assign tasks, review work, view team" },
  { id: "rol_member", name: "Member", level: "L1", description: "Standard team member access.", permissions: "My tasks, chat, meetings, documents" },
  { id: "rol_intern", name: "Intern", level: "L0", description: "Limited access for trainees.", permissions: "My tasks, view-only documents" },
  { id: "rol_finance", name: "Finance Access", level: "L3", description: "Finance data and approvals.", permissions: "View finance, approve expenses" },
];

const SEED_MEMBERS: TeamMember[] = [
  { id: "mem_khan", name: "Daniel Kim", email: "daniel.kim@xmerge.app", phone: "+1 555 0101", departmentId: "dep_eng", roleId: "rol_admin", title: "Engineering Manager", managerId: "", location: "San Francisco", joinedAt: daysAgo(900), status: "Active", notes: "Oversees engineering squads." },
  { id: "mem_reyes", name: "Alicia Reyes", email: "alicia.reyes@xmerge.app", phone: "+1 555 0102", departmentId: "dep_eng", roleId: "rol_lead", title: "Senior Engineer", managerId: "mem_khan", location: "San Francisco", joinedAt: daysAgo(640), status: "Active", notes: "Backend platform lead." },
  { id: "mem_chen", name: "Marcus Chen", email: "marcus.chen@xmerge.app", phone: "+1 555 0103", departmentId: "dep_eng", roleId: "rol_member", title: "Frontend Engineer", managerId: "mem_reyes", location: "Remote", joinedAt: daysAgo(410), status: "Remote", notes: "Builds the POS terminal." },
  { id: "mem_cooper", name: "Jane Cooper", email: "jane.cooper@xmerge.app", phone: "+1 555 0104", departmentId: "dep_design", roleId: "rol_lead", title: "Product Designer", managerId: "mem_khan", location: "New York", joinedAt: daysAgo(520), status: "Active", notes: "Design system owner." },
  { id: "mem_nguyen", name: "Theo Nguyen", email: "theo.nguyen@xmerge.app", phone: "+1 555 0105", departmentId: "dep_ops", roleId: "rol_manager", title: "Operations Lead", managerId: "", location: "Hanoi", joinedAt: daysAgo(730), status: "Active", notes: "Owns delivery network." },
  { id: "mem_rossi", name: "Elena Rossi", email: "elena.rossi@xmerge.app", phone: "+1 555 0106", departmentId: "dep_sales", roleId: "rol_member", title: "Account Executive", managerId: "mem_owens", location: "Rome", joinedAt: daysAgo(300), status: "Active", notes: "Enterprise accounts." },
  { id: "mem_tanaka", name: "Mei Tanaka", email: "mei.tanaka@xmerge.app", phone: "+1 555 0107", departmentId: "dep_fin", roleId: "rol_finance", title: "Financial Analyst", managerId: "", location: "Tokyo", joinedAt: daysAgo(380), status: "Active", notes: "P&L and forecasting." },
  { id: "mem_hassan", name: "Omar Hassan", email: "omar.hassan@xmerge.app", phone: "+1 555 0108", departmentId: "dep_mkt", roleId: "rol_lead", title: "Growth Lead", managerId: "", location: "Cairo", joinedAt: daysAgo(460), status: "Active", notes: "Runs growth experiments." },
  { id: "mem_sharma", name: "Priya Sharma", email: "priya.sharma@xmerge.app", phone: "+1 555 0109", departmentId: "dep_hr", roleId: "rol_manager", title: "People Partner", managerId: "", location: "Mumbai", joinedAt: daysAgo(260), status: "On Leave", notes: "Onboarding owner." },
  { id: "mem_owens", name: "Sofia Owens", email: "sofia.owens@xmerge.app", phone: "+1 555 0110", departmentId: "dep_sales", roleId: "rol_manager", title: "Sales Manager", managerId: "", location: "Chicago", joinedAt: daysAgo(580), status: "Active", notes: "Leads the sales org." },
  { id: "mem_martin", name: "Liam Martin", email: "liam.martin@xmerge.app", phone: "+1 555 0111", departmentId: "dep_support", roleId: "rol_lead", title: "Support Lead", managerId: "mem_khan", location: "London", joinedAt: daysAgo(340), status: "Active", notes: "Keeps NPS high." },
  { id: "mem_singh", name: "Aisha Singh", email: "aisha.singh@xmerge.app", phone: "+1 555 0112", departmentId: "dep_mkt", roleId: "rol_member", title: "Content Designer", managerId: "mem_hassan", location: "Remote", joinedAt: daysAgo(120), status: "Remote", notes: "Content and docs." },
];

const SEED_CHATS: TeamChat[] = [
  { id: "chat_d_reyes", type: "direct", name: "Alicia Reyes", participants: "mem_khan,mem_reyes", lastMessage: "Sounds good — shipping that today.", lastMessageAt: timeAgo(2), unread: 1, muted: "No" },
  { id: "chat_d_cooper", type: "direct", name: "Jane Cooper", participants: "mem_khan,mem_cooper", lastMessage: "Updated the design tokens file.", lastMessageAt: timeAgo(5), unread: 0, muted: "No" },
  { id: "chat_d_nguyen", type: "direct", name: "Theo Nguyen", participants: "mem_khan,mem_nguyen", lastMessage: "Delivery partners confirmed for Q3.", lastMessageAt: timeAgo(26), unread: 0, muted: "No" },
  { id: "chat_d_owens", type: "direct", name: "Sofia Owens", participants: "mem_khan,mem_owens", lastMessage: "Can we sync before the review?", lastMessageAt: timeAgo(50), unread: 2, muted: "No" },
  { id: "chat_g_eng", type: "group", name: "Engineering", participants: "mem_khan,mem_reyes,mem_chen", lastMessage: "Deploy is green. Nice work team!", lastMessageAt: timeAgo(8), unread: 3, muted: "No" },
  { id: "chat_g_lead", type: "group", name: "Leadership", participants: "mem_khan,mem_owens,mem_nguyen,mem_sharma", lastMessage: "OKR review moved to Thursday.", lastMessageAt: timeAgo(72), unread: 0, muted: "Yes" },
  { id: "chat_c_ann", type: "channel", name: "announcements", participants: "mem_khan,mem_reyes,mem_chen,mem_cooper,mem_nguyen,mem_rossi,mem_tanaka,mem_hassan,mem_sharma,mem_owens,mem_martin,mem_singh", lastMessage: "Welcome to the new fiscal year!", lastMessageAt: timeAgo(120), unread: 0, muted: "No" },
  { id: "chat_c_random", type: "channel", name: "random", participants: "mem_khan,mem_chen,mem_singh", lastMessage: "Anyone up for lunch at 1?", lastMessageAt: timeAgo(30), unread: 1, muted: "No" },
  { id: "chat_c_help", type: "channel", name: "helpdesk", participants: "mem_khan,mem_martin,mem_singh", lastMessage: "Ticket #402 resolved.", lastMessageAt: timeAgo(90), unread: 0, muted: "No" },
];

const SEED_MESSAGES: ChatMessage[] = [
  { id: newId("msg"), chatId: "chat_d_reyes", senderId: "mem_reyes", body: "The analytics module is ready for review.", timestamp: timeAgo(24) },
  { id: newId("msg"), chatId: "chat_d_reyes", senderId: "mem_khan", body: "Great — I'll take a look this afternoon.", timestamp: timeAgo(20) },
  { id: newId("msg"), chatId: "chat_d_reyes", senderId: "mem_reyes", body: "Sounds good — shipping that today.", timestamp: timeAgo(2) },
  { id: newId("msg"), chatId: "chat_d_cooper", senderId: "mem_cooper", body: "Tokens updated with the new emerald palette.", timestamp: timeAgo(30) },
  { id: newId("msg"), chatId: "chat_d_cooper", senderId: "mem_khan", body: "Looks clean. Can we apply it to the sidebar?", timestamp: timeAgo(28) },
  { id: newId("msg"), chatId: "chat_d_cooper", senderId: "mem_cooper", body: "Updated the design tokens file.", timestamp: timeAgo(5) },
  { id: newId("msg"), chatId: "chat_d_nguyen", senderId: "mem_nguyen", body: "Metro Cargo signed the new SLA.", timestamp: timeAgo(48) },
  { id: newId("msg"), chatId: "chat_d_nguyen", senderId: "mem_khan", body: "Delivery partners confirmed for Q3.", timestamp: timeAgo(26) },
  { id: newId("msg"), chatId: "chat_d_owens", senderId: "mem_owens", body: "Trying to close the ACME deal this week.", timestamp: timeAgo(60) },
  { id: newId("msg"), chatId: "chat_d_owens", senderId: "mem_owens", body: "Can we sync before the review?", timestamp: timeAgo(50) },
  { id: newId("msg"), chatId: "chat_g_eng", senderId: "mem_reyes", body: "Pipeline is green after the latest PR.", timestamp: timeAgo(12) },
  { id: newId("msg"), chatId: "chat_g_eng", senderId: "mem_chen", body: "Nice — I merged the POS fixes too.", timestamp: timeAgo(9) },
  { id: newId("msg"), chatId: "chat_g_eng", senderId: "mem_khan", body: "Deploy is green. Nice work team!", timestamp: timeAgo(8) },
  { id: newId("msg"), chatId: "chat_g_lead", senderId: "mem_sharma", body: "Q3 OKR review is on the calendar.", timestamp: timeAgo(80) },
  { id: newId("msg"), chatId: "chat_g_lead", senderId: "mem_khan", body: "OKR review moved to Thursday.", timestamp: timeAgo(72) },
  { id: newId("msg"), chatId: "chat_c_ann", senderId: "mem_sharma", body: "Welcome to the new fiscal year!", timestamp: timeAgo(120) },
  { id: newId("msg"), chatId: "chat_c_random", senderId: "mem_singh", body: "Anyone up for lunch at 1?", timestamp: timeAgo(30) },
  { id: newId("msg"), chatId: "chat_c_help", senderId: "mem_martin", body: "Ticket #402 resolved.", timestamp: timeAgo(90) },
];

const SEED_ROOMS: MeetingRoom[] = [
  { id: "room_a", name: "Boardroom A", location: "Floor 4", capacity: "12", amenities: "4K display, video bar, whiteboard", isAvailable: "Yes" },
  { id: "room_b", name: "Boardroom B", location: "Floor 4", capacity: "8", amenities: "Display, conference phone", isAvailable: "Yes" },
  { id: "room_blue", name: "Blue Room", location: "Floor 3", capacity: "6", amenities: "Display, huddle desk", isAvailable: "Yes" },
  { id: "room_green", name: "Green Room", location: "Floor 3", capacity: "4", amenities: "Standup space", isAvailable: "Yes" },
  { id: "room_lounge", name: "Sky Lounge", location: "Floor 9", capacity: "20", amenities: "Projector, catering, bar", isAvailable: "No" },
  { id: "room_auditorium", name: "Auditorium", location: "Floor 1", capacity: "80", amenities: "Stage, live streaming", isAvailable: "No" },
];

const SEED_MEETINGS: TeamMeeting[] = [
  { id: "mtg_1", title: "Engineering Standup", date: daysFromNow(0), time: "09:30", duration: "30", organizerId: "mem_khan", attendees: "mem_khan,mem_reyes,mem_chen", roomId: "room_blue", roomName: "Blue Room", status: "Scheduled", agenda: "Daily sync, blockers and wins.", notes: "" },
  { id: "mtg_2", title: "Design Review", date: daysFromNow(0), time: "14:00", duration: "45", organizerId: "mem_cooper", attendees: "mem_cooper,mem_khan,mem_reyes", roomId: "room_a", roomName: "Boardroom A", status: "Scheduled", agenda: "Review the new analytics dashboard.", notes: "" },
  { id: "mtg_3", title: "Sales Pipeline Review", date: daysFromNow(1), time: "10:00", duration: "60", organizerId: "mem_owens", attendees: "mem_owens,mem_rossi,mem_khan", roomId: "room_b", roomName: "Boardroom B", status: "Scheduled", agenda: "Q3 pipeline and forecasts.", notes: "" },
  { id: "mtg_4", title: "1:1 with Alicia", date: daysFromNow(2), time: "11:00", duration: "30", organizerId: "mem_khan", attendees: "mem_khan,mem_reyes", roomId: "room_green", roomName: "Green Room", status: "Scheduled", agenda: "Growth plan and feedback.", notes: "" },
  { id: "mtg_5", title: "OKR Review", date: daysFromNow(4), time: "15:00", duration: "90", organizerId: "mem_khan", attendees: "mem_khan,mem_owens,mem_nguyen,mem_sharma", roomId: "room_lounge", roomName: "Sky Lounge", status: "Scheduled", agenda: "Quarterly objectives and key results.", notes: "" },
  { id: "mtg_6", title: "Onboarding Kickoff", date: daysFromNow(-1), time: "09:00", duration: "60", organizerId: "mem_sharma", attendees: "mem_sharma,mem_singh,mem_khan", roomId: "room_a", roomName: "Boardroom A", status: "Completed", agenda: "Welcome and setup for new hires.", notes: "All attendees joined." },
  { id: "mtg_7", title: "Infra Planning", date: daysFromNow(-2), time: "13:00", duration: "75", organizerId: "mem_reyes", attendees: "mem_reyes,mem_chen,mem_khan", roomId: "room_blue", roomName: "Blue Room", status: "Completed", agenda: "Scale the POS backend for Q4.", notes: "Decision: move to edge caching." },
  { id: "mtg_8", title: "Vendor Review", date: daysFromNow(-5), time: "16:00", duration: "45", organizerId: "mem_nguyen", attendees: "mem_nguyen,mem_tanaka", roomId: "room_b", roomName: "Boardroom B", status: "Completed", agenda: "Re-negotiate delivery partner rates.", notes: "Saved 8% on Zone C." },
  { id: "mtg_9", title: "Team Offsite Planning", date: daysFromNow(-3), time: "11:30", duration: "60", organizerId: "mem_sharma", attendees: "mem_sharma,mem_khan", roomId: "room_green", roomName: "Green Room", status: "Cancelled", agenda: "Plan the September offsite.", notes: "Postponed to next month." },
  { id: "mtg_10", title: "Performance Calibration", date: daysFromNow(-6), time: "10:30", duration: "120", organizerId: "mem_sharma", attendees: "mem_sharma,mem_khan,mem_owens", roomId: "room_auditorium", roomName: "Auditorium", status: "Completed", agenda: "Calibrate Q3 review scores.", notes: "Reviewed 12 members." },
];

const SEED_PROJECTS: TeamProject[] = [
  { id: "proj_1", name: "Analytics Suite", code: "ANL", leadId: "mem_khan", description: "Cross-module analytics dashboards.", status: "Active", progress: "65", startDate: daysAgo(40), endDate: daysFromNow(20), color: "emerald" },
  { id: "proj_2", name: "POS Terminal 2.0", code: "POS", leadId: "mem_reyes", description: "Rebuild the point of sale terminal.", status: "Active", progress: "40", startDate: daysAgo(60), endDate: daysFromNow(40), color: "sky" },
  { id: "proj_3", name: "Design System", code: "DSG", leadId: "mem_cooper", description: "Tokens, components and docs.", status: "Active", progress: "80", startDate: daysAgo(90), endDate: daysFromNow(10), color: "violet" },
  { id: "proj_4", name: "Delivery Network Q3", code: "DLV", leadId: "mem_nguyen", description: "Expand zones and partners.", status: "Planning", progress: "10", startDate: daysAgo(5), endDate: daysFromNow(55), color: "amber" },
  { id: "proj_5", name: "Mobile App", code: "Mob", leadId: "mem_chen", description: "Customer mobile experience.", status: "On Hold", progress: "20", startDate: daysAgo(120), endDate: daysFromNow(90), color: "rose" },
  { id: "proj_6", name: "Brand Refresh", code: "BRD", leadId: "mem_hassan", description: "Rebrand and marketing site.", status: "Completed", progress: "100", startDate: daysAgo(150), endDate: daysAgo(10), color: "teal" },
];

const SEED_TASKS: TeamTask[] = [
  { id: "task_1", title: "Build revenue trend chart", assigneeId: "mem_khan", projectId: "proj_1", status: "In Progress", priority: "High", dueDate: daysFromNow(2), notes: "Recharts area chart with INR formatting." },
  { id: "task_2", title: "Wire analytics sidebar group", assigneeId: "mem_khan", projectId: "proj_1", status: "To Do", priority: "High", dueDate: daysFromNow(3), notes: "Add Teams Meet nav group too." },
  { id: "task_3", title: "Review analytics data module", assigneeId: "mem_reyes", projectId: "proj_1", status: "In Review", priority: "Medium", dueDate: daysFromNow(1), notes: "Check store types match." },
  { id: "task_4", title: "Optimize POS cart rendering", assigneeId: "mem_chen", projectId: "proj_2", status: "In Progress", priority: "Urgent", dueDate: daysFromNow(1), notes: "Virtualize the item list." },
  { id: "task_5", title: "Migrate color tokens", assigneeId: "mem_cooper", projectId: "proj_3", status: "Done", priority: "Medium", dueDate: daysAgo(2), notes: "Emerald palette applied." },
  { id: "task_6", title: "Write delivery zone spec", assigneeId: "mem_nguyen", projectId: "proj_4", status: "To Do", priority: "High", dueDate: daysFromNow(5), notes: "Include pricing model." },
  { id: "task_7", title: "Prepare Q3 pipeline deck", assigneeId: "mem_rossi", projectId: "proj_1", status: "In Progress", priority: "Medium", dueDate: daysFromNow(4), notes: "" },
  { id: "task_8", title: "Forecast Q4 revenue", assigneeId: "mem_tanaka", projectId: "proj_1", status: "In Review", priority: "Low", dueDate: daysFromNow(6), notes: "" },
  { id: "task_9", title: "Draft brand guidelines", assigneeId: "mem_singh", projectId: "proj_6", status: "Done", priority: "Medium", dueDate: daysAgo(5), notes: "" },
  { id: "task_10", title: "Set up onboarding checklists", assigneeId: "mem_sharma", projectId: "proj_3", status: "To Do", priority: "High", dueDate: daysFromNow(7), notes: "" },
  { id: "task_11", title: "Resolve support backlog", assigneeId: "mem_martin", projectId: "proj_2", status: "In Progress", priority: "High", dueDate: daysFromNow(2), notes: "" },
  { id: "task_12", title: "Ship landing page copy", assigneeId: "mem_singh", projectId: "proj_6", status: "Done", priority: "Low", dueDate: daysAgo(12), notes: "" },
  { id: "task_13", title: "Implement approval workflow", assigneeId: "mem_khan", projectId: "proj_1", status: "To Do", priority: "Medium", dueDate: daysFromNow(9), notes: "" },
  { id: "task_14", title: "Mobile checkout flow", assigneeId: "mem_chen", projectId: "proj_5", status: "In Progress", priority: "High", dueDate: daysFromNow(15), notes: "" },
];

const SEED_APPROVALS: TeamApproval[] = [
  { id: "appr_1", type: "Expense", subject: "Q3 team dinner", submittedBy: "mem_khan", reviewer: "mem_sharma", status: "Pending", amount: "480", requestedAt: daysAgo(1), decidedAt: "", comment: "" },
  { id: "appr_2", type: "Purchase", subject: "4K monitors for design team", submittedBy: "mem_cooper", reviewer: "mem_khan", status: "Pending", amount: "3600", requestedAt: daysAgo(2), decidedAt: "", comment: "" },
  { id: "appr_3", type: "Leave", subject: "Annual leave — Aisha Singh", submittedBy: "mem_singh", reviewer: "mem_hassan", status: "Pending", amount: "0", requestedAt: daysAgo(1), decidedAt: "", comment: "" },
  { id: "appr_4", type: "Expense", subject: "Client travel — New York", submittedBy: "mem_rossi", reviewer: "mem_owens", status: "Approved", amount: "1250", requestedAt: daysAgo(6), decidedAt: daysAgo(4), comment: "Approved per travel policy." },
  { id: "appr_5", type: "Purchase", subject: "AWS capacity upgrade", submittedBy: "mem_reyes", reviewer: "mem_khan", status: "Approved", amount: "2400", requestedAt: daysAgo(8), decidedAt: daysAgo(7), comment: "" },
  { id: "appr_6", type: "Expense", subject: "Conferences — Q4", submittedBy: "mem_hassan", reviewer: "mem_khan", status: "Rejected", amount: "1800", requestedAt: daysAgo(10), decidedAt: daysAgo(9), comment: "Outside budget for this quarter." },
  { id: "appr_7", type: "Purchase", subject: "Ergonomic chairs", submittedBy: "mem_sharma", reviewer: "mem_tanaka", status: "Approved", amount: "1200", requestedAt: daysAgo(12), decidedAt: daysAgo(11), comment: "" },
  { id: "appr_8", type: "Leave", subject: "Maternity leave — Jane Cooper", submittedBy: "mem_cooper", reviewer: "mem_sharma", status: "Pending", amount: "0", requestedAt: daysAgo(3), decidedAt: "", comment: "" },
];

const SEED_PLANS: OnboardingPlan[] = [
  { id: "plan_std", title: "Standard Onboarding", ownerId: "mem_sharma", defaultDays: "30", description: "Default plan for most new joiners." },
  { id: "plan_mgr", title: "Manager Onboarding", ownerId: "mem_sharma", defaultDays: "45", description: "Extended plan for people managers." },
  { id: "plan_remote", title: "Remote Onboarding", ownerId: "mem_sharma", defaultDays: "30", description: "Adapted for fully remote hires." },
  { id: "plan_contractor", title: "Contractor Onboarding", ownerId: "mem_sharma", defaultDays: "14", description: "Lightweight plan for contractors." },
];

const SEED_CHECKLISTS: OnboardingChecklist[] = [
  { id: "cl_1", title: "Day 1 — Setup", planId: "plan_std", items: "Laptop setup, email access, Slack invite, HR paperwork" },
  { id: "cl_2", title: "Week 1 — Foundations", planId: "plan_std", items: "Meet the team, product walkthrough, set up local env, assign buddy" },
  { id: "cl_3", title: "Week 4 — Ramp up", planId: "plan_std", items: "First project, 1:1 with manager, 30-day check-in" },
  { id: "cl_4", title: "Remote Essentials", planId: "plan_remote", items: "Remote policy, hardware shipping, timezone sync, async guide" },
  { id: "cl_5", title: "Manager Essentials", planId: "plan_mgr", items: "People management 101, 1:1 cadence, performance cycles" },
  { id: "cl_6", title: "Contractor Pack", planId: "plan_contractor", items: "NDA, access scoping, invoice setup, kickoff call" },
];

const SEED_JOINERS: NewJoiner[] = [
  { id: "nj_1", name: "Aisha Singh", title: "Content Designer", departmentId: "dep_mkt", startDate: daysAgo(20), planId: "plan_std", stage: "Week 3", status: "On Track", buddyId: "mem_hassan", tasksDone: "8", tasksTotal: "12", notes: "" },
  { id: "nj_2", name: "Liam Martin", title: "Support Lead", departmentId: "dep_support", startDate: daysAgo(15), planId: "plan_mgr", stage: "Week 2", status: "On Track", buddyId: "mem_khan", tasksDone: "5", tasksTotal: "14", notes: "" },
  { id: "nj_3", name: "Nina Petrova", title: "Data Engineer", departmentId: "dep_eng", startDate: daysFromNow(7), planId: "plan_std", stage: "Pre-boarding", status: "On Track", buddyId: "mem_reyes", tasksDone: "2", tasksTotal: "12", notes: "Visa paperwork in progress." },
  { id: "nj_4", name: "Diego Santos", title: "Account Executive", departmentId: "dep_sales", startDate: daysFromNow(14), planId: "plan_remote", stage: "Pre-boarding", status: "At Risk", buddyId: "mem_owens", tasksDone: "1", tasksTotal: "11", notes: "Laptop hasn't shipped yet." },
  { id: "nj_5", name: "Hana Kobayashi", title: "QA Engineer", departmentId: "dep_eng", startDate: daysAgo(2), planId: "plan_std", stage: "Week 1", status: "On Track", buddyId: "mem_chen", tasksDone: "3", tasksTotal: "12", notes: "" },
  { id: "nj_6", name: "Owen Walsh", title: "Finance Manager", departmentId: "dep_fin", startDate: daysAgo(45), planId: "plan_mgr", stage: "Week 7", status: "Completed", buddyId: "mem_tanaka", tasksDone: "14", tasksTotal: "14", notes: "Fully ramped." },
];

const SEED_ATTENDANCE: AttendanceRecord[] = [
  { id: "att_1", memberId: "mem_khan", date: daysAgo(0), status: "Present", checkIn: "09:02", checkOut: "18:20", hours: "9.0", notes: "" },
  { id: "att_2", memberId: "mem_reyes", date: daysAgo(0), status: "Present", checkIn: "08:58", checkOut: "18:05", hours: "9.1", notes: "" },
  { id: "att_3", memberId: "mem_chen", date: daysAgo(0), status: "WFA", checkIn: "—", checkOut: "—", hours: "8.0", notes: "Remote day." },
  { id: "att_4", memberId: "mem_khan", date: daysAgo(1), status: "Present", checkIn: "09:10", checkOut: "18:00", hours: "8.8", notes: "" },
  { id: "att_5", memberId: "mem_cooper", date: daysAgo(1), status: "Late", checkIn: "10:35", checkOut: "18:15", hours: "7.7", notes: "Morning appointment." },
  { id: "att_6", memberId: "mem_rossi", date: daysAgo(1), status: "Present", checkIn: "09:00", checkOut: "17:45", hours: "8.8", notes: "" },
  { id: "att_7", memberId: "mem_chen", date: daysAgo(2), status: "Present", checkIn: "08:45", checkOut: "18:30", hours: "9.8", notes: "" },
  { id: "att_8", memberId: "mem_sharma", date: daysAgo(2), status: "On Leave", checkIn: "—", checkOut: "—", hours: "0", notes: "Approved leave." },
  { id: "att_9", memberId: "mem_singh", date: daysAgo(2), status: "Half Day", checkIn: "09:00", checkOut: "13:00", hours: "4.0", notes: "" },
  { id: "att_10", memberId: "mem_nguyen", date: daysAgo(3), status: "Present", checkIn: "08:30", checkOut: "19:00", hours: "10.5", notes: "" },
  { id: "att_11", memberId: "mem_tanaka", date: daysAgo(3), status: "Absent", checkIn: "—", checkOut: "—", hours: "0", notes: "Unplanned absence." },
  { id: "att_12", memberId: "mem_martin", date: daysAgo(3), status: "Present", checkIn: "09:05", checkOut: "18:00", hours: "8.9", notes: "" },
];

const SEED_LEAVE: LeaveRequest[] = [
  { id: "leave_1", memberId: "mem_singh", type: "Annual", from: daysFromNow(10), to: daysFromNow(12), days: "3", reason: "Family trip to Goa.", status: "Pending", approvedBy: "" },
  { id: "leave_2", memberId: "mem_cooper", type: "Maternity", from: daysFromNow(20), to: daysFromNow(80), days: "60", reason: "Maternity leave.", status: "Pending", approvedBy: "" },
  { id: "leave_3", memberId: "mem_sharma", type: "Sick", from: daysAgo(1), to: daysAgo(1), days: "1", reason: "Flu.", status: "Approved", approvedBy: "mem_khan" },
  { id: "leave_4", memberId: "mem_chen", type: "Casual", from: daysFromNow(5), to: daysFromNow(5), days: "1", reason: "Personal errand.", status: "Approved", approvedBy: "mem_reyes" },
  { id: "leave_5", memberId: "mem_rossi", type: "Annual", from: daysFromNow(15), to: daysFromNow(18), days: "4", reason: "Holiday in Sardinia.", status: "Approved", approvedBy: "mem_owens" },
  { id: "leave_6", memberId: "mem_martin", type: "Sick", from: daysAgo(4), to: daysAgo(3), days: "2", reason: "Migraine.", status: "Rejected", approvedBy: "mem_khan" },
  { id: "leave_7", memberId: "mem_nguyen", type: "Paternity", from: daysFromNow(30), to: daysFromNow(44), days: "15", reason: "New arrival.", status: "Pending", approvedBy: "" },
  { id: "leave_8", memberId: "mem_tanaka", type: "Annual", from: daysFromNow(7), to: daysFromNow(8), days: "2", reason: "Golden week travel.", status: "Approved", approvedBy: "mem_khan" },
];

const SEED_WORK_HOURS: WorkHoursEntry[] = [
  { id: "wh_1", memberId: "mem_khan", week: "W34", planned: "40", actual: "42.5", overtime: "2.5" },
  { id: "wh_2", memberId: "mem_reyes", week: "W34", planned: "40", actual: "44", overtime: "4" },
  { id: "wh_3", memberId: "mem_chen", week: "W34", planned: "40", actual: "38", overtime: "0" },
  { id: "wh_4", memberId: "mem_cooper", week: "W34", planned: "40", actual: "41", overtime: "1" },
  { id: "wh_5", memberId: "mem_nguyen", week: "W34", planned: "40", actual: "47", overtime: "7" },
  { id: "wh_6", memberId: "mem_singh", week: "W34", planned: "40", actual: "39", overtime: "0" },
  { id: "wh_7", memberId: "mem_khan", week: "W33", planned: "40", actual: "43", overtime: "3" },
  { id: "wh_8", memberId: "mem_martin", week: "W33", planned: "40", actual: "40.5", overtime: "0.5" },
];

const SEED_GOALS: TeamGoal[] = [
  { id: "goal_1", title: "Ship analytics suite", ownerId: "mem_khan", period: "Q3", category: "Product", progress: "65", status: "On Track" },
  { id: "goal_2", title: "Reduce POS checkout errors", ownerId: "mem_reyes", period: "Q3", category: "Engineering", progress: "45", status: "At Risk" },
  { id: "goal_3", title: "Adopt new design tokens", ownerId: "mem_cooper", period: "Q3", category: "Design", progress: "80", status: "On Track" },
  { id: "goal_4", title: "Expand to 4 new delivery zones", ownerId: "mem_nguyen", period: "Q3", category: "Operations", progress: "30", status: "On Track" },
  { id: "goal_5", title: "Close 12 enterprise deals", ownerId: "mem_owens", period: "Q3", category: "Sales", progress: "58", status: "On Track" },
  { id: "goal_6", title: "Cut burn by 10%", ownerId: "mem_tanaka", period: "Q3", category: "Finance", progress: "20", status: "At Risk" },
  { id: "goal_7", title: "Launch rebrand", ownerId: "mem_hassan", period: "Q3", category: "Marketing", progress: "100", status: "Achieved" },
  { id: "goal_8", title: "Reduce support MTTR to 4h", ownerId: "mem_martin", period: "Q3", category: "Support", progress: "70", status: "On Track" },
  { id: "goal_9", title: "Hire 6 new engineers", ownerId: "mem_sharma", period: "Q3", category: "People", progress: "50", status: "On Track" },
  { id: "goal_10", title: "Improve docs coverage", ownerId: "mem_singh", period: "Q4", category: "Content", progress: "15", status: "Not Started" },
];

const SEED_REVIEWS: PerformanceReview[] = [
  { id: "rev_1", title: "Q3 Performance Review", memberId: "mem_reyes", reviewerId: "mem_khan", period: "Q3", dueDate: daysFromNow(5), status: "In Progress", score: "", comments: "" },
  { id: "rev_2", title: "Q3 Performance Review", memberId: "mem_chen", reviewerId: "mem_reyes", period: "Q3", dueDate: daysFromNow(7), status: "Draft", score: "", comments: "" },
  { id: "rev_3", title: "Q3 Performance Review", memberId: "mem_cooper", reviewerId: "mem_khan", period: "Q3", dueDate: daysFromNow(3), status: "Submitted", score: "4.2", comments: "Strong quarter on the design system." },
  { id: "rev_4", title: "Mid-year Check-in", memberId: "mem_rossi", reviewerId: "mem_owens", period: "Q2", dueDate: daysAgo(20), status: "Completed", score: "3.8", comments: "Great momentum on enterprise accounts." },
  { id: "rev_5", title: "Q3 Performance Review", memberId: "mem_singh", reviewerId: "mem_hassan", period: "Q3", dueDate: daysFromNow(10), status: "Draft", score: "", comments: "" },
  { id: "rev_6", title: "Q3 Performance Review", memberId: "mem_martin", reviewerId: "mem_khan", period: "Q3", dueDate: daysFromNow(4), status: "In Progress", score: "", comments: "" },
];

const SEED_RECOGNITION: Recognition[] = [
  { id: "rec_1", from: "mem_khan", to: "mem_reyes", type: "Kudos", message: "Pulled the infra migration across the line.", date: daysAgo(2) },
  { id: "rec_2", from: "mem_reyes", to: "mem_chen", type: "Kudos", message: "Crushed the POS performance work.", date: daysAgo(4) },
  { id: "rec_3", from: "mem_owens", to: "mem_rossi", type: "Spot Bonus", message: "Closed the ACME deal two weeks early.", date: daysAgo(6) },
  { id: "rec_4", from: "mem_sharma", to: "mem_singh", type: "Employee of the Month", message: "Rewrote all our onboarding docs.", date: daysAgo(12) },
  { id: "rec_5", from: "mem_nguyen", to: "mem_martin", type: "Team Award", message: "Support hit a record CSAT in July.", date: daysAgo(9) },
  { id: "rec_6", from: "mem_cooper", to: "mem_khan", type: "Milestone", message: "5 years at XMerge — legend!", date: daysAgo(15) },
];

const SEED_DOCUMENTS: TeamDocument[] = [
  { id: "doc_1", name: "Q3 OKR Deck", category: "Team", ownerId: "mem_khan", size: "4.2 MB", type: "PPTX", uploadedAt: daysAgo(3), version: "v3" },
  { id: "doc_2", name: "Engineering Onboarding Guide", category: "Team", ownerId: "mem_reyes", size: "1.1 MB", type: "PDF", uploadedAt: daysAgo(8), version: "v2" },
  { id: "doc_3", name: "Design Token Spec", category: "Team", ownerId: "mem_cooper", size: "860 KB", type: "PDF", uploadedAt: daysAgo(5), version: "v4" },
  { id: "doc_4", name: "Remote Work Policy", category: "Policy", ownerId: "mem_sharma", size: "320 KB", type: "PDF", uploadedAt: daysAgo(30), version: "v1" },
  { id: "doc_5", name: "Travel & Expense Policy", category: "Policy", ownerId: "mem_tanaka", size: "540 KB", type: "PDF", uploadedAt: daysAgo(60), version: "v2" },
  { id: "doc_6", name: "Code of Conduct", category: "Policy", ownerId: "mem_sharma", size: "410 KB", type: "PDF", uploadedAt: daysAgo(90), version: "v1" },
  { id: "doc_7", name: "Leave Policy 2026", category: "Policy", ownerId: "mem_sharma", size: "280 KB", type: "DOCX", uploadedAt: daysAgo(15), version: "v1" },
  { id: "doc_8", name: "Alicia Reyes — Offer Letter", category: "Employee", ownerId: "mem_sharma", size: "180 KB", type: "PDF", uploadedAt: daysAgo(640), version: "v1" },
  { id: "doc_9", name: "Aisha Singh — Contract", category: "Employee", ownerId: "mem_sharma", size: "210 KB", type: "PDF", uploadedAt: daysAgo(120), version: "v1" },
  { id: "doc_10", name: "Marcus Chen — Tax Forms", category: "Employee", ownerId: "mem_sharma", size: "95 KB", type: "PDF", uploadedAt: daysAgo(410), version: "v1" },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann_1", title: "Welcome to the new fiscal year", body: "Q3 is officially underway. Check the OKR deck in Team Documents for our priorities, and reach out to your manager with any questions.", authorId: "mem_khan", channel: "All Company", priority: "Normal", publishedAt: timeAgo(120), pinned: "Yes" },
  { id: "ann_2", title: "Office reopening — Floor 4", body: "Floor 4 meeting rooms are fully renovated. Book Boardroom A/B through Teams Meet > Meeting Rooms.", authorId: "mem_sharma", channel: "All Company", priority: "Important", publishedAt: timeAgo(96), pinned: "Yes" },
  { id: "ann_3", title: "Security reminder", body: "Complete the quarterly phishing simulation before Friday. Takes 5 minutes and is mandatory for everyone.", authorId: "mem_khan", channel: "All Company", priority: "Urgent", publishedAt: timeAgo(72), pinned: "No" },
  { id: "ann_4", title: "Engineering All-Hands", body: "Join the All-Hands on Thursday 3 PM. We'll demo the analytics suite and POS 2.0 progress.", authorId: "mem_reyes", channel: "Team", priority: "Normal", publishedAt: timeAgo(48), pinned: "No" },
  { id: "ann_5", title: "September offsite — save the date", body: "The September team offsite is confirmed for the 19th. Travel and accommodation details to follow.", authorId: "mem_sharma", channel: "All Company", priority: "Important", publishedAt: timeAgo(30), pinned: "No" },
  { id: "ann_6", title: "Q3 goal check-in", body: "Goal check-ins are due next week. Review your progress under Performance > Goals and add any blockers.", authorId: "mem_khan", channel: "Team", priority: "Normal", publishedAt: timeAgo(20), pinned: "No" },
];

type TeamMeetState = {
  departments: Department[];
  members: TeamMember[];
  roles: TeamRole[];
  chats: TeamChat[];
  messages: ChatMessage[];
  rooms: MeetingRoom[];
  meetings: TeamMeeting[];
  projects: TeamProject[];
  tasks: TeamTask[];
  approvals: TeamApproval[];
  plans: OnboardingPlan[];
  checklists: OnboardingChecklist[];
  joiners: NewJoiner[];
  attendance: AttendanceRecord[];
  leave: LeaveRequest[];
  workHours: WorkHoursEntry[];
  goals: TeamGoal[];
  reviews: PerformanceReview[];
  recognition: Recognition[];
  documents: TeamDocument[];
  announcements: Announcement[];

  addDepartment: (d: Omit<Department, "id">) => void;
  updateDepartment: (id: string, d: Omit<Department, "id">) => void;
  deleteDepartment: (id: string) => void;

  addMember: (d: Omit<TeamMember, "id">) => void;
  updateMember: (id: string, d: Omit<TeamMember, "id">) => void;
  deleteMember: (id: string) => void;

  addRole: (d: Omit<TeamRole, "id">) => void;
  updateRole: (id: string, d: Omit<TeamRole, "id">) => void;
  deleteRole: (id: string) => void;

  addChat: (d: Omit<TeamChat, "id">) => void;
  updateChat: (id: string, d: Omit<TeamChat, "id">) => void;
  deleteChat: (id: string) => void;
  sendMessage: (chatId: string, senderId: string, body: string) => void;

  addRoom: (d: Omit<MeetingRoom, "id">) => void;
  updateRoom: (id: string, d: Omit<MeetingRoom, "id">) => void;
  deleteRoom: (id: string) => void;

  addMeeting: (d: Omit<TeamMeeting, "id">) => void;
  updateMeeting: (id: string, d: Omit<TeamMeeting, "id">) => void;
  deleteMeeting: (id: string) => void;
  setMeetingStatus: (id: string, status: TeamMeeting["status"]) => void;

  addProject: (d: Omit<TeamProject, "id">) => void;
  updateProject: (id: string, d: Omit<TeamProject, "id">) => void;
  deleteProject: (id: string) => void;

  addTask: (d: Omit<TeamTask, "id">) => void;
  updateTask: (id: string, d: Omit<TeamTask, "id">) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TeamTask["status"]) => void;

  addApproval: (d: Omit<TeamApproval, "id">) => void;
  updateApproval: (id: string, d: Omit<TeamApproval, "id">) => void;
  deleteApproval: (id: string) => void;

  addPlan: (d: Omit<OnboardingPlan, "id">) => void;
  updatePlan: (id: string, d: Omit<OnboardingPlan, "id">) => void;
  deletePlan: (id: string) => void;

  addChecklist: (d: Omit<OnboardingChecklist, "id">) => void;
  updateChecklist: (id: string, d: Omit<OnboardingChecklist, "id">) => void;
  deleteChecklist: (id: string) => void;

  addJoiner: (d: Omit<NewJoiner, "id">) => void;
  updateJoiner: (id: string, d: Omit<NewJoiner, "id">) => void;
  deleteJoiner: (id: string) => void;

  addAttendance: (d: Omit<AttendanceRecord, "id">) => void;
  updateAttendance: (id: string, d: Omit<AttendanceRecord, "id">) => void;
  deleteAttendance: (id: string) => void;

  addLeave: (d: Omit<LeaveRequest, "id">) => void;
  updateLeave: (id: string, d: Omit<LeaveRequest, "id">) => void;
  deleteLeave: (id: string) => void;

  addWorkHours: (d: Omit<WorkHoursEntry, "id">) => void;
  updateWorkHours: (id: string, d: Omit<WorkHoursEntry, "id">) => void;
  deleteWorkHours: (id: string) => void;

  addGoal: (d: Omit<TeamGoal, "id">) => void;
  updateGoal: (id: string, d: Omit<TeamGoal, "id">) => void;
  deleteGoal: (id: string) => void;

  addReview: (d: Omit<PerformanceReview, "id">) => void;
  updateReview: (id: string, d: Omit<PerformanceReview, "id">) => void;
  deleteReview: (id: string) => void;

  addRecognition: (d: Omit<Recognition, "id">) => void;
  deleteRecognition: (id: string) => void;

  addDocument: (d: Omit<TeamDocument, "id">) => void;
  updateDocument: (id: string, d: Omit<TeamDocument, "id">) => void;
  deleteDocument: (id: string) => void;

  addAnnouncement: (d: Omit<Announcement, "id">) => void;
  updateAnnouncement: (id: string, d: Omit<Announcement, "id">) => void;
  deleteAnnouncement: (id: string) => void;

  resetAll: () => void;
};

const reset = () => ({
  departments: SEED_DEPARTMENTS,
  members: SEED_MEMBERS,
  roles: SEED_ROLES,
  chats: SEED_CHATS,
  messages: SEED_MESSAGES,
  rooms: SEED_ROOMS,
  meetings: SEED_MEETINGS,
  projects: SEED_PROJECTS,
  tasks: SEED_TASKS,
  approvals: SEED_APPROVALS,
  plans: SEED_PLANS,
  checklists: SEED_CHECKLISTS,
  joiners: SEED_JOINERS,
  attendance: SEED_ATTENDANCE,
  leave: SEED_LEAVE,
  workHours: SEED_WORK_HOURS,
  goals: SEED_GOALS,
  reviews: SEED_REVIEWS,
  recognition: SEED_RECOGNITION,
  documents: SEED_DOCUMENTS,
  announcements: SEED_ANNOUNCEMENTS,
});

const updateIn = <T extends { id: string }>(
  list: T[],
  id: string,
  patch: Omit<T, "id">
): T[] => list.map((item) => (item.id === id ? { ...item, ...patch } : item));

const deleteFrom = <T extends { id: string }>(list: T[], id: string): T[] =>
  list.filter((item) => item.id !== id);

export const useTeamMeetStore = create<TeamMeetState>()(
  persist(
    (set) => ({
      ...reset(),

      addDepartment: (d) => set((s) => ({ departments: [{ id: newId("dep"), ...d }, ...s.departments] })),
      updateDepartment: (id, d) => set((s) => ({ departments: updateIn(s.departments, id, d) })),
      deleteDepartment: (id) => set((s) => ({ departments: deleteFrom(s.departments, id) })),

      addMember: (d) => set((s) => ({ members: [{ id: newId("mem"), ...d }, ...s.members] })),
      updateMember: (id, d) => set((s) => ({ members: updateIn(s.members, id, d) })),
      deleteMember: (id) => set((s) => ({ members: deleteFrom(s.members, id) })),

      addRole: (d) => set((s) => ({ roles: [{ id: newId("rol"), ...d }, ...s.roles] })),
      updateRole: (id, d) => set((s) => ({ roles: updateIn(s.roles, id, d) })),
      deleteRole: (id) => set((s) => ({ roles: deleteFrom(s.roles, id) })),

      addChat: (d) => set((s) => ({ chats: [{ id: newId("chat"), ...d }, ...s.chats] })),
      updateChat: (id, d) => set((s) => ({ chats: updateIn(s.chats, id, d) })),
      deleteChat: (id) => set((s) => ({ chats: deleteFrom(s.chats, id) })),
      sendMessage: (chatId, senderId, body) =>
        set((s) => {
          const message: ChatMessage = {
            id: newId("msg"),
            chatId,
            senderId,
            body,
            timestamp: new Date().toISOString(),
          };
          return {
            messages: [...s.messages, message],
            chats: s.chats.map((c) =>
              c.id === chatId
                ? { ...c, lastMessage: body, lastMessageAt: message.timestamp, unread: 0 }
                : c
            ),
          };
        }),

      addRoom: (d) => set((s) => ({ rooms: [{ id: newId("room"), ...d }, ...s.rooms] })),
      updateRoom: (id, d) => set((s) => ({ rooms: updateIn(s.rooms, id, d) })),
      deleteRoom: (id) => set((s) => ({ rooms: deleteFrom(s.rooms, id) })),

      addMeeting: (d) => set((s) => ({ meetings: [{ id: newId("mtg"), ...d }, ...s.meetings] })),
      updateMeeting: (id, d) => set((s) => ({ meetings: updateIn(s.meetings, id, d) })),
      deleteMeeting: (id) => set((s) => ({ meetings: deleteFrom(s.meetings, id) })),
      setMeetingStatus: (id, status) =>
        set((s) => ({ meetings: s.meetings.map((m) => (m.id === id ? { ...m, status } : m)) })),

      addProject: (d) => set((s) => ({ projects: [{ id: newId("proj"), ...d }, ...s.projects] })),
      updateProject: (id, d) => set((s) => ({ projects: updateIn(s.projects, id, d) })),
      deleteProject: (id) => set((s) => ({ projects: deleteFrom(s.projects, id) })),

      addTask: (d) => set((s) => ({ tasks: [{ id: newId("task"), ...d }, ...s.tasks] })),
      updateTask: (id, d) => set((s) => ({ tasks: updateIn(s.tasks, id, d) })),
      deleteTask: (id) => set((s) => ({ tasks: deleteFrom(s.tasks, id) })),
      setTaskStatus: (id, status) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),

      addApproval: (d) => set((s) => ({ approvals: [{ id: newId("appr"), ...d }, ...s.approvals] })),
      updateApproval: (id, d) => set((s) => ({ approvals: updateIn(s.approvals, id, d) })),
      deleteApproval: (id) => set((s) => ({ approvals: deleteFrom(s.approvals, id) })),

      addPlan: (d) => set((s) => ({ plans: [{ id: newId("plan"), ...d }, ...s.plans] })),
      updatePlan: (id, d) => set((s) => ({ plans: updateIn(s.plans, id, d) })),
      deletePlan: (id) => set((s) => ({ plans: deleteFrom(s.plans, id) })),

      addChecklist: (d) => set((s) => ({ checklists: [{ id: newId("cl"), ...d }, ...s.checklists] })),
      updateChecklist: (id, d) => set((s) => ({ checklists: updateIn(s.checklists, id, d) })),
      deleteChecklist: (id) => set((s) => ({ checklists: deleteFrom(s.checklists, id) })),

      addJoiner: (d) => set((s) => ({ joiners: [{ id: newId("nj"), ...d }, ...s.joiners] })),
      updateJoiner: (id, d) => set((s) => ({ joiners: updateIn(s.joiners, id, d) })),
      deleteJoiner: (id) => set((s) => ({ joiners: deleteFrom(s.joiners, id) })),

      addAttendance: (d) => set((s) => ({ attendance: [{ id: newId("att"), ...d }, ...s.attendance] })),
      updateAttendance: (id, d) => set((s) => ({ attendance: updateIn(s.attendance, id, d) })),
      deleteAttendance: (id) => set((s) => ({ attendance: deleteFrom(s.attendance, id) })),

      addLeave: (d) => set((s) => ({ leave: [{ id: newId("leave"), ...d }, ...s.leave] })),
      updateLeave: (id, d) => set((s) => ({ leave: updateIn(s.leave, id, d) })),
      deleteLeave: (id) => set((s) => ({ leave: deleteFrom(s.leave, id) })),

      addWorkHours: (d) => set((s) => ({ workHours: [{ id: newId("wh"), ...d }, ...s.workHours] })),
      updateWorkHours: (id, d) => set((s) => ({ workHours: updateIn(s.workHours, id, d) })),
      deleteWorkHours: (id) => set((s) => ({ workHours: deleteFrom(s.workHours, id) })),

      addGoal: (d) => set((s) => ({ goals: [{ id: newId("goal"), ...d }, ...s.goals] })),
      updateGoal: (id, d) => set((s) => ({ goals: updateIn(s.goals, id, d) })),
      deleteGoal: (id) => set((s) => ({ goals: deleteFrom(s.goals, id) })),

      addReview: (d) => set((s) => ({ reviews: [{ id: newId("rev"), ...d }, ...s.reviews] })),
      updateReview: (id, d) => set((s) => ({ reviews: updateIn(s.reviews, id, d) })),
      deleteReview: (id) => set((s) => ({ reviews: deleteFrom(s.reviews, id) })),

      addRecognition: (d) => set((s) => ({ recognition: [{ id: newId("rec"), ...d }, ...s.recognition] })),
      deleteRecognition: (id) => set((s) => ({ recognition: deleteFrom(s.recognition, id) })),

      addDocument: (d) => set((s) => ({ documents: [{ id: newId("doc"), ...d }, ...s.documents] })),
      updateDocument: (id, d) => set((s) => ({ documents: updateIn(s.documents, id, d) })),
      deleteDocument: (id) => set((s) => ({ documents: deleteFrom(s.documents, id) })),

      addAnnouncement: (d) => set((s) => ({ announcements: [{ id: newId("ann"), ...d }, ...s.announcements] })),
      updateAnnouncement: (id, d) => set((s) => ({ announcements: updateIn(s.announcements, id, d) })),
      deleteAnnouncement: (id) => set((s) => ({ announcements: deleteFrom(s.announcements, id) })),

      resetAll: () => set(reset()),
    }),
    {
      name: "xmerge_teams_meet",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useTeamMeetStore.persist.rehydrate();
});
