"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [pwdEmail, setPwdEmail] = useState("")
  const [pwd, setPwd] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <main style={{ maxWidth: 420, margin: "48px auto", display: "grid", gap: 16 }}>
      <h1>Entrar</h1>

      <button onClick={() => signIn("google")} disabled={loading}>
        Continuar com Google
      </button>

      <hr />

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          await signIn("email", { email, callbackUrl: "/" })
          setLoading(false)
        }}
        style={{ display: "grid", gap: 8 }}
      >
        <label>Entrar com link mágico</label>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Enviar link
        </button>
      </form>

      <hr />

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setLoading(true)
          await signIn("credentials", { email: pwdEmail, password: pwd, callbackUrl: "/" })
          setLoading(false)
        }}
        style={{ display: "grid", gap: 8 }}
      >
        <label>Entrar com email e senha</label>
        <input
          type="email"
          placeholder="email"
          value={pwdEmail}
          onChange={(e) => setPwdEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="senha"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Entrar
        </button>
      </form>
    </main>
  )
}
