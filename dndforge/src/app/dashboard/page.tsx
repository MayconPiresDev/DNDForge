'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'

export default function DashboardPage() {
    const { user, loading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading || !user) return <p className="text-sm text-muted-foreground">Carregando...</p>

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Suas Fichas</h1>
            <p className="text-muted-foreground">Aqui você verá todas as fichas criadas e poderá gerenciá-las.</p>
        </div>
    )
}
