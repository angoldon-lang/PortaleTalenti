'use client';

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

import type { ReportGroup } from '@/components/report/report-model';

export type DomainDatum = ReportGroup;

/**
 * Grafico a ciambella del bilanciamento fra le macro-aree. Quante siano lo
 * dicono i dati — quattro nel modello storico, cinque nella Mappa dei Punti di
 * Forza — e i colori arrivano con loro.
 *
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
      <ChartTable
        data={data}
        caption={`Distribuzione percentuale fra le ${data.length} macro-aree`}
      />
    </div>
  );
}

export type ThemeDatum = {
  slug: string;
  name: string;
  score: number;
  rank: number;
  groupKey: string;
  groupColor: string;
};

/**
 * Etichetta dell'asse colorata secondo la macro-area della voce: rende
 * leggibili i settori del radar senza aggiungere una legenda.
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
      fill={datum ? datum.groupColor : '#4f5f78'}
    >
      {label.length > 13 ? `${label.slice(0, 12)}…` : label}
    </text>
  );
}

/**
 * Radar sulle singole voci: mostra la "forma" del profilo, cioè dove si
 * concentra l'intensità. Il radar sulle sole macro-aree sarebbe poco leggibile,
 * perché quelle quote sommano a 100 e restano vicine alla media.
 */
export function ThemeRadar({
  data,
  /** Ordine delle macro-aree, per rendere contigui gli assi di ciascuna. */
  groupOrder,
}: {
  data: ThemeDatum[];
  groupOrder: string[];
}) {
  // Ordinati per macro-area: i settori del radar diventano leggibili a colpo
  // d'occhio, con gli assi di una stessa area uno accanto all'altro.
  const ordered = [...data].sort(
    (a, b) =>
      groupOrder.indexOf(a.groupKey) - groupOrder.indexOf(b.groupKey) ||
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
