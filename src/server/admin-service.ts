import 'server-only';

import type { Domain } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type AdminMetrics = {
  totalUsers: number;
  totalAdmins: number;
  newUsers30d: number;
  testsCompleted: number;
  testsInProgress: number;
  completionRate: number;
  avgDurationSeconds: number | null;
  avgTimeoutRatio: number;
  perAssessment: {
    slug: string;
    name: string;
    completed: number;
    inProgress: number;
    avgDurationSeconds: number | null;
  }[];
  /**
   * Medie delle quattro macro-aree del modello storico. Riguardano solo i
   * report prodotti da quel modello: i risultati della Mappa dei Punti di Forza
   * non valorizzano quelle colonne e restano fuori dalla media.
   */
  domainAverages: Record<Domain, number>;
  themeLeaderboard: {
    slug: string;
    name: string;
    domain: Domain;
    /** Quante volte il tema è entrato nella Top 5 di un utente. */
    topFiveCount: number;
    /** Punteggio normalizzato medio sulla popolazione. */
    avgScore: number;
  }[];
  /** L'equivalente per i tratti della Mappa dei Punti di Forza. */
  traitLeaderboard: {
    slug: string;
    name: string;
    areaName: string;
    areaColor: string;
    topFiveCount: number;
    avgScore: number;
  }[];
  recentResults: {
    id: string;
    userName: string | null;
    userEmail: string;
    computedAt: Date;
    durationSeconds: number | null;
    topThemeNames: string[];
  }[];
};

export async function getAdminMetrics(): Promise<AdminMetrics> {
  const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalAdmins,
    newUsers30d,
    testsCompleted,
    testsInProgress,
    aggregates,
    themes,
    traits,
    traitScoreGroups,
    results,
    recent,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { createdAt: { gte: since30d } } }),
    prisma.testSession.count({ where: { status: 'COMPLETED' } }),
    prisma.testSession.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.testResult.aggregate({
      _avg: {
        durationSeconds: true,
        timeoutRatio: true,
        executingScore: true,
        influencingScore: true,
        relationshipScore: true,
        strategicScore: true,
      },
    }),
    prisma.talentTheme.findMany({ select: { id: true, slug: true, name: true, domain: true } }),
    prisma.strengthTrait.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        area: { select: { name: true, color: true, sortOrder: true } },
      },
    }),
    prisma.traitScore.groupBy({
      by: ['traitId'],
      _avg: { normalizedScore: true },
      _count: { _all: true },
    }),
    prisma.testResult.findMany({ select: { topThemeSlugs: true } }),
    prisma.testResult.findMany({
      orderBy: { computedAt: 'desc' },
      take: 12,
      select: {
        id: true,
        computedAt: true,
        durationSeconds: true,
        topThemeSlugs: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  const topFiveCounts = new Map<string, number>();
  for (const r of results) {
    for (const slug of r.topThemeSlugs) {
      topFiveCounts.set(slug, (topFiveCounts.get(slug) ?? 0) + 1);
    }
  }

  // I due modelli hanno slug disgiunti: un'unica mappa nome-per-slug serve a
  // entrambi, e ciò che arriva da un modello non trova corrispondenza
  // nell'altro.
  const nameBySlug = new Map([...themes, ...traits].map((t) => [t.slug, t.name]));

  const themeScoreGroups = await prisma.themeScore.groupBy({
    by: ['themeId'],
    _avg: { normalizedScore: true },
    _count: { _all: true },
  });
  const avgByThemeId = new Map(
    themeScoreGroups.map((g) => [g.themeId, g._avg.normalizedScore ?? 50]),
  );

  const themeLeaderboard = themes
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      domain: t.domain,
      topFiveCount: topFiveCounts.get(t.slug) ?? 0,
      avgScore: Math.round((avgByThemeId.get(t.id) ?? 50) * 10) / 10,
    }))
    .sort((a, b) => b.topFiveCount - a.topFiveCount || b.avgScore - a.avgScore);

  const avgByTraitId = new Map(
    traitScoreGroups.map((g) => [g.traitId, g._avg.normalizedScore ?? 50]),
  );

  const traitLeaderboard = traits
    .map((t) => ({
      slug: t.slug,
      name: t.name,
      areaName: t.area.name,
      areaColor: t.area.color,
      topFiveCount: topFiveCounts.get(t.slug) ?? 0,
      avgScore: Math.round((avgByTraitId.get(t.id) ?? 50) * 10) / 10,
    }))
    .sort((a, b) => b.topFiveCount - a.topFiveCount || b.avgScore - a.avgScore);

  const assessments = await prisma.assessment.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, slug: true, name: true },
  });
  const [sessionGroups, durationGroups] = await Promise.all([
    prisma.testSession.groupBy({ by: ['assessmentId', 'status'], _count: { _all: true } }),
    prisma.testResult.groupBy({ by: ['assessmentId'], _avg: { durationSeconds: true } }),
  ]);
  const avgDurationByAssessment = new Map(
    durationGroups.map((g) => [g.assessmentId, g._avg.durationSeconds]),
  );
  const perAssessment = assessments.map((a) => {
    const completed = sessionGroups.find(
      (g) => g.assessmentId === a.id && g.status === 'COMPLETED',
    );
    const running = sessionGroups.find(
      (g) => g.assessmentId === a.id && g.status === 'IN_PROGRESS',
    );
    const avg = avgDurationByAssessment.get(a.id);
    return {
      slug: a.slug,
      name: a.name,
      completed: completed?._count._all ?? 0,
      inProgress: running?._count._all ?? 0,
      avgDurationSeconds: avg ? Math.round(avg) : null,
    };
  });

  const totalSessions = testsCompleted + testsInProgress;

  return {
    totalUsers,
    totalAdmins,
    newUsers30d,
    testsCompleted,
    testsInProgress,
    completionRate: totalSessions > 0 ? Math.round((testsCompleted / totalSessions) * 100) : 0,
    avgDurationSeconds: aggregates._avg.durationSeconds
      ? Math.round(aggregates._avg.durationSeconds)
      : null,
    avgTimeoutRatio: Math.round((aggregates._avg.timeoutRatio ?? 0) * 1000) / 10,
    perAssessment,
    domainAverages: {
      OPERATIONAL: Math.round((aggregates._avg.executingScore ?? 25) * 10) / 10,
      INTERPERSONAL: Math.round((aggregates._avg.influencingScore ?? 25) * 10) / 10,
      SUPPORTIVE: Math.round((aggregates._avg.relationshipScore ?? 25) * 10) / 10,
      COGNITIVE: Math.round((aggregates._avg.strategicScore ?? 25) * 10) / 10,
    },
    themeLeaderboard,
    traitLeaderboard,
    recentResults: recent.map((r) => ({
      id: r.id,
      userName: r.user.name,
      userEmail: r.user.email,
      computedAt: r.computedAt,
      durationSeconds: r.durationSeconds,
      topThemeNames: r.topThemeSlugs.map((slug) => nameBySlug.get(slug) ?? slug),
    })),
  };
}

