'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        const { error } = await supabase.auth.signInWithOtp({ email })
        setLoading(false)

        if (error) {
            toast.error('Erro ao enviar link mágico.')
        } else {
            toast.success('Verifique seu e-mail! Link enviado ✨')
            setEmail('')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
            <div className="w-full max-w-md space-y-6 bg-card border border-border rounded-xl p-6 shadow">
                <div className="space-y-1 text-center">
                    <h1 className="text-2xl font-bold text-foreground">Entrar no D&D Forge</h1>
                    <p className="text-muted-foreground text-sm">
                        Use seu e-mail e receba um link mágico para entrar
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
