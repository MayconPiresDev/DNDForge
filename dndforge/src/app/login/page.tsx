'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`, // redirecionamento automático
            },
        })

        if (error) {
            alert('Erro ao enviar link: ' + error.message)
        } else {
            alert('Link mágico enviado! Verifique seu e-mail 📩')
        }

        setLoading(false)
    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-md space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">Entrar no D&D Forge</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Acesse com seu e-mail e receba um link mágico ✨
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <Button
                    className="w-full"
                    onClick={handleLogin}
                    disabled={loading || !email}
                >
                    {loading ? 'Enviando...' : 'Enviar Magic Link'}
                </Button>
            </div>
        </div>
    )
}