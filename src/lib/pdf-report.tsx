import {
  Document,
  Image,
  Page,
  StyleSheet,
  Svg,
  Path,
  Text,
  View,
} from '@react-pdf/renderer';

import { LENS_META } from '@/content/assessments';
import { buildReportModel } from '@/components/report/report-model';
import type { FullReport } from '@/server/test-service';

const COLORS = {
  ink900: '#21262e',
  ink700: '#414d61',
  ink500: '#647691',
  ink300: '#b0bac9',
  ink100: '#eceef2',
  white: '#ffffff',
};

/** Personalizzazione applicata al documento. */
export type ReportBranding = {
  organizationName: string;
  /** Colore principale in esadecimale. */
  primaryColor: string;
  /** Logo come data URI PNG/JPEG; null se assente o in formato non stampabile. */
  logoDataUri: string | null;
  /** Riga in fondo a ogni pagina. */
  footer: string;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    fontSize: 10,
    color: COLORS.ink700,
    lineHeight: 1.55,
    fontFamily: 'Helvetica',
  },
  coverBar: { height: 4, marginBottom: 20 },
  eyebrow: { fontSize: 9, textTransform: 'uppercase', letterSpacing: 1.2 },
  h1: {
    fontSize: 24,
    color: COLORS.ink900,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.25,
    marginTop: 6,
    marginBottom: 4,
  },
  h2: {
    fontSize: 13,
    color: COLORS.ink900,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.3,
    marginTop: 20,
    marginBottom: 8,
  },
  h3: { fontSize: 10.5, color: COLORS.ink900, fontFamily: 'Helvetica-Bold', lineHeight: 1.3, marginBottom: 4 },
  meta: { fontSize: 9, color: COLORS.ink500, lineHeight: 1.4 },
  paragraph: { marginBottom: 7 },

  domainRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 },
  domainLabel: { width: 130, fontSize: 10, color: COLORS.ink900 },
  barTrack: { flex: 1, height: 8, backgroundColor: COLORS.ink100, borderRadius: 4 },
  barFill: { height: 8, borderRadius: 4 },
  domainValue: { width: 42, textAlign: 'right', fontSize: 10, color: COLORS.ink700 },

  talent: {
    borderWidth: 1,
    borderColor: COLORS.ink100,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  talentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rankBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: { color: COLORS.white, fontSize: 11, fontFamily: 'Helvetica-Bold' },
  talentName: { fontSize: 13, color: COLORS.ink900, fontFamily: 'Helvetica-Bold' },
  talentDomain: { fontSize: 8, color: COLORS.ink500, marginTop: 1 },
  tagline: { fontSize: 10, color: COLORS.ink700, fontStyle: 'italic', marginBottom: 8 },

  columns: { flexDirection: 'row', gap: 16, marginTop: 8 },
  column: { flex: 1 },
  bullet: { flexDirection: 'row', marginBottom: 3 },
  bulletDot: { width: 10, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 9, color: COLORS.ink700 },

  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ink100,
  },
  rankIndex: { width: 18, fontSize: 9, color: COLORS.ink500 },
  rankName: { width: 130, fontSize: 10, color: COLORS.ink900 },

  footerRule: {
    position: 'absolute',
    bottom: 40,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: COLORS.ink100,
  },
  footerLeft: {
    position: 'absolute',
    bottom: 26,
    left: 48,
    right: 48,
    fontSize: 8,
    color: COLORS.ink300,
  },
  footerRight: {
    position: 'absolute',
    bottom: 26,
    left: 48,
    right: 48,
    textAlign: 'right',
    fontSize: 8,
    color: COLORS.ink300,
  },
  logo: { height: 34, width: 'auto', maxWidth: 200, objectFit: 'contain', marginBottom: 14 },
  orgName: { fontSize: 11, color: COLORS.ink500, marginBottom: 12 },
  lensBox: {
    marginTop: 2,
    marginBottom: 8,
    padding: 9,
    backgroundColor: COLORS.ink100,
    borderRadius: 5,
  },
  disclaimer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.ink100,
    borderRadius: 6,
    fontSize: 8.5,
    color: COLORS.ink500,
  },
});

