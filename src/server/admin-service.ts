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
  activeQuestions: number;
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
    activeQuestions,
    aggregates,
    themes,
    themeScoreGroups,
    results,
    recent,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.user.count({ where: { createdAt: { gte: since30d } } }),
    prisma.testSession.count({ where: { status: 'COMPLETED' } }),
    prisma.testSession.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.question.count({ where: { isActive: true } }),
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
    prisma.themeScore.groupBy({
      by: ['themeId'],
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

  const nameBySlug = new Map(themes.map((t) => [t.slug, t.name]));

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
    activeQuestions,
    domainAverages: {
      EXECUTING: Math.round((aggregates._avg.executingScore ?? 25) * 10) / 10,
      INFLUENCING: Math.round((aggregates._avg.influencingScore ?? 25) * 10) / 10,
      RELATIONSHIP: Math.round((aggregates._avg.relationshipScore ?? 25) * 10) / 10,
      STRATEGIC: Math.round((aggregates._avg.strategicScore ?? 25) * 10) / 10,
    },
    themeLeaderboard,
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
      _count: { select: { results: true } },
      testSessions: {
        orderBy: { lastActivityAt: 'desc' },
        take: 1,
        select: { status: true, answeredCount: true, totalQuestions: true, lastActivityAt: true },
      },
    },
  });
}

export async function listQuestionsForAdmin() {
  return prisma.question.findMany({
    orderBy: { position: 'asc' },
    include: {
      leftTheme: { select: { name: true, domain: true, slug: true } },
      rightTheme: { select: { name: true, domain: true, slug: true } },
      _count: { select: { responses: true } },
    },
  });
}
