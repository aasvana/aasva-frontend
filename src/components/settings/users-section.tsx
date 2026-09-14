"use client";

import { useEffect, useState } from "react";
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
import { MODULE_PAGE_KEY } from "@/constants/pages";

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

type BackendUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: BackendRole[];
  detail: BackendUserDetail | null;
  createdAt: string;
  updatedAt: string;
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

export function UsersSection() {
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [roles, setRoles] = useState<BackendRole[]>([]);
  const [profileTypes, setProfileTypes] = useState<BackendProfileType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
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

  const handleProfileTypeChange = async (userId: string, profileTypeId: string) => {
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
                        ...(profileTypeId
                          ? { profileTypeId }
                          : {}),
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

  const handleDelete = async (targetUser: BackendUser) => {
    if (!window.confirm(`Delete user "${currentUserName("fullname", targetUser)}"? This cannot be undone.`)) {
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
      const currentDetails = user?.detail?.details as
        | { moduleOverrides?: { add: string[]; remove: string[] } }
        | undefined;
      const currentOverrides = currentDetails?.moduleOverrides || {
        add: [],
        remove: [],
      };

      const nextOverrides = { ...currentOverrides };
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
                      details: { moduleOverrides: nextOverrides },
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          View all onboarded users and manage their roles.
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
              const canEdit = isSystemAdmin || u.id !== user?.id;
              const isUserSystemAdmin = u.roles.some(
                (role) => role.name === "systemadmin"
              );

              return (
                <div
                  key={u.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.roles.map((role) => (
                      <Badge
                        key={role.id}
                        variant="outline"
                        className={roleBadgeClass(role.name)}
                      >
                        {ROLE_LABELS[role.name] || role.name}
                      </Badge>
                    ))}
                    {u.detail?.details?.profileTypeId && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border border-blue-200">
                        {profileTypes.find((pt) => pt.id === u.detail!.details!.profileTypeId)?.name || u.detail!.details!.profileTypeId}
                      </Badge>
                    )}
                    {canEdit && !isUserSystemAdmin && (
                      <Select
                        onValueChange={(selectedProfileTypeId) => {
                          const next = selectedProfileTypeId === "none" ? "" : selectedProfileTypeId;
                          handleProfileTypeChange(u.id, next || "");
                        }}
                        disabled={updatingId === u.id}
                      >
                        <SelectTrigger className="w-auto h-8 text-xs">
                          <SelectValue placeholder="Change profile" />
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
                    )}
                    {canEdit && !isUserSystemAdmin && (
                      <div className="flex items-center gap-1">
                        <Select
                          onValueChange={(moduleTitle) => {
                            handleModuleOverride(u.id, "add", moduleTitle);
                          }}
                          disabled={updatingId === u.id}
                        >
                          <SelectTrigger className="w-auto h-8 text-xs">
                            <SelectValue placeholder="+ Module" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(MODULE_PAGE_KEY).map((module) => (
                              <SelectItem key={module} value={module}>
                                {module}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          onValueChange={(moduleTitle) => {
                            handleModuleOverride(u.id, "remove", moduleTitle);
                          }}
                          disabled={updatingId === u.id}
                        >
                          <SelectTrigger className="w-auto h-8 text-xs">
                            <SelectValue placeholder="- Module" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(MODULE_PAGE_KEY).map((module) => (
                              <SelectItem key={module} value={module}>
                                {module}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {canEdit && !isUserSystemAdmin && (
                      <Select
                        onValueChange={(selectedRoleId) => {
                          const currentIds = u.roles.map((r) => r.id);
                          const next = currentIds.includes(selectedRoleId)
                            ? currentIds.filter((id) => id !== selectedRoleId)
                            : [...currentIds, selectedRoleId];
                          handleRoleChange(u.id, next);
                        }}
                        disabled={updatingId === u.id}
                      >
                        <SelectTrigger className="w-auto h-8 text-xs">
                          <SelectValue placeholder="Change roles" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((r) => (
                            <SelectItem key={r.id} value={r.id}>
                              {ROLE_LABELS[r.name] || r.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {canEdit && !isUserSystemAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete user"
                        onClick={() => handleDelete(u)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
