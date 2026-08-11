"use client";

import * as React from "react";
import { useState } from "react";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brand } from "@/constants/brand";
import { cn } from "@/lib/utils";

function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "block size-4 rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium leading-none">{title}</span>
        <span className="text-sm text-muted-foreground leading-snug">
          {description}
        </span>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function CardActions({ onSave }: { onSave: () => void }) {
  return (
    <CardFooter className="justify-end gap-2 border-t px-6 py-4">
      <Button type="button" onClick={onSave}>
        Save Changes
      </Button>
    </CardFooter>
  );
}

const notifySaved = (what: string) =>
  toast.success(`${what} updated successfully!`);

export function UserProfileSection() {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("m@example.com");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("admin");

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>
          Manage your personal information and how others see you.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {name.trim().charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-sm text-muted-foreground">{email}</span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Role">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Email Address">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Phone Number">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
        </div>
      </CardContent>
      <CardActions onSave={() => notifySaved("Profile")} />
    </Card>
  );
}

export function CompanyProfileSection() {
  const [companyName, setCompanyName] = useState(brand.travelName);
  const [contactEmail, setContactEmail] = useState(brand.contact.email);
  const [phone, setPhone] = useState(brand.contact.mobile);
  const [address, setAddress] = useState(brand.contact.address);
  const [website, setWebsite] = useState(brand.url);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <CardDescription>
          Company details shown on your vouchers, invoices and documents.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field label="Company Name">
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Contact Email">
            <Input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
        </div>
        <Field label="Address">
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Field>
        <Field label="Website">
          <Input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </Field>
      </CardContent>
      <CardActions onSave={() => notifySaved("Company profile")} />
    </Card>
  );
}

export function AppearanceSection() {
  const [theme, setTheme] = useState("system");
  const [compactMode, setCompactMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how the application looks and feels for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field label="Theme">
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-full sm:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Separator />
        <div className="flex flex-col gap-5">
          <SettingToggle
            title="Compact Mode"
            description="Show more content on screen by reducing spacing."
            checked={compactMode}
            onCheckedChange={setCompactMode}
          />
          <SettingToggle
            title="Reduce Motion"
            description="Minimize animations and transitions across the app."
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
          />
        </div>
      </CardContent>
      <CardActions onSave={() => notifySaved("Appearance")} />
    </Card>
  );
}

type Member = { name: string; email: string; role: string };

const initialMembers: Member[] = [
  { name: "Admin", email: "m@example.com", role: "admin" },
  { name: "Aquib Shahbaz", email: "aquib@example.com", role: "manager" },
];

const roleBadgeClass = (role: string) =>
  role === "admin"
    ? "bg-primary/10 text-primary"
    : role === "manager"
    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
    : "bg-muted text-muted-foreground";

export function TeamSection() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address.");
      return;
    }
    setMembers((prev) => [
      ...prev,
      { name: inviteEmail, email: inviteEmail, role: inviteRole },
    ]);
    setInviteEmail("");
    toast.success("Invitation sent successfully!");
  };

  const handleRemove = (email: string) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
    toast.success("Member removed.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team & Members</CardTitle>
        <CardDescription>
          Invite people to your workspace and manage their access.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <Field label="Invite by Email" className="flex-1">
            <Input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@example.com"
            />
          </Field>
          <Field label="Role" className="sm:w-40">
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Button onClick={handleInvite}>
            <Plus className="size-4" />
            Invite
          </Button>
        </div>

        <div className="flex flex-col divide-y divide-border rounded-lg border">
          {members.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{member.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {member.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={roleBadgeClass(member.role)}>
                  {member.role}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove member"
                  onClick={() => handleRemove(member.email)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function BillingSection() {
  const [plan, setPlan] = useState("pro");
  const [billingEmail, setBillingEmail] = useState("billing@example.com");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Plans</CardTitle>
        <CardDescription>
          Manage your subscription, payment method and invoices.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Current Plan</span>
            <span className="text-lg font-semibold capitalize">{plan}</span>
            <span className="text-sm text-muted-foreground">
              Renews monthly · $49.00 / month
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setPlan((prev) => (prev === "pro" ? "enterprise" : "pro"));
              notifySaved("Plan");
            }}
          >
            Upgrade to Enterprise
          </Button>
        </div>
        <Field label="Billing Email">
          <Input
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
          />
        </Field>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Payment Method</span>
            <span className="text-sm text-muted-foreground">
              Visa ending in 4242
            </span>
          </div>
          <Button variant="outline">Update Card</Button>
        </div>
      </CardContent>
      <CardActions onSave={() => notifySaved("Billing")} />
    </Card>
  );
}

type ApiKey = { label: string; key: string };

const initialApiKeys: ApiKey[] = [
  { label: "Production", key: "xm_live_8f2a…9d1c" },
  { label: "Development", key: "xm_test_3b7e…44aa" },
];

export function IntegrationsSection() {
  const [keys, setKeys] = useState<ApiKey[]>(initialApiKeys);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = () => {
    const key = `xm_${Math.random().toString(36).slice(2, 10)}…${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    setKeys((prev) => [
      ...prev,
      { label: `Key ${prev.length + 1}`, key },
    ]);
    toast.success("New API key generated!");
  };

  const handleCopy = (key: string) => {
    navigator.clipboard?.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const handleDelete = (key: string) => {
    setKeys((prev) => prev.filter((k) => k.key !== key));
    toast.success("API key revoked.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations & API</CardTitle>
        <CardDescription>
          Manage API keys for connecting external applications.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col divide-y divide-border rounded-lg border">
          {keys.map((k) => (
            <div
              key={k.key}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{k.label}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {k.key}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Copy key"
                  onClick={() => handleCopy(k.key)}
                >
                  {copied === k.key ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete key"
                  onClick={() => handleDelete(k.key)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleGenerate}>
          <Plus className="size-4" />
          Generate API Key
        </Button>
      </CardContent>
    </Card>
  );
}

export function NotificationsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what updates you want to receive and how.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <SettingToggle
          title="Email Notifications"
          description="Receive notifications via email."
          checked={emailNotifs}
          onCheckedChange={setEmailNotifs}
        />
        <SettingToggle
          title="Push Notifications"
          description="Get real-time alerts in your browser."
          checked={pushNotifs}
          onCheckedChange={setPushNotifs}
        />
        <SettingToggle
          title="Product Updates"
          description="News about new features and improvements."
          checked={productUpdates}
          onCheckedChange={setProductUpdates}
        />
        <SettingToggle
          title="Weekly Digest"
          description="A summary of your workspace activity every week."
          checked={weeklyDigest}
          onCheckedChange={setWeeklyDigest}
        />
      </CardContent>
      <CardActions onSave={() => notifySaved("Notification preferences")} />
    </Card>
  );
}

export function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (!newPassword) {
      toast.error("Please enter a new password.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    notifySaved("Password");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Protect your account with a strong password and two-factor auth.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4">
          <Field label="Current Password">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="New Password">
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Field>
            <Field label="Confirm New Password">
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
          </div>
          <div>
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        </div>
        <Separator />
        <SettingToggle
          title="Two-Factor Authentication"
          description="Require a one-time code in addition to your password."
          checked={twoFactor}
          onCheckedChange={setTwoFactor}
        />
      </CardContent>
    </Card>
  );
}