function Bullets({ items, color }: { items: string[]; color: string }) {
  return (
    <>
      {items.map((item, i) => (
        <View key={i} style={styles.bullet}>
          <Text style={[styles.bulletDot, { color }]}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </>
  );
}

/** Ciambella del bilanciamento, disegnata con path SVG (nessun canvas lato server). */
function DonutChart({ data }: { data: { value: number; color: string }[] }) {
  const size = 140;
  const r = 58;
  const inner = 34;
  const cx = size / 2;
  const cy = size / 2;
  const total = data.reduce((a, d) => a + d.value, 0) || 1;

  let angle = -Math.PI / 2;
  const slices = data.map((d) => {
    const sweep = (d.value / total) * Math.PI * 2;
    const start = angle;
    const end = angle + sweep;
    angle = end;

    const large = sweep > Math.PI ? 1 : 0;
    const p = (radius: number, a: number) =>
      `${(cx + radius * Math.cos(a)).toFixed(2)} ${(cy + radius * Math.sin(a)).toFixed(2)}`;

    return {
      color: d.color,
      d: [
        `M ${p(r, start)}`,
        `A ${r} ${r} 0 ${large} 1 ${p(r, end)}`,
        `L ${p(inner, end)}`,
        `A ${inner} ${inner} 0 ${large} 0 ${p(inner, start)}`,
        'Z',
      ].join(' '),
    };
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {slices.map((s, i) => (
        <Path key={i} d={s.d} fill={s.color} />
      ))}
    </Svg>
  );
}

export function ReportDocument({
  report,
  branding,
}: {
  report: FullReport;
  branding: ReportBranding;
}) {
  const brand = branding.primaryColor;
  // Le due metodologie del portale passano per lo stesso modello di vista del
  // report a schermo: il PDF non deve sapere quale delle due ha prodotto i dati.
  const model = buildReportModel(report);
  const { groups, items, itemNoun, unitNoun, quality } = model;

  const topCount = model.topCount;
  const topItems = items.slice(0, topCount);
  const lens = report.assessment.lens;
  const generatedOn = new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(report.computedAt);

  const owner = report.user.name ?? report.user.email;

  return (
    <Document
      title={`${report.assessment.name} — ${owner}`}
      author={branding.organizationName}
      subject="Report dei talenti dominanti"
      language="it"
    >
      {/* ---------------- Pagina 1: sintesi ---------------- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.footerRule} fixed />
        <Text style={styles.footerLeft} fixed>
          {branding.footer}
        </Text>
        <Text style={styles.footerRight} fixed>
          {owner} · {generatedOn}
        </Text>
        <View style={[styles.coverBar, { backgroundColor: brand }]} />
        {branding.logoDataUri ? (
          <Image src={branding.logoDataUri} style={styles.logo} />
        ) : (
          <Text style={styles.orgName}>{branding.organizationName}</Text>
        )}
        <Text style={[styles.eyebrow, { color: brand }]}>{report.assessment.name}</Text>
        <Text style={styles.h1}>{owner}</Text>
        <Text style={styles.meta}>
          Compilato il {generatedOn} · {report.testSession.totalQuestions} {unitNoun.plural} ·{' '}
          {items.length} {itemNoun.plural} · entro il tempo:{' '}
          {Math.round(quality.inTimeRatio * 100)}% · {LENS_META[lens].label}
        </Text>

        <Text style={styles.h2}>Il tuo bilanciamento</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
          <DonutChart data={groups.map((d) => ({ value: d.value, color: d.color }))} />
          <View style={{ flex: 1 }}>
            {groups.map((d) => (
              <View key={d.key} style={styles.domainRow}>
                <Text style={styles.domainLabel}>{d.label}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${Math.min(100, d.value * 2)}%`, backgroundColor: d.color },
                    ]}
                  />
                </View>
                <Text style={styles.domainValue}>{d.value.toFixed(1)}%</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.h2}>
          I tuoi {topCount} {itemNoun.plural} dominanti
        </Text>
        {topItems.map((item) => (
          <View key={item.id} style={styles.rankRow}>
            <Text style={styles.rankIndex}>{item.rank}.</Text>
            <Text style={styles.rankName}>{item.name}</Text>
            <Text style={{ flex: 1, fontSize: 9, color: COLORS.ink500 }}>{item.groupLabel}</Text>
            <Text style={{ width: 30, textAlign: 'right', fontSize: 10 }}>
              {Math.round(item.score)}
            </Text>
          </View>
        ))}

        <Text style={styles.h2}>Classifica completa</Text>
        {items.slice(topCount).map((item) => (
          <View key={item.id} style={styles.rankRow}>
            <Text style={styles.rankIndex}>{item.rank}.</Text>
            <Text style={styles.rankName}>{item.name}</Text>
            <Text style={{ flex: 1, fontSize: 9, color: COLORS.ink500 }}>{item.groupLabel}</Text>
            <Text style={{ width: 30, textAlign: 'right', fontSize: 10, color: COLORS.ink500 }}>
              {Math.round(item.score)}
            </Text>
          </View>
        ))}

        {quality.consistency ? (
          <View style={styles.disclaimer} wrap={false}>
            <Text>
              {quality.consistency.label}. {quality.consistency.note}
            </Text>
          </View>
        ) : null}

        <View style={styles.disclaimer} wrap={false}>
          <Text>
            I punteggi sono normalizzati sul tuo profilo (media 50): indicano quanto ciascun{' '}
            {itemNoun.singular} si stacca dalla tua media personale e non costituiscono un confronto
            con altre persone. Il questionario è uno strumento di autoconsapevolezza e sviluppo
            professionale; non è un test clinico né uno strumento di selezione.
          </Text>
        </View>

      </Page>

      {/* ---------------- Pagina 2+: schede di dettaglio ---------------- */}
      <Page size="A4" style={styles.page}>
        <View style={styles.footerRule} fixed />
        <Text style={styles.footerLeft} fixed>
          {branding.footer}
        </Text>
        <Text style={styles.footerRight} fixed>
          {owner} · {generatedOn}
        </Text>
        <Text style={[styles.eyebrow, { color: brand }]}>Schede di dettaglio</Text>
        <Text style={[styles.h1, { fontSize: 20 }]}>{LENS_META[lens].detailHeading}</Text>

        {topItems.map((item) => (
          <View key={item.id} style={styles.talent} wrap={false}>
            <View style={styles.talentHeader}>
              <View style={[styles.rankBadge, { backgroundColor: item.groupColor }]}>
                <Text style={styles.rankText}>{item.rank}</Text>
              </View>
              <View>
                <Text style={styles.talentName}>{item.name}</Text>
                <Text style={styles.talentDomain}>
                  {item.groupLabel} · intensità {Math.round(item.score)}
                </Text>
              </View>
            </View>

            <Text style={styles.tagline}>{item.tagline}</Text>

            {item.description.split('\n\n').map((p, i) => (
              <Text key={i} style={styles.paragraph}>
                {p}
              </Text>
            ))}

            {item.lensNote ? (
              <View style={styles.lensBox}>
                <Text style={styles.h3}>{item.lensNote.heading}</Text>
                <Text style={{ fontSize: 9.5 }}>{item.lensNote.body}</Text>
              </View>
            ) : null}

            <View style={styles.columns}>
              <View style={styles.column}>
                <Text style={styles.h3}>Quando lavora al meglio</Text>
                <Bullets items={item.strengths} color="#059669" />
              </View>
              <View style={styles.column}>
                <Text style={styles.h3}>Punti ciechi</Text>
                <Bullets items={item.blindSpots} color="#d97706" />
              </View>
            </View>

            <View style={{ marginTop: 10 }}>
              <Text style={styles.h3}>Come allenarlo</Text>
              <Bullets items={item.actionTips} color={brand} />
            </View>

            <Text style={{ marginTop: 8, fontSize: 9, color: COLORS.ink500 }}>
              Contesti in cui rende di più: {item.thrivesIn.join(' · ')}
            </Text>
          </View>
        ))}

      </Page>
    </Document>
  );
}
