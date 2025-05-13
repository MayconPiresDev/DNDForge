'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const verifySession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession()

            if (error || !session) {
                setError('Erro ao autenticar. Verifique seu link ou tente novamente.')
                return
            }

            router.push('/dashboard')
        }

        verifySession()
    }, [router])

    if (error) {
        return <p className="text-red-500 p-4">{error}</p>
    }

    return <p className="text-muted-foreground p-4">Autenticando...</p>
}
