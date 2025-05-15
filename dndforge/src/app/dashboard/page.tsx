'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog'
import { toast } from 'sonner'

type Character = {
    id: string
    name: string
    class: string
    race: string
    avatar_url?: string
    is_public: boolean
    created_at: string
}

export default function DashboardPage() {
    const { user, loading: authLoading } = useUser()
    const [characters, setCharacters] = useState<Character[]>([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
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
                .select('id, name, class, race, avatar_url, is_public, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                toast.error('Erro ao carregar fichas.')
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

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button
                                            className="text-sm text-red-600 hover:underline"
                                            onClick={() => setDeletingId(char.id)}
                                        >
                                            Deletar
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Deseja deletar a ficha "{char.name}"?</DialogTitle>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setDeletingId(null)}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={async () => {
                                                    const { error } = await supabase.from('characters').delete().eq('id', char.id)
                                                    if (!error) {
                                                        setCharacters((prev) => prev.filter((c) => c.id !== char.id))
                                                        toast.success('Ficha deletada com sucesso.')
                                                    } else {
                                                        toast.error('Erro ao deletar ficha.')
                                                    }
                                                    setDeletingId(null)
                                                }}
                                            >
                                                Deletar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Visibilidade pública */}
                            {char.is_public && (
                                <div className="text-xs bg-muted p-2 rounded mt-2 select-all overflow-x-auto">
                                    Link público: {`${location.origin}/public/characters/${char.id}`}
                                </div>
                            )}

                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={async () => {
                                    const { error } = await supabase
                                        .from('characters')
                                        .update({ is_public: !char.is_public })
                                        .eq('id', char.id)

                                    if (error) {
                                        toast.error('Erro ao atualizar visibilidade.')
                                        return
                                    }

                                    setCharacters((prev) =>
                                        prev.map((c) =>
                                            c.id === char.id ? { ...c, is_public: !char.is_public } : c
                                        )
                                    )

                                    toast.success(
                                        char.is_public ? 'Ficha agora é privada.' : 'Ficha agora é pública.'
                                    )
                                }}
                            >
                                {char.is_public ? '🔒 Tornar Privada' : '🔓 Tornar Pública'}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
