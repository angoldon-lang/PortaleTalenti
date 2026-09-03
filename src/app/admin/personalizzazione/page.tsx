import { BrandingForm } from '@/components/admin/branding-form';
import { getBranding } from '@/server/settings-service';

export default async function AdminBrandingPage() {
  const branding = await getBranding();

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Personalizzazione</h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Logo, nome e colore vengono applicati all’intero portale — intestazione, pagina di accesso,
        report a schermo — e al PDF scaricabile.
      </p>

      <div className="mt-8">
        <BrandingForm
          initial={{
            organizationName: branding.organizationName,
            primaryColor: branding.primaryColor,
            reportFooter: branding.reportFooter ?? '',
            logoVersion: branding.logoVersion,
            logoMimeType: branding.logoMimeType,
          }}
        />
      </div>
    </>
  );
}
