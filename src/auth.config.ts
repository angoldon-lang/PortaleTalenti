import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Configurazione condivisa fra runtime Node e middleware Edge.
 * NON contiene il provider Credentials né l'adapter Prisma: entrambi
 * richiedono API non disponibili sull'Edge runtime.
 */
export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    /**
     * Gate di autorizzazione usato dal middleware: protegge /dashboard,
     * /questionario e /admin, e allontana gli utenti già autenticati
     * dalle pagine di login/registrazione.
     */
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = Boolean(auth?.user);
      const role = auth?.user?.role;

      const isAuthPage = pathname === '/login' || pathname === '/registrazione';
      const isProtected =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/questionario') ||
        pathname.startsWith('/report') ||
        pathname.startsWith('/admin');

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', request.nextUrl));
        return true;
      }

      if (pathname.startsWith('/admin')) return isLoggedIn && role === 'ADMIN';
      if (isProtected) return isLoggedIn;

      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: 'USER' | 'ADMIN' }).role ?? 'USER';
      }
      if (trigger === 'update' && session?.name) token.name = session.name as string;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as 'USER' | 'ADMIN') ?? 'USER';
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
