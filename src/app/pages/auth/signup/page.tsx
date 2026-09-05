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

const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type SignupFormData = z.infer<typeof signupSchema>;

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });
  const { request } = useApiRequest();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const pushData = {
        firstName: data.name.split(' ')[0] || data.name,
        lastName: data.name.split(' ').slice(1).join(' ') || data.name.split(' ')[0] || data.name,
        email: data.email,
        password: data.password,
      };
      return await request(
        {
          method: 'POST',
          url: '/auth/register',
          showToast: false,
        },
        pushData
      );
    },
    retry: 0,
    onSuccess: (res: any) => {
      const { accessToken, refreshToken, user } = res?.data || {};
      if (accessToken) {
        setAuth(accessToken, refreshToken, user);
      }
      toast.success('Account created successfully!');
      router.push(getNextOnboardingRoute());
    },
    onError: (err: any) => toast.error(err.message),
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex fle-col items-center justify-center py-6 px-4">
      <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl max-md:max-w-md w-full">
        <div>
          <h2 className="lg:text-5xl text-3xl font-bold lg:leading-[57px] text-slate-900">
            Join Us &amp; Unlock Endless Possibilities
          </h2>
          <p className="text-sm mt-6 text-slate-500 leading-relaxed">Create your account in seconds and start exploring everything our platform has to offer. Simple, secure, and built for you.</p>
          <p className="text-sm mt-12 text-slate-500">Already have an account? <Link href="/login" className="text-emerald-600 font-medium hover:underline ml-1">Login</Link></p>
        </div>

        <form
          className="max-w-md md:ml-auto w-full"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h3 className="text-slate-900 lg:text-3xl text-2xl font-bold mb-8">
            Create account
          </h3>

          <div className="space-y-6">
            <div>
              <label className='text-sm text-slate-800 font-medium mb-2 block'>Full Name</label>
              <input
                type="text"
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                placeholder="Enter your full name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>
              )}
            </div>
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
              <label className='text-sm text-slate-800 font-medium mb-2 block'>Password</label>
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
            <div>
              <label className='text-sm text-slate-800 font-medium mb-2 block'>Confirm Password</label>
              <input
                type="password"
                className="bg-slate-100 w-full text-sm text-slate-800 px-4 py-3 rounded-md outline-none border focus:border-emerald-600 focus:bg-transparent"
                placeholder="Enter Password Again"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-2">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-start">
                <input
                  id="accept-terms"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <label htmlFor="accept-terms" className="ml-3 block text-sm text-slate-500">
                  By creating an account, you accept our <Link href='#' className="text-emerald-600 underline">terms and condition</Link>.
                </label>
              </div>
            </div>
          </div>

          <div className="!mt-12">
            <button
              type="submit"
              className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold cursor-pointer rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? 'Creating account...' : 'Sign up'}
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

export default SignUpPage;
