'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // Placeholder: In Phase 7+ we'll implement actual email sending
    await new Promise((r) => setTimeout(r, 800));
    setSubmittedEmail(data.email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="animate-fade-in text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-serif text-3xl text-dark-900 dark:text-white mb-3">
          Check your email
        </h1>
        <p className="text-dark-500 dark:text-dark-400 mb-2">
          If an account exists for <strong>{submittedEmail}</strong>, we&apos;ve sent password reset instructions.
        </p>
        <p className="text-dark-400 text-sm mb-8">
          Didn&apos;t receive it? Check your spam folder.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-saffron-600 hover:text-saffron-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
        <h1 className="font-serif text-3xl text-dark-900 dark:text-white mb-2">
          Forgot your password?
        </h1>
        <p className="text-dark-500 dark:text-dark-400">
          Enter your email and we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>
    </div>
  );
}
