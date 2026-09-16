"use client";

import { useEffect, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { currentUserName } from "@/utils/user";
import api from "@/lib/api.utils";
import { useAuthStore } from "@/stores/AuthStore";
import { ROLE_LABELS } from "@/constants/roles";
import type { UserRole } from "@/constants/roles";
import { MODULE_PAGE_KEY } from "@/constants/pages";
import {
  ArrowLeft,
  CreditCard,
  Trash2,
  Blocks,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type BackendRole = {
  id: string;
  name: string;
  description: string | null;
};

type BackendProfileType = {
  id: string;
  name: string;
  key: string;
  description: string | null;
  config?: Record<string, unknown>;
};

type BackendUserDetail = {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  details: Record<string, unknown> | null;
};

type BackendTenant = {
  id: string;
  name: string;
  slug: string;
  subscriptionStatus?: "trial" | "active" | "inactive";
  subscriptionPlan?: string | null;
  subscriptionPaidUntil?: string | null;
};

type BackendUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  tenantId?: string;
  tenant?: BackendTenant;
  isActive: boolean;
  isApproved?: boolean;
  isEmailVerified: boolean;
  roles: BackendRole[];
  detail: BackendUserDetail | null;
  createdAt: string;
  updatedAt: string;
};

type SubscriptionPlan = {
  id: string;
  key: string;
  name: string;
  durationDays: number | null;
  price: string | null;
};

type BackendModule = {
  id: string;
  name: string;
  pageKey: string;
  description: string | null;
  subModules: string[];
};

type ModuleOverrides = {
  add: string[];
  remove: string[];
};

type SubModulesMap = Record<string, string[]>;

const roleBadgeClass = (roleName: string) => {
  switch (roleName) {
    case "systemadmin":
      return "bg-red-50 text-red-700 border border-red-200";
    case "superadmin":
      return "bg-orange-50 text-orange-700 border border-orange-200";
    case "admin":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const subscriptionBadge = (status?: string) => {
  switch (status) {
    case "active":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200"
        >
          Active
        </Badge>
      );
    case "trial":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          Trial
        </Badge>
      );
    case "inactive":
      return (
        <Badge
          variant="outline"
          className="bg-rose-50 text-rose-700 border-rose-200"
        >
          Inactive
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          Unknown
        </Badge>
      );
  }
};

const formatDate = (iso?: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function getModuleOverrides(user: BackendUser): ModuleOverrides {
  const details = user.detail?.details as
    | { moduleOverrides?: ModuleOverrides }
    | null
    | undefined;
  return details?.moduleOverrides || { add: [], remove: [] };
}

function getSubModules(user: BackendUser): SubModulesMap {
  const details = user.detail?.details as
    | { subModules?: SubModulesMap }
    | null
    | undefined;
  return details?.subModules || {};
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="size-3.5" />
      {children}
    </p>
  );
}

function Toggle({ checked }: { checked: boolean }) {
  return (
    <span
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      />
    </span>
  );
}

export function UsersSection() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [roles, setRoles] = useState<BackendRole[]>([]);
  const [profileTypes, setProfileTypes] = useState<BackendProfileType[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [modulesRows, setModulesRows] = useState<BackendModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const currentUser = useAuthStore((state) => state.user);
  const isSystemAdmin = currentUser?.roles?.some(
    (r) => r.name === "systemadmin"
  );

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        const [rolesRes, profileTypesRes, plansRes, modulesRes] =
          await Promise.all([
            api.get("/roles"),
            api.get("/profile-types"),
            api.get("/plans"),
            api.get("/modules"),
          ]);

        if (!cancelled) {
          setRoles(rolesRes.data);
          setProfileTypes(profileTypesRes.data);
          setPlans(plansRes.data);
          setModulesRows(modulesRes.data);
        }
      } catch (err: any) {
        if (!cancelled) {
          toast.error(err.message || "Failed to load metadata.");
        }
      }
    }

    loadMeta();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSearchQuery(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoading(true);
      try {
        const params: Record<string, number | string> = { page, limit };
        const trimmed = searchQuery.trim();
        if (trimmed) params.search = trimmed;
        const res = await api.get("/users", { params });

        if (!cancelled) {
          const items: BackendUser[] = res.data.items ?? [];
          setUsers(items);
          setTotal(res.data.total ?? 0);
          setSelectedUserId((prev) =>
            prev && !items.some((u) => u.id === prev) ? null : prev
          );
        }
      } catch (err: any) {
        if (!cancelled) {
          toast.error(err.message || "Failed to load users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [page, searchQuery]);

  if (!isSystemAdmin) {
    return null;
  }

  const selectedUser = users.find((u) => u.id === selectedUserId) ?? null;
  const canEditSelected =
    !!selectedUser &&
    selectedUser.id !== currentUser?.id &&
    !selectedUser.roles.some((role) => role.name === "systemadmin");

  const handleRoleChange = async (userId: string, roleIds: string[]) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/users/${userId}`, { roleIds });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                roles: roles.filter((r) => roleIds.includes(r.id)),
              }
            : u
        )
      );
      toast.success("User roles updated.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update user roles.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApprovalChange = async (userId: string, isApproved: boolean) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/users/${userId}`, { isApproved });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isApproved } : u))
      );
      toast.success(
        isApproved ? "User approved successfully." : "User approval revoked."
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update approval status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleProfileTypeChange = async (
    userId: string,
    profileTypeId: string
  ) => {
    setUpdatingId(userId);
    try {
      await api.patch(`/user-details/${userId}`, {
        details: { profileTypeId: profileTypeId || undefined },
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                detail: u.detail
                  ? {
                      ...u.detail,
                      details: {
                        ...u.detail.details,
                        ...(profileTypeId ? { profileTypeId } : {}),
                      },
                    }
                  : u.detail,
              }
            : u
        )
      );
      toast.success("User profile type updated.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile type.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSubscriptionChange = async (
    userId: string,
    status: "active" | "inactive" | "trial",
    plan?: string
  ) => {
    setUpdatingId(userId);
    try {
      const res = await api.patch(`/users/${userId}/subscription`, {
        status,
        ...(plan ? { plan } : {}),
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId && u.tenant
            ? {
                ...u,
                tenant: {
                  ...u.tenant,
                  subscriptionStatus: res.data.status,
                  subscriptionPlan: res.data.plan,
                  subscriptionPaidUntil: res.data.paidUntil,
                },
              }
            : u
        )
      );
      toast.success(
        status === "active"
          ? "Subscription marked as paid."
          : status === "trial"
            ? "Subscription moved to trial."
            : "Subscription marked as unpaid."
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update subscription.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSubModulesChange = async (
    userId: string,
    moduleName: string,
    subModules: string[]
  ) => {
    setUpdatingId(userId);
    try {
      const res = await api.patch(`/users/${userId}/sub-modules`, {
        module: moduleName,
        subModules,
      });
      const updated = res.data.details as { subModules?: SubModulesMap };
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                detail: u.detail
                  ? {
                      ...u.detail,
                      details: updated,
                    }
                  : u.detail,
              }
            : u
        )
      );
      toast.success("Sub-modules updated.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update sub-modules.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (targetUser: BackendUser) => {
    if (
      !window.confirm(
        `Delete user "${currentUserName("fullname", targetUser)}"? This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      await api.delete(`/users/${targetUser.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      if (selectedUserId === targetUser.id) {
        setSelectedUserId(null);
        if (users.length === 1 && page > 1) {
          setPage(page - 1);
        }
      }
      toast.success("User deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  const handleModuleOverride = async (
    userId: string,
    action: "add" | "remove",
    moduleTitle: string
  ) => {
    setUpdatingId(userId);
    try {
      const user = users.find((u) => u.id === userId);
      const overrides = getModuleOverrides(user!);

      const nextOverrides = { ...overrides };
      if (action === "add") {
        nextOverrides.add = [...(nextOverrides.add || []), moduleTitle];
        nextOverrides.remove = (nextOverrides.remove || []).filter(
          (m) => m !== moduleTitle
        );
      } else {
        nextOverrides.remove = [...(nextOverrides.remove || []), moduleTitle];
        nextOverrides.add = (nextOverrides.add || []).filter(
          (m) => m !== moduleTitle
        );
      }

      await api.patch(`/users/${userId}/modules`, {
        add: nextOverrides.add,
        remove: nextOverrides.remove,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                detail: u.detail
                  ? {
                      ...u.detail,
                      details: {
                        ...u.detail.details,
                        moduleOverrides: nextOverrides,
                      },
                    }
                  : u.detail,
              }
            : u
        )
      );
      toast.success("Module overrides updated.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update module overrides.");
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total > 0 ? (page - 1) * limit + 1 : 0;
  const end = Math.min(page * limit, total);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          View users across tenants and manage access, roles, subscriptions,
          plans and modules.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedUserId && selectedUser ? (
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={() => setSelectedUserId(null)}
            >
              <ArrowLeft className="size-4" />
              Back to users
            </Button>
            <div className="flex flex-col gap-6 rounded-lg border p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="grid size-11 place-items-center rounded-full bg-muted text-base font-semibold">
                        {currentUserName("fullname", selectedUser)
                          .charAt(0)
                          .toUpperCase() || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">
                          {currentUserName("fullname", selectedUser)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedUser.email}
                        </span>
                        {selectedUser.tenant && (
                          <span className="text-xs text-muted-foreground/80">
                            {selectedUser.tenant.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {selectedUser.roles.map((role) => (
                        <Badge
                          key={role.id}
                          variant="outline"
                          className={roleBadgeClass(role.name)}
                        >
                          {ROLE_LABELS[role.name as UserRole] || role.name}
                        </Badge>
                      ))}
                      {selectedUser.isApproved !== false ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          Approved
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Pending Approval
                        </Badge>
                      )}
                      {subscriptionBadge(
                        selectedUser.tenant?.subscriptionStatus
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 rounded-xl border bg-muted/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">Subscription</p>
                        <p className="text-xs text-muted-foreground">
                          Active until{" "}
                          {formatDate(
                            selectedUser.tenant?.subscriptionPaidUntil
                          ) || "N/A"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedUser.tenant?.subscriptionPlan || "none"}
                          onValueChange={(key) => {
                            if (key === "none") {
                              handleSubscriptionChange(
                                selectedUser.id,
                                "inactive"
                              );
                              return;
                            }
                            const currentStatus =
                              selectedUser.tenant?.subscriptionStatus;
                            handleSubscriptionChange(
                              selectedUser.id,
                              currentStatus === "trial"
                                ? "trial"
                                : "active",
                              key
                            );
                          }}
                          disabled={!!updatingId || !canEditSelected}
                        >
                          <SelectTrigger className="h-8 w-auto text-xs">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No plan</SelectItem>
                            {plans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.key}>
                                {plan.name}
                                {plan.durationDays
                                  ? ` (${plan.durationDays} days)`
                                  : " (Lifetime)"}
                                {plan.price ? ` - $${plan.price}` : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedUser.tenant?.subscriptionStatus === "active" ? (
                          <Button
                            size="xs"
                            variant="outline"
                            disabled={!!updatingId || !canEditSelected}
                            onClick={() =>
                              handleSubscriptionChange(
                                selectedUser.id,
                                "inactive",
                                selectedUser.tenant?.subscriptionPlan ?? undefined
                              )
                            }
                            className="h-8 px-2.5 text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                          >
                            Mark Unpaid
                          </Button>
                        ) : (
                          <Button
                            size="xs"
                            disabled={!!updatingId || !canEditSelected}
                            onClick={() =>
                              handleSubscriptionChange(
                                selectedUser.id,
                                "active",
                                selectedUser.tenant?.subscriptionPlan ?? undefined
                              )
                            }
                            className="h-8 bg-emerald-600 px-2.5 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <SectionLabel icon={ShieldCheck}>Access</SectionLabel>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {selectedUser.isApproved === false ? (
                        <Button
                          size="xs"
                          disabled={!!updatingId || !canEditSelected}
                          onClick={() =>
                            handleApprovalChange(selectedUser.id, true)
                          }
                          className="h-8 bg-emerald-600 px-2.5 text-xs font-medium text-white hover:bg-emerald-700"
                        >
                          Approve
                        </Button>
                      ) : (
                        <Button
                          size="xs"
                          variant="outline"
                          disabled={!!updatingId || !canEditSelected}
                          onClick={() =>
                            handleApprovalChange(selectedUser.id, false)
                          }
                          className="h-8 px-2.5 text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
                        >
                          Revoke
                        </Button>
                      )}
                      <Select
                        value={
                          (selectedUser.detail?.details as any)?.profileTypeId ||
                          "none"
                        }
                        onValueChange={(selectedProfileTypeId) =>
                          handleProfileTypeChange(
                            selectedUser.id,
                            selectedProfileTypeId === "none"
                              ? ""
                              : selectedProfileTypeId
                          )
                        }
                        disabled={!!updatingId || !canEditSelected}
                      >
                        <SelectTrigger className="h-8 w-auto text-xs">
                          <SelectValue placeholder="Set profile" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {profileTypes.map((pt) => (
                            <SelectItem key={pt.id} value={pt.id}>
                              {pt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        onValueChange={(selectedRoleId) => {
                          const currentIds = selectedUser.roles.map((r) => r.id);
                          const next = currentIds.includes(selectedRoleId)
                            ? currentIds.filter((id) => id !== selectedRoleId)
                            : [...currentIds, selectedRoleId];
                          handleRoleChange(selectedUser.id, next);
                        }}
                        disabled={!!updatingId || !canEditSelected}
                      >
                        <SelectTrigger className="h-8 w-auto text-xs">
                          <SelectValue placeholder="Change role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem
                              key={r.id}
                              value={r.id}
                              disabled={selectedUser.roles.some(
                                (ur) => ur.id === r.id
                              )}
                            >
                              {ROLE_LABELS[r.name as UserRole] || r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete user"
                        disabled={!canEditSelected}
                        onClick={() => handleDelete(selectedUser)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <SectionLabel icon={Blocks}>
                      Modules ({Object.keys(MODULE_PAGE_KEY).length})
                    </SectionLabel>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {modulesRows.length > 0
                        ? modulesRows.map((mod) => {
                            const on = !getModuleOverrides(
                              selectedUser
                            ).remove.includes(mod.name);
                            const userSubModules = getSubModules(selectedUser);
                            const selectedSubs = userSubModules[mod.name] ?? [];
                            const selectedCount = selectedSubs.length;
                            return (
                              <div
                                key={mod.id}
                                className="flex flex-col gap-2 rounded-lg border border-border bg-background px-3 py-2.5"
                              >
                                <button
                                  type="button"
                                  disabled={!!updatingId || !canEditSelected}
                                  onClick={() =>
                                    handleModuleOverride(
                                      selectedUser.id,
                                      on ? "remove" : "add",
                                      mod.name
                                    )
                                  }
                                  className="flex items-center justify-between gap-2 text-sm hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <span className="font-medium">{mod.name}</span>
                                  <Toggle checked={on} />
                                </button>
                                {on &&
                                  mod.subModules.length > 0 && (
                                    <div className="flex flex-col gap-1.5 pl-0.5">
                                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                                        Sub-modules ({selectedCount}/{mod.subModules.length})
                                      </p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {mod.subModules.map((sub) => {
                                          const isActive =
                                            selectedSubs.includes(sub);
                                          return (
                                            <button
                                              key={sub}
                                              type="button"
                                              disabled={
                                                !!updatingId ||
                                                !canEditSelected
                                              }
                                              onClick={() => {
                                                const next = isActive
                                                  ? selectedSubs.filter(
                                                      (s) => s !== sub
                                                    )
                                                  : [...selectedSubs, sub];
                                                handleSubModulesChange(
                                                  selectedUser.id,
                                                  mod.name,
                                                  next
                                                );
                                              }}
                                              className={cn(
                                                "rounded-full border px-2.5 py-1 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                isActive
                                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                                  : "border-border bg-muted/30 text-muted-foreground hover:bg-accent/40"
                                              )}
                                            >
                                              {sub}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            );
                          })
                        : Object.keys(MODULE_PAGE_KEY).map((module) => {
                            const on = !getModuleOverrides(
                              selectedUser
                            ).remove.includes(module);
                            return (
                              <button
                                key={module}
                                type="button"
                                disabled={!!updatingId || !canEditSelected}
                                onClick={() =>
                                  handleModuleOverride(
                                    selectedUser.id,
                                    on ? "remove" : "add",
                                    module
                                  )
                                }
                                className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-accent/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="font-medium">{module}</span>
                                <Toggle checked={on} />
                              </button>
                            );
                          })}
                    </div>
                  </div>
                </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="pl-9"
                />
              </div>

              {loading ? (
                <p className="text-sm text-muted-foreground">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users found.</p>
              ) : (
                <>
                  <div className="flex flex-col divide-y divide-border rounded-lg border">
                    {users.map((u) => {
                      const fullName = currentUserName("fullname", u);
                      const initial =
                        fullName.trim().charAt(0).toUpperCase() || "U";
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setSelectedUserId(u.id)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/40"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">
                              {initial}
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="truncate text-sm font-medium">
                                {fullName}
                              </span>
                              <span className="truncate text-xs text-muted-foreground">
                                {u.email}
                              </span>
                              {u.tenant && (
                                <span className="truncate text-[11px] text-muted-foreground/80">
                                  {u.tenant.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {u.roles.slice(0, 2).map((role) => (
                              <Badge
                                key={role.id}
                                variant="outline"
                                className={roleBadgeClass(role.name)}
                              >
                                {ROLE_LABELS[role.name as UserRole] ||
                                  role.name}
                              </Badge>
                            ))}
                            {u.roles.length > 2 && (
                              <Badge variant="outline">
                                +{u.roles.length - 2}
                              </Badge>
                            )}
                            {subscriptionBadge(u.tenant?.subscriptionStatus)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      Showing {start}–{end} of {total}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft className="size-4" />
                        Prev
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
      </CardContent>
    </Card>
  );
}