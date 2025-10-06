import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }
  const { token } = await req.json()
  if (!token) return NextResponse.json({ error: "Token obrigatório" }, { status: 400 })

  const invite = await db.invite.findUnique({ where: { token } })
  if (!invite) return NextResponse.json({ error: "Convite inválido" }, { status: 404 })
  if (invite.status !== "PENDING")
    return NextResponse.json({ error: "Convite não está ativo" }, { status: 400 })
  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Convite expirado" }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

  await db.$transaction(async (tx) => {
    await tx.tableMember.upsert({
      where: { userId_tableId: { userId: user.id, tableId: invite.tableId } },
      create: { userId: user.id, tableId: invite.tableId, role: invite.role },
      update: {},
    })
    await tx.invite.update({
      where: { id: invite.id },
      data: { status: "USED", usedById: user.id, usedAt: new Date() },
    })
  })

  return NextResponse.json({ ok: true })
}
