'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useToast } from '@/components/ui/Toast/Toast';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Include at least one uppercase letter')
    .regex(/[0-9]/, 'Include at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface StrengthRule {
  label: string;
  test: (p: string) => boolean;
}

const STRENGTH_RULES: StrengthRule[] = [
  { label: '8+ characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function PasswordStrengthMeter({ password }: { password: string }) {
  const passed = STRENGTH_RULES.filter((r) => r.test(password)).length;
  const pct = password.length === 0 ? 0 : passed / STRENGTH_RULES.length;

  const color =
    pct <= 0.25 ? 'bg-red-500' :
    pct <= 0.5 ? 'bg-orange-500' :
    pct <= 0.75 ? 'bg-yellow-500' : 'bg-green-500';

  const label =
    password.length === 0 ? '' :
    pct <= 0.25 ? 'Weak' :
    pct <= 0.5 ? 'Fair' :
    pct <= 0.75 ? 'Good' : 'Strong';

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="flex gap-1">
        {STRENGTH_RULES.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              i < passed ? color : 'bg-warm-200 dark:bg-dark-700',
            )}
          />
        ))}
        {label && (
          <span className={cn(
            'text-xs font-medium ml-2',
            pct <= 0.25 ? 'text-red-500' :
            pct <= 0.5 ? 'text-orange-500' :
            pct <= 0.75 ? 'text-yellow-600' : 'text-green-600',
          )}>
            {label}
          </span>
        )}
      </div>
      {/* Rules */}
      {password.length > 0 && (
        <ul className="grid grid-cols-2 gap-1">
          {STRENGTH_RULES.map((rule) => (
            <li key={rule.label} className="flex items-center gap-1.5">
              <CheckCircle2
                className={cn(
                  'w-3.5 h-3.5 flex-shrink-0',
                  rule.test(password) ? 'text-green-500' : 'text-warm-300 dark:text-dark-600',
                )}
              />
              <span className={cn(
                'text-xs',
                rule.test(password)
                  ? 'text-dark-600 dark:text-dark-300'
                  : 'text-dark-400 dark:text-dark-500',
              )}>
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // keep strength meter in sync
  const watchedPassword = watch('password', '');
  const currentPassword = passwordValue || watchedPassword;

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const body = await res.json() as { error?: string };
        toast({ variant: 'error', message: 'Registration failed', description: body.error ?? 'Something went wrong. Please try again.' });
        return;
      }

      // Auto-login after registration
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({ variant: 'success', message: 'Account created! Please sign in.' });
        router.push('/login');
      } else {
        toast({ variant: 'success', message: 'Welcome to Gita Learning!' });
        router.push('/dashboard');
      }
    },
    [toast, router],
  );

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-dark-900 dark:text-white mb-2">
          Begin your journey
        </h1>
        <p className="text-dark-500 dark:text-dark-400">
          Create your free account to explore the Bhagavad Gita
        </p>
      </div>

      {/* Google OAuth */}
      <Button
        variant="ghost"
        fullWidth
        size="lg"
        onClick={handleGoogleRegister}
        isLoading={isGoogleLoading}
        className="mb-6"
      >
        <Globe className="w-5 h-5" />
        Continue with Google
      </Button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-warm-200 dark:border-dark-700" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-warm-50 dark:bg-dark-900 text-dark-400 text-sm">
            or register with email
          </span>
        </div>
      </div>

      {/* Register form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Arjuna Kumar"
          leftIcon={<User className="w-4 h-4" />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            leftIcon={<Lock className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-dark-400 hover:text-dark-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register('password', {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordValue(e.target.value),
            })}
          />
          <PasswordStrengthMeter password={currentPassword} />
        </div>

        <Input
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-dark-400 hover:text-dark-600 transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isSubmitting}
          className="mt-2"
        >
          Create Account
        </Button>

        <p className="text-center text-xs text-dark-400 dark:text-dark-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-saffron-600">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline hover:text-saffron-600">Privacy Policy</Link>.
        </p>
      </form>

      <p className="text-center text-dark-500 dark:text-dark-400 text-sm mt-6">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