export async function listUsersForAdmin(query?: string) {
  return prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      orgRole: { select: { id: true, name: true } },
      _count: { select: { results: true } },
      testSessions: {
        orderBy: { lastActivityAt: 'desc' },
        take: 1,
        select: { status: true, answeredCount: true, totalQuestions: true, lastActivityAt: true },
      },
    },
  });
}

export async function listQuestionsForAdmin(assessmentSlug?: string) {
  return prisma.question.findMany({
    where: assessmentSlug ? { assessment: { slug: assessmentSlug } } : undefined,
    orderBy: [{ assessment: { sortOrder: 'asc' } }, { position: 'asc' }],
    include: {
      assessment: { select: { slug: true, name: true } },
      leftTheme: { select: { name: true, domain: true, slug: true } },
      rightTheme: { select: { name: true, domain: true, slug: true } },
      _count: { select: { responses: true } },
    },
  });
}

/**
 * I blocchi dei questionari a scelta forzata. Sono l'equivalente delle domande
 * per l'altra metodologia, e la pagina di amministrazione li mostra accanto ad
 * esse invece che in una sezione separata: per chi amministra sono la stessa
 * cosa — gli item che le persone si vedono somministrare.
 */
export async function listBlocksForAdmin(assessmentSlug?: string) {
  return prisma.choiceBlock.findMany({
    where: assessmentSlug ? { assessment: { slug: assessmentSlug } } : undefined,
    orderBy: [{ assessment: { sortOrder: 'asc' } }, { position: 'asc' }],
    include: {
      assessment: { select: { slug: true, name: true } },
      options: {
        orderBy: { position: 'asc' },
        select: {
          id: true,
          position: true,
          statement: true,
          trait: { select: { name: true, slug: true, area: { select: { name: true, color: true } } } },
        },
      },
      _count: { select: { responses: true } },
    },
  });
}

