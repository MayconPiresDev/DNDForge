export default function NewTablePage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <nav className="mb-4 text-sm text-muted-foreground">
        <a href="/tables" className="hover:underline">Mesas</a> <span>/</span> Criar mesa
      </nav>

      <h1 className="text-2xl font-semibold">Criar mesa</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Placeholder do formulário de criação. Adicione nome, sistema e horário.
      </p>

      <form className="mt-6 grid gap-4">
        <input
          type="text"
          placeholder="Nome da mesa"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <input
          type="text"
          placeholder="Sistema (ex.: D&D 5e)"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <input
          type="text"
          placeholder="Horário (ex.: Dom, 19:30)"
          className="h-10 rounded-md border bg-background px-3 text-sm"
        />
        <div className="flex gap-3">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            Salvar
          </button>
          <a href="/tables" className="rounded-md border px-4 py-2 text-sm hover:bg-muted">
            Cancelar
          </a>
        </div>
      </form>
    </main>
  )
}
