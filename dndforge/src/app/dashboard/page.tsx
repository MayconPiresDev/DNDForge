'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

type Character = {
    id: string
    name: string
    race: string
    class: string
    created_at: string
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useUser()
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (!user) return

        const fetchCharacters = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('characters')
                .select('id, name, class, race, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error) {
                setCharacters(data || [])
            } else {
                console.error(error)
            }

            setLoading(false)
        }

        fetchCharacters()
    }, [user])

    if (authLoading || loading) {
        return <p className="p-4 text-muted-foreground">Carregando fichas...</p>
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Suas Fichas</h1>
                <Button onClick={() => router.push('/new-character')}>Criar nova ficha</Button>
            </div>

            {characters.length === 0 ? (
                <p className="text-muted-foreground">Você ainda não criou nenhuma ficha.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((char) => (
                        <div key={char.id} className="border rounded-lg p-4 bg-card space-y-2">
                            <h2 className="text-lg font-semibold">{char.name}</h2>
                            <p className="text-sm text-muted-foreground">
                                {char.race} • {char.class}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Criado em: {new Date(char.created_at).toLocaleDateString('pt-BR')}
                            </p>

                            <div className="flex gap-2 pt-2">
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/characters/${char.id}`)}>Ver</Button>
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/edit/${char.id}`)}>Editar</Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                        const confirm = window.confirm(`Deseja mesmo deletar "${char.name}"?`)
                                        if (!confirm) return
                                        const { error } = await supabase.from('characters').delete().eq('id', char.id)
                                        if (!error) setCharacters(prev => prev.filter(c => c.id !== char.id))
                                        else alert('Erro ao deletar')
                                    }}
                                >
                                    Excluir
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
