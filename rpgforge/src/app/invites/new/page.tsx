export default function NewInvitePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <nav className="text-muted-foreground mb-4 text-sm">
        <a href="/tables" className="hover:underline">
          Mesas
        </a>{" "}
        <span>/</span> Enviar convite
      </nav>

      <h1 className="text-2xl font-semibold">Enviar convite</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Placeholder do convite. Informe email ou link compartilhável.
      </p>

      <form className="mt-6 grid gap-4">
        <input
          type="email"
          placeholder="Email do convidado"
          className="bg-background h-10 rounded-md border px-3 text-sm"
        />
        <textarea
          placeholder="Mensagem (opcional)"
          className="bg-background min-h-[96px] rounded-md border p-3 text-sm"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
          >
            Enviar
          </button>
          <a href="/tables" className="hover:bg-muted rounded-md border px-4 py-2 text-sm">
            Cancelar
          </a>
        </div>
      </form>
    </main>
  )
}
