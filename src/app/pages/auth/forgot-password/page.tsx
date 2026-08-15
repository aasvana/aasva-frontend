'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiRequest } from "@/hooks/useRequestHandler";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { request } = useApiRequest();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const pushData = {
        email: data.email,
        provider: 'email',
        passport: 'forgot-password',
      };
      return await request(
        {
          method: 'POST',
          url: '/auth',
          showToast: false,
        },
        pushData
      );
    },
    retry: 0,
    onSuccess: (_res: any, variables) => {
      toast.success('Password reset link sent!');
      setSubmittedEmail(variables.email);
    },
    onError: (err: any) => toast.error(err.message),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Forgot Your Password?
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">No worries, it happens to the best of us. Enter your registered email and we&apos;ll send you a link to reset your password.</p>
          <p className="text-sm mt-12 text-slate-500">Remembered your password? <Link href="/login" className="text-emerald-600 font-medium hover:underline ml-1">Back to Login</Link></p>
        </div>

        {submittedEmail ? (
          <div className="max-w-md md:ml-auto w-full bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <MailCheck className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="mt-6 text-slate-900 text-xl font-bold">
              Check your inbox
            </h3>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              If an account exists for <span className="font-medium text-slate-800">{submittedEmail}</span>, you&apos;ll receive a password reset link shortly.
            </p>
            <button
              type="button"
              onClick={() => setSubmittedEmail(null)}
              className="mt-6 w-full cursor-pointer shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
            >
              Try another email
            </button>
            <p className="mt-4 text-sm text-slate-500">
              <Link href="/login" className="text-emerald-600 font-medium hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        ) : (
          <form
            className="max-w-md md:ml-auto w-full"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">
              Reset password
            </h3>

            <div className="space-y-6">
              <div>
                <label className='text-sm text-slate-800 font-medium mb-2 block'>Email</label>
                <input
                  type="email"
                  className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                  placeholder="Enter your registered email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="!mt-12">
              <button
                type="submit"
                className="w-full cursor-pointer shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? 'Sending link...' : 'Send reset link'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
