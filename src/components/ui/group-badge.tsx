import { brandHex } from '@/lib/branding';
import { cn } from '@/lib/utils';

/**
 * Etichetta della macro-area a cui appartiene una voce del report.
 *
 * Il colore arriva come esadecimale invece che da un elenco fisso di classi:
 * le aree della Mappa dei Punti di Forza sono cinque e i loro colori sono un
 * dato del modello, non una costante del codice. Fondo e testo si ricavano dal
 * colore dell'area con lo stesso generatore di scala usato per il tema del
 * sito, così il contrasto resta leggibile qualunque sia la tinta di partenza.
 */
export function GroupBadge({
  label,
  color,
  className,
}: {
  label: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        className,
      )}
      style={{
        backgroundColor: brandHex(color, 50),
        color: brandHex(color, 800),
        boxShadow: `inset 0 0 0 1px ${brandHex(color, 200)}`,
      }}
    >
      {label}
    </span>
  );
}
