import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { buildResultsCsv } from '@/server/admin-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }

  const csv = await buildResultsCsv();

  await prisma.adminAuditLog.create({
    data: {
      action: 'RESULTS_EXPORT',
      actorId: session.user.id,
      actorEmail: session.user.email ?? '',
      detail: 'export CSV di tutti i risultati',
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="risultati-portale-talenti-${today}.csv"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
