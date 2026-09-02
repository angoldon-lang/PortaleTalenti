'use client';

import type { Domain } from '@prisma/client';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { DOMAIN_META, DOMAIN_ORDER } from '@/content/themes';

export type DomainDatum = {
  key: string;
  label: string;
  short: string;
  value: number;
  color: string;
};

/**
 * Grafico a ciambella del bilanciamento fra le 4 macro-aree.
 * I dati sono esposti anche in una tabella nascosta agli occhi ma leggibile
 * dagli screen reader: il grafico non è l'unico modo di accedere al dato.
 */
export function DomainDonut({ data }: { data: DomainDatum[] }) {
  return (
    <div>
      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={2}
              stroke="#fff"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((d) => (
                <Cell key={d.key} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
              contentStyle={{ borderRadius: 12, border: '1px solid #d5dae2', fontSize: 13 }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm text-ink-700">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ChartTable data={data} caption="Distribuzione percentuale fra le quattro macro-aree" />
    </div>
  );
}

export type ThemeDatum = {
  slug: string;
  name: string;
  score: number;
  rank: number;
  domain: Domain;
};

/**
 * Etichetta dell'asse colorata secondo la macro-area del tema: rende leggibili
 * i quattro settori del radar senza aggiungere una legenda.
 */
function ThemeTick({
  payload,
  x,
  y,
  textAnchor,
  data,
}: {
  payload?: { value: string; index: number };
  x?: number;
  y?: number;
  textAnchor?: 'start' | 'middle' | 'end';
  data: ThemeDatum[];
}) {
  const datum = payload ? data[payload.index] : undefined;
  const label = payload?.value ?? '';
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={11}
      fill={datum ? DOMAIN_META[datum.domain].color : '#4f5f78'}
    >
      {label.length > 13 ? `${label.slice(0, 12)}…` : label}
    </text>
  );
}

/**
 * Radar sui 12 temi: mostra la "forma" del profilo, cioè dove si concentra
 * l'intensità. Il radar sulle sole 4 macro-aree sarebbe poco leggibile, perché
 * quelle quote sommano a 100 e restano sempre vicine al 25%.
 */
export function ThemeRadar({ data }: { data: ThemeDatum[] }) {
  // Ordinati per macro-area: i quattro settori del radar diventano leggibili
  // a colpo d'occhio (tre assi contigui per ciascuna area).
  const ordered = [...data].sort(
    (a, b) =>
      DOMAIN_ORDER.indexOf(a.domain) - DOMAIN_ORDER.indexOf(b.domain) ||
      a.name.localeCompare(b.name, 'it'),
  );

  return (
    <div>
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={ordered} outerRadius="70%">
            <PolarGrid stroke="#d5dae2" />
            <PolarAngleAxis dataKey="name" tick={<ThemeTick data={ordered} />} />
            <PolarRadiusAxis domain={[0, 100]} tickCount={5} tick={{ fill: '#8494ab', fontSize: 9 }} />
            <Radar
              name="Intensità"
              dataKey="score"
              stroke="#1d63f1"
              fill="#3382fc"
              fillOpacity={0.28}
              isAnimationActive={false}
            />
            <Tooltip
              formatter={(value: number) => [Math.round(value), 'Intensità']}
              contentStyle={{ borderRadius: 12, border: '1px solid #d5dae2', fontSize: 13 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>Intensità di ciascun tema di talento, da 0 a 100</caption>
        <thead>
          <tr>
            <th scope="col">Posizione</th>
            <th scope="col">Tema</th>
            <th scope="col">Intensità</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.slug}>
              <td>{d.rank}</td>
              <th scope="row">{d.name}</th>
              <td>{Math.round(d.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ChartTable({ data, caption }: { data: DomainDatum[]; caption: string }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          <th scope="col">Macro-area</th>
          <th scope="col">Percentuale</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.key}>
            <th scope="row">{d.label}</th>
            <td>{d.value.toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
