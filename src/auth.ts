import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';

import { authConfig } from './auth.config';
import { prisma } from './lib/prisma';
import { loginSchema } from './lib/validation';

/**
 * Hash "fittizio" usato quando l'utente non esiste o è solo-OAuth: confrontare
 * comunque la password evita di rivelare, dai tempi di risposta, se un account
 * esiste (mitigazione user-enumeration via timing).
 */
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      name: 'Email e password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!ok || !user?.passwordHash) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  events: {
    /**
     * Promozione automatica ad ADMIN per le email elencate in ADMIN_EMAILS:
     * evita di dover toccare il database dopo il primo deploy.
     */
    async createUser({ user }) {
      const admins = (process.env.ADMIN_EMAILS ?? '')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (user.email && admins.includes(user.email.toLowerCase())) {
        await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
      }
    },
  },
});
