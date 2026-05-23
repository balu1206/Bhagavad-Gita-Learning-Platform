'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Eye, EyeOff, Mail, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useToast } from '@/components/ui/Toast/Toast';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // BUG-004: Add visible error state on the form itself, not just toast
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      // BUG-004: Handle all failure modes — error, !ok, undefined result
      if (!result || result.error || !result.ok) {
        const msg = 'Invalid email or password. Please try again.';
        setAuthError(msg);
        toast({ variant: 'error', message: 'Login failed', description: msg });
        return;
      }

      toast({ variant: 'success', message: 'Welcome back!' });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('[Login] Sign-in error:', err);
      const msg = 'Something went wrong. Please try again in a moment.';
      setAuthError(msg);
      toast({ variant: 'error', message: 'Sign-in error', description: msg });
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-dark-900 dark:text-white mb-2">
          Welcome back
        </h1>
        <p className="text-dark-500 dark:text-dark-400">
          Continue your journey through the Gita
        </p>
      </div>

      {/* Google OAuth */}
      <Button
        variant="ghost"
        fullWidth
        size="lg"
        onClick={handleGoogleLogin}
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
            or continue with email
          </span>
        </div>
      </div>

      {/* Email form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* BUG-004: Visible auth error display */}
        {authError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail className="w-4 h-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
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
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isSubmitting}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-dark-500 dark:text-dark-400 text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-saffron-600 hover:text-saffron-700 dark:text-saffron-400 font-medium transition-colors"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
