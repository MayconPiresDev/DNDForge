import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function NewTablePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <nav className="text-muted-foreground mb-4 text-sm">
        <a href="/tables" className="hover:underline">
          Mesas
        </a>{" "}
        <span>/</span> Criar mesa
      </nav>

      <h1 className="text-2xl font-semibold">Criar mesa</h1>
      <p className="text-muted-foreground mt-2 text-sm">
        Placeholder do formulário de criação. Adicione nome, sistema e horário.
      </p>

      <form className="mt-6 grid gap-4">
        <input
          type="text"
          placeholder="Nome da mesa"
          className="bg-background h-10 rounded-md border px-3 text-sm"
        />
        <input
          type="text"
          placeholder="Sistema (ex.: D&D 5e)"
          className="bg-background h-10 rounded-md border px-3 text-sm"
        />
        <input
          type="text"
          placeholder="Horário (ex.: Dom, 19:30)"
          className="bg-background h-10 rounded-md border px-3 text-sm"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm"
          >
            Salvar
          </button>
          <a href="/tables" className="hover:bg-muted rounded-md border px-4 py-2 text-sm">
            Cancelar
          </a>
        </div>
      </form>
    </main>
  )
}
