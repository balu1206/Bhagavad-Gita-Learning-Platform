import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from './prisma';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any) as NextAuthOptions['adapter'],
  // BUG-004: Explicit secret for production deployment
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // BUG-004: Better error handling and logging for login failures
        try {
          const parsed = credentialsSchema.safeParse(credentials);
          if (!parsed.success) {
            console.warn('[Auth] Invalid credentials format');
            return null;
          }

          const { email, password } = parsed.data;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const user = await (prisma.user as any).findUnique({ where: { email } }) as {
            id: string; email: string | null; name: string | null; image: string | null; password: string | null;
          } | null;

          if (!user) {
            console.warn(`[Auth] No user found for email: ${email}`);
            return null;
          }

          if (!user.password) {
            console.warn(`[Auth] User ${email} has no password (likely OAuth-only account)`);
            return null;
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            console.warn(`[Auth] Invalid password for ${email}`);
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error('[Auth] Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
