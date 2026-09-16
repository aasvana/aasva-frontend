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
  ChevronDown,
  CreditCard,
  Trash2,
  Blocks,
  ShieldCheck,
  UserCog,
} from "lucide-react";

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

type ModuleOverrides = {
  add: string[];
  remove: string[];
};

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
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [openUserId, setOpenUserId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const isSystemAdmin = user?.roles?.some((r) => r.name === "systemadmin");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [usersRes, rolesRes, profileTypesRes] = await Promise.all([
          api.get("/users"),
          api.get("/roles"),
          api.get("/profile-types"),
        ]);

        if (!cancelled) {
          setUsers(usersRes.data.items);
          setRoles(rolesRes.data);
          setProfileTypes(profileTypesRes.data);
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

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isSystemAdmin) {
    return null;
  }

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
    status: "active" | "inactive"
  ) => {
    setUpdatingId(userId);
    try {
      const res = await api.patch(`/users/${userId}/subscription`, {
        status,
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
          : "Subscription marked as unpaid."
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update subscription.");
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
                detail: {
                  id: u.detail?.id ?? "",
                  userId: u.id,
                  dateOfBirth: u.detail?.dateOfBirth ?? null,
                  phone: u.detail?.phone ?? null,
                  address: u.detail?.address ?? null,
                  details: {
                    ...(u.detail?.details ?? {}),
                    moduleOverrides: nextOverrides,
                  },
                },
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          View all users across tenants and manage access, roles, subscriptions
          and modules.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users found.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-lg border">
            {users.map((u) => {
              const fullName = currentUserName("fullname", u);
              const initial = fullName.trim().charAt(0).toUpperCase() || "U";
              const isUserSystemAdmin = u.roles.some(
                (role) => role.name === "systemadmin"
              );
              const canEdit = u.id !== user?.id && !isUserSystemAdmin;
              const isOpen = openUserId === u.id;

              return (
                <div key={u.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setOpenUserId(isOpen ? null : u.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-accent/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold">
                        {initial}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{fullName}</span>
                        <span className="text-xs text-muted-foreground">
                          {u.email}
                        </span>
                        {u.tenant && (
                          <span className="text-[11px] text-muted-foreground/80">
                            {u.tenant.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {u.roles.map((role) => (
                        <Badge
                          key={role.id}
                          variant="outline"
                          className={roleBadgeClass(role.name)}
                        >
                          {ROLE_LABELS[role.name as UserRole] || role.name}
                        </Badge>
                      ))}
                      {u.isApproved !== false ? (
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
                      {subscriptionBadge(u.tenant?.subscriptionStatus)}
                      <ChevronDown
                        className={`size-4 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="flex flex-col gap-5 border-t border-border bg-muted/20 px-4 py-4">
                      <div>
                        <SectionLabel icon={CreditCard}>
                          Subscription
                        </SectionLabel>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            Plan:{" "}
                            <span className="text-foreground font-medium">
                              {u.tenant?.subscriptionPlan || "None"}
                            </span>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Paid until:{" "}
                            <span className="text-foreground font-medium">
                              {formatDate(u.tenant?.subscriptionPaidUntil) ||
                                "N/A"}
                            </span>
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="xs"
                              disabled={updatingId === u.id}
                              onClick={() =>
                                handleSubscriptionChange(u.id, "active")
                              }
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-8 px-2.5 text-xs"
                            >
                              Mark Paid
                            </Button>
                            <Button
                              size="xs"
                              variant="outline"
                              disabled={updatingId === u.id}
                              onClick={() =>
                                handleSubscriptionChange(u.id, "inactive")
                              }
                              className="text-rose-700 border-rose-300 hover:bg-rose-50 h-8 px-2 text-xs"
                            >
                              Mark Unpaid
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <SectionLabel icon={ShieldCheck}>Access</SectionLabel>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {u.isApproved === false ? (
                            <Button
                              size="xs"
                              onClick={() =>
                                handleApprovalChange(u.id, true)
                              }
                              disabled={updatingId === u.id || !canEdit}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-8 px-2.5 text-xs"
                            >
                              Approve
                            </Button>
                          ) : (
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() =>
                                handleApprovalChange(u.id, false)
                              }
                              disabled={updatingId === u.id || !canEdit}
                              className="text-amber-700 border-amber-300 hover:bg-amber-50 h-8 px-2 text-xs"
                            >
                              Revoke
                            </Button>
                          )}
                          <Select
                            value={
                              (u.detail?.details as any)?.profileTypeId || ""
                            }
                            onValueChange={(selectedProfileTypeId) => {
                              const next =
                                selectedProfileTypeId === "none"
                                  ? ""
                                  : selectedProfileTypeId;
                              handleProfileTypeChange(u.id, next || "");
                            }}
                            disabled={updatingId === u.id || !canEdit}
                          >
                            <SelectTrigger className="w-auto h-8 text-xs">
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
                              const currentIds = u.roles.map((r) => r.id);
                              const next = currentIds.includes(selectedRoleId)
                                ? currentIds.filter(
                                    (id) => id !== selectedRoleId
                                  )
                                : [...currentIds, selectedRoleId];
                              handleRoleChange(u.id, next);
                            }}
                            disabled={updatingId === u.id || !canEdit}
                          >
                            <SelectTrigger className="w-auto h-8 text-xs">
                              <SelectValue placeholder="Change role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((r) => (
                                <SelectItem
                                  key={r.id}
                                  value={r.id}
                                  disabled={u.roles.some(
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
                            disabled={!canEdit}
                            onClick={() => handleDelete(u)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <SectionLabel icon={Blocks}>
                          Modules ({Object.keys(MODULE_PAGE_KEY).length})
                        </SectionLabel>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {Object.keys(MODULE_PAGE_KEY).map((module) => {
                            const on = !getModuleOverrides(u).remove.includes(
                              module
                            );
                            return (
                              <button
                                key={module}
                                type="button"
                                disabled={updatingId === u.id || !canEdit}
                                onClick={() =>
                                  handleModuleOverride(
                                    u.id,
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

                      <div>
                        <SectionLabel icon={UserCog}>Profile</SectionLabel>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {u.detail?.details
                            ? JSON.stringify(u.detail.details)
                            : "No additional profile settings."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}