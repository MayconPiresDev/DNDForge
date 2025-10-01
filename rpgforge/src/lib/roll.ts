import { Dice } from "@scio/dice-typescript"

type DiceResultLike = { total: number }

const dice = new Dice()

export function roll(expr: string): { total: number; detail: string } {
  const res = dice.roll(expr) as DiceResultLike
  const total = res.total
  const detail = `${expr} → ${total}`
  return { total, detail }
}
