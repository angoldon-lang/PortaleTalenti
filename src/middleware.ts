import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Il middleware usa solo la config Edge-safe (nessun accesso al database).
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)'],
};
