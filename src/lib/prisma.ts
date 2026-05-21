/**
 * Prisma singleton.
 * `prisma generate` must be run before deploying (Vercel runs it automatically).
 * In the offline build sandbox, the PrismaClient constructor is not available
 * because the engine binary hasn't been downloaded — this is expected.
 * All usage of `prisma` in API routes is guarded at runtime by DATABASE_URL.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PrismaLike = Record<string, any>;

declare global {
  // Prevent multiple instances in Next.js hot-reload
  // eslint-disable-next-line no-var
  var __prisma: PrismaLike | undefined;
}

function createPrismaClient(): PrismaLike {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client') as { PrismaClient: new () => PrismaLike };
    return new PrismaClient();
  } catch {
    // Engine binary not generated yet — will be generated at deploy time.
    // Return a no-op proxy so imports don't crash at module parse time.
    return new Proxy({} as PrismaLike, {
      get: (_, prop) => {
        if (prop === '$connect' || prop === '$disconnect') return () => Promise.resolve();
        return new Proxy(() => Promise.reject(new Error('Prisma not initialized. Run `prisma generate`.')), {
          get: () => new Proxy({}, { get: () => () => Promise.reject(new Error('Prisma not initialized.')) }),
        });
      },
    });
  }
}

export const prisma: PrismaLike =
  process.env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (global.__prisma ??= createPrismaClient());
