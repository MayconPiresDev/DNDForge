'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function Navbar() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <header className="w-full border-b bg-background px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-lg font-bold text-foreground hover:opacity-75">
                D&D Forge
            </Link>

            <div className="flex gap-4 items-center">
                <Link href="/dashboard">
                    <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/login">
                    <Button variant="ghost">Login</Button>
                </Link>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    title="Alternar tema"
                >
                    {theme === 'dark' ? '☀️' : '🌙'}
                </Button>
            </div>
        </header>
    )
}
