import { CreateUserForm } from '@/components/admin/create-user-form';

export default function AdminNewUserPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Nuovo utente</h1>
      <p className="mt-2 max-w-2xl text-ink-600">
        Crea un account senza passare dalla registrazione pubblica: utile per inserire in blocco
        i partecipanti a un percorso di sviluppo. La creazione viene registrata nel tracciato
        delle azioni amministrative.
      </p>

      <div className="mt-8">
        <CreateUserForm />
      </div>
    </>
  );
}
