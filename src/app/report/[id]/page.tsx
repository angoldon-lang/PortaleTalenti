import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { ReportView } from '@/components/report/report-view';
import { requireUser } from '@/server/guards';
import { getReportById } from '@/server/test-service';

export const metadata: Metadata = { title: 'Report' };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser('/dashboard');
  const { id } = await params;

  // Filtro per userId: un id indovinato non restituisce il report di un altro.
  const report = await getReportById(id, user.id);
  if (!report) notFound();

  return (
    <AppShell user={{ ...user, role: user.role ?? 'USER' }}>
      <ReportView report={report} title={user.name ?? 'Il tuo profilo'} />
    </AppShell>
  );
}
