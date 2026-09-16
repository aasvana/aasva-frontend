'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useApiRequest } from "@/hooks/useRequestHandler";
import { getNextOnboardingRoute } from "@/helpers/pageAccess";
import { useAuthStore } from "@/stores/AuthStore";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { request } = useApiRequest();
  const setAuth = useAuthStore((state) => state.setAuth);

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await request(
        {
          method: 'POST',
          url: '/auth/login',
          showToast: false,
        },
        data
      );
    },
    retry: 0,
    onSuccess: (res: any) => {
      const { accessToken, refreshToken, user, subscription } = res?.data || {};
      if (accessToken) {
        setAuth(accessToken, refreshToken, user, subscription);
        toast.success('Logged in successfully!');
        router.push(getNextOnboardingRoute());
      }
    },
    onError: (err: any) => toast.error(err.message),
  });
  

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Seamless Login for Exclusive Access
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">Power up your access with our smart, lightning-fast login. Designed for speed. Built for you. To effortlessly access your account.</p>
          <p className="text-sm mt-12 text-slate-500">Don&apos;t have an account <Link href="/signup" className="text-emerald-600 font-medium hover:underline ml-1">Register here</Link></p>
        </div>

        <form
          className="max-w-md md:ml-auto w-full"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">
            Sign in
          </h3>
          <div className="space-y-6">
            <div>
              <label className='text-sm text-slate-800 font-medium mb-2 block'>Email</label>
              <input
                type="email"
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                placeholder="Enter Email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className='text-sm text-slate-800 font-medium block'>Password</label>
                <Link href="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-500 font-medium">
                  Forgot your password?
                </Link>
              </div>
              <input
                type="password"
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                placeholder="Enter Password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-2">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">
                  Remember me
                </label>
              </div>
            </div>
          </div>

          <div className="!mt-12">
            <button
              type="submit"
              className="w-full cursor-pointer shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="my-4 flex items-center gap-4">
            <hr className="w-full border-slate-300" />
            <p className="text-sm text-slate-800 text-center">or</p>
            <hr className="w-full border-slate-300" />
          </div>

          <GoogleAuthButton />
        </form>
      </div>
    </div>
  );
};
