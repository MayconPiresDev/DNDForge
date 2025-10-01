"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ArrowRight, Dice6, CalendarDays, Users, Shield, Swords } from "lucide-react"
import { motion, animate, useMotionValue, useTransform, useReducedMotion } from "framer-motion"

function AnimatedDice() {
  const prefersReducedMotion = useReducedMotion()
  const [roll, setRoll] = useState<number | null>(null)
  const animProps = prefersReducedMotion
    ? { rotate: 0, y: 0, scale: 1 }
    : {
        rotate: roll ? [0, 360] : 10,
        y: roll ? [0, -4, 0] : [-2, 2, -2],
        scale: roll ? [1, 1.08, 1] : [1, 1.02, 1],
      }

  return (
    <motion.button
      type="button"
      onClick={() => {
        const n = Math.floor(Math.random() * 20) + 1
        setRoll(n)
        if (!prefersReducedMotion) setTimeout(() => setRoll(null), 1000)
      }}
      aria-label="Rolar d20"
      initial={{ rotate: -10, y: 0, scale: 1 }}
      animate={animProps}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              repeat: roll ? 0 : Infinity,
              repeatType: "mirror",
              duration: roll ? 0.6 : 3,
              ease: "easeInOut",
            }
      }
      className="bg-primary/10 ring-primary/20 focus-visible:ring-primary/60 focus-visible:ring-offset-background inline-flex h-9 w-9 items-center justify-center rounded-md ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {roll ? (
        <span className="text-primary text-sm font-semibold">{roll}</span>
      ) : (
        <Dice6 className="text-primary h-5 w-5" />
      )}
    </motion.button>
  )
}