// ===========================================================================
// Report: consultazione, download e tracciabilità
// ===========================================================================

export async function listReportsForAdmin(query?: string) {
  return prisma.testResult.findMany({
    where: query
      ? {
          user: {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
        }
      : undefined,
    orderBy: { computedAt: 'desc' },
    take: 100,
    select: {
      id: true,
      computedAt: true,
      durationSeconds: true,
      timeoutRatio: true,
      topThemeSlugs: true,
      user: { select: { id: true, name: true, email: true } },
      assessment: { select: { name: true, slug: true, lens: true } },
      _count: { select: { downloads: true } },
    },
  });
}

/** Registro degli accessi amministrativi a dati personali. */
export async function listAuditLog(limit = 50) {
  return prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Righe dell'export CSV: un profilo per riga, con gli elementi dominanti.
 *
 * Il bilanciamento fra le macro-aree sta in una sola colonna, come elenco
 * "Area: percentuale", invece che in una colonna per area. Le due metodologie
 * del portale hanno un numero diverso di aree, e riservare una colonna a
 * ciascuna significherebbe un foglio metà vuoto qualunque riga si guardi.
 */
export async function buildResultsCsv(): Promise<string> {
  const results = await prisma.testResult.findMany({
    orderBy: { computedAt: 'desc' },
    select: {
      computedAt: true,
      durationSeconds: true,
      timeoutRatio: true,
      executingScore: true,
      influencingScore: true,
      relationshipScore: true,
      strategicScore: true,
      topThemeSlugs: true,
      reliabilityIndex: true,
      reliabilityBand: true,
      areaScores: { select: { score: true, area: { select: { name: true, sortOrder: true } } } },
      user: { select: { name: true, email: true } },
      assessment: { select: { name: true, itemFormat: true } },
    },
  });

  const [themes, traits] = await Promise.all([
    prisma.talentTheme.findMany({ select: { slug: true, name: true } }),
    prisma.strengthTrait.findMany({ select: { slug: true, name: true } }),
  ]);
  const nameBySlug = new Map([...themes, ...traits].map((t) => [t.slug, t.name]));

  const LEGACY_AREAS = ['Esecuzione', 'Influenza', 'Relazioni', 'Pensiero Strategico'];

  /** Bilanciamento fra le aree, nella forma in cui il risultato lo conserva. */
  const areaBreakdown = (r: (typeof results)[number]): string => {
    if (r.assessment.itemFormat === 'FORCED_CHOICE_QUARTET') {
      return r.areaScores
        .slice()
        .sort((a, b) => a.area.sortOrder - b.area.sortOrder)
        .map((a) => `${a.area.name}: ${a.score.toFixed(1)}%`)
        .join(' | ');
    }
    const values = [r.executingScore, r.influencingScore, r.relationshipScore, r.strategicScore];
    return LEGACY_AREAS.map((name, i) =>
      values[i] === null ? null : `${name}: ${values[i]!.toFixed(1)}%`,
    )
      .filter(Boolean)
      .join(' | ');
  };

  const header = [
    'data', 'utente', 'email', 'questionario', 'durata_secondi', 'quota_timeout',
    'aree_pct', 'dominanti', 'affidabilita', 'coerenza',
  ];

  const escape = (value: unknown) => {
    const text = String(value ?? '');
    // Le formule iniziali (=, +, -, @) vengono neutralizzate: aprire il CSV in
    // un foglio di calcolo non deve poter eseguire nulla (CSV injection).
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const rows = results.map((r) =>
    [
      r.computedAt.toISOString(),
      r.user.name ?? '',
      r.user.email,
      r.assessment.name,
      r.durationSeconds ?? '',
      r.timeoutRatio,
      areaBreakdown(r),
      r.topThemeSlugs.map((slug) => nameBySlug.get(slug) ?? slug).join(' | '),
      r.reliabilityIndex ?? '',
      r.reliabilityBand ?? '',
    ].map(escape).join(','),
  );

  return [header.join(','), ...rows].join('\r\n');
}

// ===========================================================================
// Ruoli organizzativi
// ===========================================================================

export async function listOrgRoles() {
  return prisma.orgRole.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      assessments: {
        include: { assessment: { select: { id: true, slug: true, name: true, subtitle: true } } },
      },
      _count: { select: { users: true } },
    },
  });
}

export async function listOrgRoleOptions() {
  return prisma.orgRole.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true, isDefault: true },
  });
}
