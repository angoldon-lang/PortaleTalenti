import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { getReportById } from '@/server/test-service';
import { ReportDocument } from '@/lib/pdf-report';

// Il rendering PDF richiede API Node (stream, buffer): niente Edge runtime.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 60);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  const { id } = await params;
  const isAdmin = session.user.role === 'ADMIN';

  // Un utente standard può scaricare solo i propri report; l'amministratore
  // può scaricare quelli altrui, ma l'accesso viene registrato.
  const report = await getReportById(id, isAdmin ? undefined : session.user.id);
  if (!report) {
    return NextResponse.json({ error: 'Report non trovato' }, { status: 404 });
  }

  const isOwnReport = report.userId === session.user.id;
  if (!isOwnReport && isAdmin) {
    await prisma.adminAuditLog.create({
      data: {
        action: 'REPORT_DOWNLOAD',
        actorId: session.user.id,
        actorEmail: session.user.email ?? '',
        subjectId: report.userId,
        subjectEmail: report.user.email,
        testResultId: report.id,
        detail: report.assessment.name,
      },
    });
  }

  const buffer = await renderToBuffer(<ReportDocument report={report} />);
  const filename = `${slugify(report.assessment.name)}-${slugify(
    report.user.name ?? report.user.email,
  )}.pdf`;

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