function Stat({ value, suffix = "" }: { value: number; suffix?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const mv = useMotionValue(0)
  const txt = useTransform(mv, (v) => `${Math.floor(v)}${suffix}`)
  useEffect(() => {
    if (prefersReducedMotion) {
      mv.set(value)
      return
    }
    const c = animate(mv, value, { duration: 1.2, ease: "easeOut" })
    return () => c.stop()
  }, [value, prefersReducedMotion])
  return <motion.span>{txt}</motion.span>
}

function CommandMenu() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Busque ações ou digite um comando..." />
      <CommandList>
        <CommandEmpty>Nada encontrado</CommandEmpty>
        <CommandGroup heading="Ações">
          <CommandItem
            onSelect={() => {
              /* TODO: criar mesa */
            }}
          >
            Criar mesa
          </CommandItem>
          <CommandItem
            onSelect={() => {
              /* TODO: enviar convite */
            }}
          >
            Enviar convite
          </CommandItem>
          <CommandItem
            onSelect={() => {
              /* TODO: abrir demo */
            }}
          >
            Abrir demo
          </CommandItem>
          <CommandItem
            onSelect={() => {
              /* TODO: rolar 1d20 */
            }}
          >
            Rolar 1d20
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <main className="bg-background min-h-[100dvh]">
      <CommandMenu />
      <section className="relative overflow-hidden">
        {/* Textura e vinhetas */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[url('/textures/parchment-noise.png')] bg-repeat opacity-[0.08] [image-rendering:pixelated] dark:opacity-[0.12]" />
          <div className="absolute inset-0 bg-[radial-gradient(1000px_420px_at_70%_20%,rgba(124,58,18,0.20),transparent_60%)] opacity-30 dark:opacity-35" />
        </div>

        <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:py-18">
          {/* GRID PRINCIPAL 12 COLS */}
          <div className="grid grid-cols-12 gap-8 lg:gap-10">
            {/* Coluna de texto (7/12) */}
            <div className="col-span-12 lg:col-span-7">
              <span className="text-muted-foreground bg-muted/40 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs tracking-wide uppercase backdrop-blur-sm">
                <AnimatedDice />
                Plataforma para RPG de mesa
              </span>

              {/* Título com microgradiente */}
              <h1 className="mt-4 max-w-[28ch] text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text text-transparent">
                  Crie personagens, mesas e rolagens
                </span>{" "}
                com fluidez — como uma campanha bem narrada.
              </h1>

              <p className="text-muted-foreground mt-4 max-w-[70ch] text-base">
                Simplifica a rotina de mestres e jogadores: fichas guiadas, organização de mesas e
                sessões, chat e rolagens inteligentes — tudo no navegador.
              </p>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <Link href="/signup" className="flex items-center gap-2">
                    Começar agora <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <Link href="/roadmap">Ver roadmap</Link>
                </Button>

                {/* Modal de demo */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:ring-offset-2"
                    >
                      Mesa demo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Mesa demo — rolar agora</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 grid gap-3">
                      {["Ataque 2d20kh1+5", "Dano 1d12+3", "Iniciativa 1d20+2"].map((l) => (
                        <div key={l} className="flex items-center justify-between">
                          <p className="text-sm">{l}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="focus-visible:ring-primary/60 focus-visible:ring-2 focus-visible:ring-offset-2"
                          >
                            Rolar
                          </Button>
                        </div>
                      ))}
                      <p className="text-muted-foreground text-xs">
                        Sem cadastro. Resultados de demonstração.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Prova social com counters animados */}
              <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Swords className="text-primary h-4 w-4" />
                  <Stat value={2100} /> sessões jogadas
                </div>
                <div className="flex items-center gap-2">
                  <Users className="text-primary h-4 w-4" />
                  <Stat value={340} /> mesas ativas
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="text-primary h-4 w-4" />
                  <Stat value={5} suffix="/5" /> satisfação
                </div>
              </div>

              {/* Features alinhadas */}
              <ul className="text-muted-foreground mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <li className="flex items-center gap-2">
                  <Swords className="text-primary h-4 w-4" /> Rolagens avançadas
                </li>
                <li className="flex items-center gap-2">
                  <CalendarDays className="text-primary h-4 w-4" /> Agenda integrada
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="text-primary h-4 w-4" /> Mesas colaborativas
                </li>
              </ul>
            </div>

            {/* Coluna de preview (5/12) */}
            <div className="col-span-12 lg:col-span-5">
              <CardContent className="p-0">
                <div className="relative h-full min-h-[280px]">
                  <div className="ring-border/60 absolute inset-0 rounded-[calc(var(--radius)+4px)] ring-1">
                    <div className="ring-border/40 absolute inset-2 rounded-[calc(var(--radius)+2px)] ring-1" />
                  </div>

                  <div className="relative z-[1] grid h-full gap-4 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-lg leading-none font-semibold">Kara “Lâmina-Âmbar”</h4>
                        <p className="text-muted-foreground mt-1 text-xs">
                          Bárbaro • Nível 3 • Humana
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs">PV</p>
                        <p className="text-base font-semibold">28 / 32</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {[
                        { k: "FOR", v: "+3" },
                        { k: "DES", v: "+2" },
                        { k: "CON", v: "+2" },
                        { k: "INT", v: "0" },
                        { k: "SAB", v: "+1" },
                        { k: "CAR", v: "-1" },
                      ].map((a) => (
                        <div key={a.k} className="bg-muted/50 rounded-md px-2 py-2 text-center">
                          <p className="text-muted-foreground text-[10px] tracking-wide uppercase">
                            {a.k}
                          </p>
                          <p className="text-sm font-medium">{a.v}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {["Ataque (+5)", "Dano (1d12+3)", "Iniciativa (+2)"].map((label) => (
                        <button
                          key={label}
                          className="bg-muted/40 hover:bg-muted/70 focus-visible:ring-primary/60 focus-visible:ring-offset-background rounded-md border border-transparent px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                          type="button"
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="bg-muted/40 rounded-md p-3">
                      <p className="text-xs font-medium">Log de rolagens</p>
                      <ul className="divide-border/60 mt-2 divide-y text-sm">
                        {[
                          ["Ataque 2d20kh1+5", "23"],
                          ["Dano 1d12+3", "11"],
                          ["Iniciativa 1d20+2", "14"],
                        ].map(([l, r]) => (
                          <li key={l} className="flex items-center justify-between py-1.5">
                            <span className="text-muted-foreground">{l}</span>
                            <span className="text-foreground font-medium">{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-muted-foreground flex items-center justify-between text-xs">
                      <span>Mesa: Ruínas de Âmbar</span>
                      <span>Dom, 19:30</span>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-[calc(var(--radius)+4px)] bg-[radial-gradient(600px_220px_at_50%_0%,rgba(0,0,0,0.08),transparent_60%)] dark:bg-[radial-gradient(600px_220px_at_50%_0%,rgba(0,0,0,0.25),transparent_60%)]" />
                </div>
              </CardContent>
            </div>

            {/* LINHA DE CARDS */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }
              }
              className="col-span-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  title: "Por que estamos criando",
                  body: "Fluxos claros e rápidos, arquitetura aberta, plugins por sistema e performance para sessões reais.",
                },
                {
                  title: "Para quem",
                  body: "Mestres organizados e jogadores que querem fichas claras e rápidas — desktop e mobile.",
                },
                {
                  title: "Diferenciais",
                  body: "Notação de dados completa com log, agenda com convites e base extensível por plugins.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { delay: 0.05 * i, duration: 0.4, ease: "easeOut" }
                  }
                >
                  <Card className="hover:shadow-primary/15 h-full transition-shadow hover:shadow-[0_0_0_3px_inset]">
                    <CardContent className="flex h-full flex-col p-6">
                      <h3 className="text-lg font-medium">{item.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">{item.body}</p>
                      <div className="mt-auto" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* GÊNEROS DE RPG */}
            <div className="col-span-12">
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Gêneros de RPG</h2>
              <p className="text-muted-foreground text-sm">
                Escolha o estilo que combina com a mesa — do dungeon crawl ao drama narrativo.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    key: "dnd",
                    title: "Dungeons & Dragons",
                    desc: "Exploração, combate tático e progressão de níveis. O clássico de fantasia heróica.",
                    icon: <Swords className="h-5 w-5" />,
                  },
                  {
                    key: "tatico",
                    title: "Tático",
                    desc: "Posicionamento, coberturas e escolhas estratégicas a cada rodada.",
                    icon: <Shield className="h-5 w-5" />,
                  },
                  {
                    key: "narrativo",
                    title: "Narrativo",
                    desc: "Histórias dirigidas por personagens, regras leves e foco no drama.",
                    icon: <Users className="h-5 w-5" />,
                  },
                ].map((g, i) => (
                  <motion.div
                    key={g.key}
                    initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                    whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { delay: 0.05 * i, duration: 0.4, ease: "easeOut" }
                    }
                  >
                    <Card className="group hover:shadow-primary/15 relative h-full transition-shadow hover:shadow-[0_0_0_3px_inset]">
                      <CardContent className="p-6">
                        <div className="text-primary flex items-center gap-2">
                          {g.icon}
                          <h3 className="text-base font-medium">{g.title}</h3>
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm">{g.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* SEÇÃO FINAL: 8/4 */}
            <div className="col-span-12 grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8">
                <Tabs defaultValue="pilares" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pilares">Pilares</TabsTrigger>
                    <TabsTrigger value="tecnologia">Tecnologia</TabsTrigger>
                    <TabsTrigger value="proximos">Próximos passos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="pilares" className="mt-4">
                    <ul className="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
                      <li>Criação de personagem guiada e validada.</li>
                      <li>Mesas com convites, agenda e chat com rolagens.</li>
                      <li>Log auditável e exportável da sessão.</li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="tecnologia" className="mt-4">
                    <ul className="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
                      <li>Next.js + shadcn/ui para UI acessível.</li>
                      <li>Neon Postgres com SQL e branching.</li>
                      <li>Arquitetura server-first escalável.</li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="proximos" className="mt-4">
                    <ul className="text-muted-foreground list-disc space-y-2 pl-6 text-sm">
                      <li>MVP: Mesas, convites e rolagens.</li>
                      <li>Autenticação e tema claro/escuro.</li>
                      <li>Previews por PR com branches.</li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="col-span-12 lg:col-span-4">
                <Card className="h-full min-h-[200px]">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium">Preview de ficha</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Espaço para um mock de ficha ou uma captura do construtor.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-muted-foreground text-xs">Classe</p>
                        <p className="text-sm font-medium">Bárbaro • Nível 3</p>
                      </div>
                      <div className="bg-muted/50 rounded-md p-3">
                        <p className="text-muted-foreground text-xs">Iniciativa</p>
                        <p className="text-sm font-medium">+2</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
