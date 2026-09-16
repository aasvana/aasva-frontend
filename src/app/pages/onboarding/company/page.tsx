'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { brand } from "@/constants/brand";
import { usePageAccessStore } from "@/stores/pageAccessStore";
import { useAuthStore } from "@/stores/AuthStore";
import { getNextOnboardingRoute, isSystemAdmin } from "@/helpers/pageAccess";
import { getSessionState, useSessionRestore } from "@/hooks/useSessionRestore";
import { useApiRequest } from "@/hooks/useRequestHandler";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from "sonner";
import { z } from "zod";

const companySchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  shortName: z.string().optional(),
  email: z
    .string()
    .email('Enter a valid email address')
    .or(z.literal(''))
    .optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().optional(),
  tagline: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const CompanyOnboardingPage = () => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const lastUserId = useAuthStore((state) => state.lastUserId);
  const role = useAuthStore((state) => state.role);
  const modules = useAuthStore((state) => state.modules);
  const companyComplete = useAuthStore((state) => state.companyComplete);
  const setCompanyComplete = useAuthStore((state) => state.setCompanyComplete);
  const access = usePageAccessStore((state) => state.access);
  const { restoring } = useSessionRestore();
  const { request } = useApiRequest();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  useEffect(() => {
    if (getSessionState() === 'restoring') return;

    if (isSystemAdmin()) {
      router.replace('/dashboard');
      return;
    }

    if (!token) {
      router.replace(
        user || lastUserId || role || modules.length > 0 ? '/login' : '/'
      );
      return;
    }

    if (!(access["company-onboarding"] ?? true) || companyComplete) {
      router.replace(getNextOnboardingRoute());
    }
  }, [access, router, token, user, lastUserId, role, modules, companyComplete]);

  const onboardMutation = useMutation({
    mutationFn: async (data: CompanyFormData) => {
      const payload = Object.fromEntries(
        Object.entries(data).filter(
          ([, value]) => value !== undefined && value !== ''
        )
      );
      return await request(
        {
          method: 'POST',
          url: '/company/onboarding',
          showToast: false,
        },
        payload
      );
    },
    retry: 0,
    onSuccess: () => {
      setCompanyComplete(true);
      toast.success('Company profile saved!');
      router.push(getNextOnboardingRoute());
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (restoring || !token || companyComplete) return null;

  const onSubmit = (data: CompanyFormData) => {
    if (submitting) return;
    setSubmitting(true);
    onboardMutation.mutate(data, {
      onSettled: () => setSubmitting(false),
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-primary-100 px-4 py-10">
      <div className="max-w-3xl w-full mx-auto my-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Welcome to {brand.name}
          </span>
          <h1 className="mt-5 text-slate-900 text-3xl sm:text-4xl font-bold">
            Set up your company
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Tell us about your business so your profile, documents, and
            invoices carry your identity. You can change all of this later in
            Settings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-white rounded-2xl border p-6 sm:p-8 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">
                Company name
              </label>
              <input
                type="text"
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                placeholder="Enter your company name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-slate-800 font-medium mb-2 block">
                  Short name
                </label>
                <input
                  type="text"
                  className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                  placeholder="Optional abbreviation"
                  {...register('shortName')}
                />
              </div>
              <div>
                <label className="text-sm text-slate-800 font-medium mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                  placeholder="admin@yourcompany.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm text-slate-800 font-medium mb-2 block">
                  Phone
                </label>
                <input
                  type="tel"
                  className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                  placeholder="+91 00000 00000"
                  {...register('phone')}
                />
              </div>
              <div>
                <label className="text-sm text-slate-800 font-medium mb-2 block">
                  Website
                </label>
                <input
                  type="url"
                  className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                  placeholder="https://yourcompany.com"
                  {...register('website')}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">
                Address
              </label>
              <input
                type="text"
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                placeholder="Registered business address"
                {...register('address')}
              />
            </div>

            <div>
              <label className="text-sm text-slate-800 font-medium mb-2 block">
                Tagline
              </label>
              <textarea
                rows={3}
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent resize-none"
                placeholder="A short line that describes your business"
                {...register('tagline')}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto cursor-pointer shadow-xl py-2.5 px-8 text-sm font-semibold rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Not ready?{" "}
          <Link href="/dashboard" className="text-emerald-600 font-medium hover:underline">
            Explore the full dashboard
          </Link>{" "}
          or{" "}
          <Link href="/login" className="text-emerald-600 font-medium hover:underline">
            sign in with a different account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CompanyOnboardingPage;