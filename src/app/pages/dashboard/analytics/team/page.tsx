"use client";

import { useMemo } from "react";
import {
  Activity,
  GitPullRequest,
  MessagesSquare,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { useClientReady } from "@/hooks/useClientReady";
import {
  KpiCard,
  ChartCard,
  TopList,
  BreakdownList,
} from "@/components/analytics/ui";
import { AnalyticsAreaChart } from "@/components/analytics/charts";
import {
  num,
  teamOverview,
} from "@/modules/analytics/data";

export default function AnalyticsTeamPage() {
  const team = useMemo(() => teamOverview(), []);

  const ready = useClientReady();
  if (!ready) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="p-1.5">
        <h1 className="text-xl font-semibold text-gray-800">Team Analytics</h1>
        <p className="text-sm text-gray-500">
          User activity, requests, approvals and engagement.
        </p>
      </div>

      <div className="grid gap-3 p-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Active Users"
          value={num(team.actors)}
          icon={Users}
          tone="bg-emerald-50 text-emerald-700"
        />
        <KpiCard
          label="Activities"
          value={num(team.activity)}
          sub="logged this period"
          icon={Activity}
          tone="bg-sky-50 text-sky-700"
        />
        <KpiCard
          label="Open Requests"
          value={num(team.openRequests)}
          sub={`${num(team.totalRequests)} total`}
          icon={MessagesSquare}
          tone="bg-violet-50 text-violet-700"
        />
        <KpiCard
          label="Pending Approvals"
          value={num(team.pendingApprovals)}
          sub={`${num(team.totalApprovals)} total`}
          icon={ShieldCheck}
          tone="bg-amber-50 text-amber-700"
        />
        <KpiCard
          label="Agents Active"
          value={num(team.activityByAgent.length)}
          icon={UserCheck}
          tone="bg-teal-50 text-teal-700"
        />
        <KpiCard
          label="Reviews Due"
          value={num(team.totalApprovals - team.pendingApprovals)}
          sub="completed reviews"
          icon={GitPullRequest}
          tone="bg-rose-50 text-rose-700"
        />
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard
          title="Activity Trend"
          subtitle="Logged actions, last 12 months"
          className="lg:col-span-2"
        >
          <AnalyticsAreaChart
            data={team.monthly}
            xKey="label"
            series={[{ key: "value", name: "Activities", color: "#8b5cf6" }]}
            format={num}
          />
        </ChartCard>
        <ChartCard title="Top Actors" subtitle="Most active users">
          <TopList
            items={team.activityByActor.map((a) => ({
              label: a.label,
              value: a.value,
            }))}
            format={num}
          />
        </ChartCard>
      </div>

      <div className="grid gap-3 p-1.5 lg:grid-cols-3">
        <ChartCard title="Requests by Assignee">
          <BreakdownList items={team.requestsByAssignee} format={num} />
        </ChartCard>
        <ChartCard title="Approvals by Reviewer">
          <BreakdownList items={team.approvalsByReviewer} format={num} />
        </ChartCard>
        <ChartCard title="Agent Activity" subtitle="Messages handled per agent">
          <TopList
            items={team.activityByAgent.map((a) => ({
              label: a.label,
              value: a.value,
            }))}
            format={num}
          />
        </ChartCard>
      </div>
    </div>
  );
}
