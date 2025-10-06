// src/app/(actions)/start-actions.ts
"use server"

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"

export async function startNow() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin?next=/tables/new")
  redirect("/tables/new")
}

export async function viewRoadmap() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/auth/signin?next=/tables")
  redirect("/tables")
}
