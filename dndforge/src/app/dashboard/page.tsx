'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/navigation'

type Character = {
    id: string
    name: string
    class: string
    race: string
    created_at: string
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useUser()
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) router.push('/login')
    }, [user, authLoading, router])

    useEffect(() => {
        if (!user) return

        const fetchCharacters = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('characters')
                .select('id, name, class, race, avatar_url, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error(error)
            } else {
                setCharacters(data || [])
            }

            setLoading(false)
        }

        fetchCharacters()
    }, [user])

    if (authLoading || loading) {
        return <p className="p-4 text-muted-foreground">Carregando suas fichas...</p>
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Suas Fichas</h1>

            {characters.length === 0 ? (
                <p className="text-muted-foreground">Você ainda não criou nenhuma ficha.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {characters.map((char) => (
                        <div
                            key={char.id}
                            className="border border-border rounded-lg p-4 bg-card shadow-sm space-y-2"
                        >
                            {char.avatar_url && (
                                <img
                                    src={char.avatar_url}
                                    alt={char.name}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                            )}

                            <h3 className="text-lg font-semibold">{char.name}</h3>
                            <p className="text-sm text-muted-foreground">
                                {char.race} • {char.class}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Criado em: {new Date(char.created_at).toLocaleDateString('pt-BR')}
                            </p>

                            <div className="flex flex-wrap gap-2 pt-2">
                                <button
                                    className="text-sm text-foreground hover:underline"
                                    onClick={() => router.push(`/characters/${char.id}`)}
                                >
                                    Ver Ficha
                                </button>

                                <button
                                    className="text-sm text-blue-600 hover:underline"
                                    onClick={() => router.push(`/edit/${char.id}`)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="text-sm text-red-600 hover:underline"
                                    onClick={async () => {
                                        const confirm = window.confirm(`Deseja mesmo deletar "${char.name}"?`)
                                        if (!confirm) return
                                        const { error } = await supabase.from('characters').delete().eq('id', char.id)
                                        if (!error) setCharacters(prev => prev.filter(c => c.id !== char.id))
                                        else alert('Erro ao deletar')
                                    }}
                                >
                                    Deletar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
