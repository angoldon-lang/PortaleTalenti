'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { buttonClasses } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { saveBrandingAction, type BrandingState } from '@/server/admin-actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={buttonClasses('primary', 'md')}>
      {pending ? 'Salvataggio…' : 'Salva personalizzazione'}
    </button>
  );
}

export function BrandingForm({
  initial,
}: {
  initial: {
    organizationName: string;
    primaryColor: string;
    reportFooter: string;
    logoVersion: string | null;
    logoMimeType: string | null;
  };
}) {
  const [state, formAction] = useActionState<BrandingState, FormData>(saveBrandingAction, {});
  const [color, setColor] = useState(initial.primaryColor);
  const [preview, setPreview] = useState<string | null>(
    initial.logoVersion ? `/api/branding/logo?v=${initial.logoVersion}` : null,
  );
  const [removeLogo, setRemoveLogo] = useState(false);

  const svgLogo = initial.logoMimeType === 'image/svg+xml';

  return (
    <form action={formAction} className="max-w-2xl space-y-8">
      {state.error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      )}
      {state.success && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {state.success}
        </div>
      )}

      {/* ---------------- Nome ---------------- */}
      <div>
        <label htmlFor="organizationName" className="label">
          Nome dell’organizzazione
        </label>
        <input
          id="organizationName"
          name="organizationName"
          type="text"
          required
          maxLength={60}
          defaultValue={initial.organizationName}
          className="input"
        />
        <p className="mt-1.5 text-xs text-ink-500">
          Compare nell’intestazione quando non c’è un logo, nel titolo delle pagine e nel PDF.
        </p>
      </div>

      {/* ---------------- Logo ---------------- */}
      <fieldset>
        <legend className="label">Logo</legend>

        <div className="mt-2 flex flex-wrap items-center gap-5">
          <div className="grid h-20 w-48 place-items-center rounded-xl border border-dashed border-ink-300 bg-white p-2">
            {preview && !removeLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Anteprima del logo" className="max-h-16 max-w-full object-contain" />
            ) : (
              <span className="text-xs text-ink-400">Nessun logo</span>
            )}
          </div>

          <div className="flex-1">
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              disabled={removeLogo}
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPreview(file ? URL.createObjectURL(file) : preview);
              }}
              className="block w-full text-sm text-ink-700 file:mr-3 file:rounded-lg file:border-0
                         file:bg-ink-100 file:px-3 file:py-2 file:text-sm file:font-medium
                         file:text-ink-700 hover:file:bg-ink-200 disabled:opacity-50"
            />
            <p className="mt-1.5 text-xs text-ink-500">
              PNG, JPEG o SVG, massimo 512 KB. Altezza consigliata 64 px o più.
            </p>

            {preview && (
              <label className="mt-3 flex items-center gap-2 text-sm text-ink-700">
                <input
                  type="checkbox"
                  name="removeLogo"
                  checked={removeLogo}
                  onChange={(e) => setRemoveLogo(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300"
                />
                Rimuovi il logo e torna al nome testuale
              </label>
            )}
          </div>
        </div>

        {svgLogo && !removeLogo && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Il logo attuale è un SVG: si vede correttamente nel sito, ma il generatore di PDF non
            sa disegnare gli SVG, quindi nel report comparirà il nome testuale. Carica un PNG o un
            JPEG se vuoi il logo anche nei PDF.
          </p>
        )}
      </fieldset>

      {/* ---------------- Colore ---------------- */}
      <div>
        <label htmlFor="primaryColorText" className="label">
          Colore principale
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            aria-label="Selettore colore"
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : '#164ede'}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-lg border border-ink-300 bg-white p-1"
          />
          <input
            id="primaryColorText"
            name="primaryColor"
            type="text"
            required
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="input mt-0 w-36 font-mono"
            placeholder="#164ede"
          />
          <div className="flex items-center gap-2">
            {[50, 200, 400, 600, 800].map((step) => (
              <span
                key={step}
                title={`brand-${step}`}
                className="h-8 w-8 rounded-lg border border-ink-200"
                style={{ backgroundColor: shade(color, step) }}
              />
            ))}
          </div>
        </div>
        <p className="mt-1.5 text-xs text-ink-500">
          Dal colore scelto si genera l’intera scala di tinte dell’interfaccia. Il colore che
          indichi è esattamente quello dei pulsanti principali.
        </p>
      </div>

      {/* ---------------- Piè di pagina del PDF ---------------- */}
      <div>
        <label htmlFor="reportFooter" className="label">
          Riga in fondo al PDF <span className="font-normal text-ink-500">(opzionale)</span>
        </label>
        <input
          id="reportFooter"
          name="reportFooter"
          type="text"
          maxLength={120}
          defaultValue={initial.reportFooter}
          className="input"
          placeholder="Es. Acme S.p.A. · documento riservato"
        />
        <p className="mt-1.5 text-xs text-ink-500">
          Se lasci vuoto viene usato «{initial.organizationName} · documento riservato».
        </p>
      </div>

      <SubmitButton />
    </form>
  );
}

/**
 * Anteprima delle tinte lato client. Replica la formula di
 * `src/lib/branding.ts` in forma ridotta: qui serve solo mostrare cinque
 * campioni, non la scala completa.
 */
function shade(hex: string, step: number): string {
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) return '#e5e7eb';
  const full =
    hex.length === 4
      ? '#' + hex.slice(1).split('').map((c) => c + c).join('')
      : hex;
  const r = parseInt(full.slice(1, 3), 16);
  const g = parseInt(full.slice(3, 5), 16);
  const b = parseInt(full.slice(5, 7), 16);
  if (step === 600) return full;
  // 600 è il colore scelto: sopra si schiarisce verso il bianco, sotto si scurisce.
  const t = step < 600 ? (600 - step) / 600 : -(step - 600) / 800;
  const mix = (c: number) => Math.round(t > 0 ? c + (255 - c) * t : c * (1 + t));
  return `rgb(${mix(r)} ${mix(g)} ${mix(b)})`;
}
