"use client"

import { useState } from "react"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <main style={{ maxWidth: 420, margin: "48px auto", display: "grid", gap: 12 }}>
      <h1>Criar conta</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          setMsg(null)
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, name }),
          })
          const json = await res.json()
          setMsg(res.ok ? "Conta criada. Faça login." : json.error || "Erro ao criar conta.")
          setLoading(false)
        }}
        style={{ display: "grid", gap: 8 }}
      >
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={loading} type="submit">
          Registrar
        </button>
      </form>
      {msg && <p>{msg}</p>}
    </main>
  )
}
