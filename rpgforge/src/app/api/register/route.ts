import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const exists = await db.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }

    const user = await db.user.create({ data: { email, name: name || null } })
    const hashed = await hash(password, 10)
    await db.password.create({ data: { userId: user.id, hash: hashed } })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 })
  }
}
