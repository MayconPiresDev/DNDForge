export default function TablesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Mesas</h1>
        <a
          href="/tables/new"
          className="hover:bg-muted inline-flex items-center rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Nova mesa
        </a>
      </header>

      <p className="text-muted-foreground text-sm">
        Ainda não há mesas. Crie a primeira para começar.
      </p>
    </main>
  )
}
