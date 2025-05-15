'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from '@/components/ui/select'

type Character = {
    id: string
    name: string
    class: string
    race: string
    user_id: string
}

type Table = {
    id: string
    name: string
    description: string
    master_id: string
    created_at: string
}

type Player = {
    player_id: string
    email: string
}

export default function TableDetailsPage() {
    const { id } = useParams()
    const { user } = useUser()
    const [table, setTable] = useState<Table | null>(null)
    const [linkedCharacters, setLinkedCharacters] = useState<Character[]>([])
    const [myCharacters, setMyCharacters] = useState<Character[]>([])
    const [players, setPlayers] = useState<Player[]>([])
    const [selectedChar, setSelectedChar] = useState<string>('')

    useEffect(() => {
        if (!user) return

        const fetchTable = async () => {
            const { data } = await supabase.from('tables').select('*').eq('id', id).single()
            setTable(data)
        }

        const fetchLinkedCharacters = async () => {
            const { data, error } = await supabase
                .from('character_table_links')
                .select('character_id, characters (id, name, race, class, user_id)')
                .eq('table_id', id)

            if (!error && data) {
                const chars = data.map((link: any) => link.characters)
                setLinkedCharacters(chars)
            }
        }

        const fetchMyCharacters = async () => {
            const { data } = await supabase
                .from('characters')
                .select('id, name, class, race')
                .eq('user_id', user.id)

            setMyCharacters(data || [])
        }

        const fetchPlayers = async () => {
            const { data } = await supabase
                .from('table_players')
                .select('player_id, users (email)')
                .eq('table_id', id)

            if (data) {
                setPlayers(data.map(p => ({
                    player_id: p.player_id,
                    email: p.users.email
                })))
            }
        }

        fetchTable()
        fetchLinkedCharacters()
        fetchMyCharacters()
        fetchPlayers()
    }, [id, user])

    const handleLink = async () => {
        if (!selectedChar) return
        const { error } = await supabase.from('character_table_links').insert({
            character_id: selectedChar,
            table_id: id
        })

        if (!error) {
            const char = myCharacters.find(c => c.id === selectedChar)
            if (char) setLinkedCharacters((prev) => [...prev, char])
        }
    }

    const handleUnlink = async (charId: string) => {
        const confirm = window.confirm('Remover personagem da mesa?')
        if (!confirm) return

        const { error } = await supabase
            .from('character_table_links')
            .delete()
            .eq('character_id', charId)
            .eq('table_id', id)

        if (!error) {
            setLinkedCharacters((prev) => prev.filter(c => c.id !== charId))
        }
    }

    const handleRemovePlayer = async (playerId: string) => {
        const confirm = window.confirm('Deseja remover este jogador da mesa? As fichas dele também serão desvinculadas.')

        if (!confirm) return

        const { error } = await supabase
            .from('table_players')
            .delete()
            .eq('table_id', id)
            .eq('player_id', playerId)

        if (error) {
            alert('Erro ao remover jogador')
            return
        }

        // Remove fichas vinculadas à mesa por esse jogador
        const fichasDoJogador = linkedCharacters.filter(c => c.user_id === playerId).map(c => c.id)

        if (fichasDoJogador.length > 0) {
            await supabase
                .from('character_table_links')
                .delete()
                .eq('table_id', id)
                .in('character_id', fichasDoJogador)
        }

        setPlayers(prev => prev.filter(p => p.player_id !== playerId))
        setLinkedCharacters(prev => prev.filter(c => c.user_id !== playerId))
    }

    if (!table) return <p className="p-4">Carregando mesa...</p>

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">{table.name}</h1>
            <p className="text-muted-foreground">{table.description || 'Sem descrição'}</p>

            {table.master_id === user?.id && (
                <div className="text-sm bg-muted p-3 rounded select-all overflow-x-auto">
                    Link de convite: {`${location.origin}/join/${table.id}`}
                </div>
            )}

            <hr />

            <h2 className="text-lg font-semibold">Adicionar personagem à mesa</h2>

            <div className="max-w-md space-y-2">
                <Label htmlFor="character">Selecione sua ficha</Label>
                <Select onValueChange={(val) => setSelectedChar(val)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Escolha uma ficha" />
                    </SelectTrigger>
                    <SelectContent>
                        {myCharacters.map((char) => (
                            <SelectItem key={char.id} value={char.id}>
                                {char.name} – {char.class}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleLink}>Vincular à Mesa</Button>
            </div>

            <hr />

            <h2 className="text-lg font-semibold">Fichas por Jogador</h2>

            {players.length === 0 ? (
                <p className="text-muted-foreground">Nenhum jogador entrou na mesa ainda.</p>
            ) : (
                players.map((player) => {
                    const playerFichas = linkedCharacters.filter(c => c.user_id === player.player_id)

                    return (
                        <div key={player.player_id} className="border rounded-lg p-4 space-y-2 bg-muted/30 mt-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-sm text-foreground">👤 {player.email}</h3>
                                {table.master_id === user?.id && player.player_id !== user?.id && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-red-600 hover:underline"
                                        onClick={() => handleRemovePlayer(player.player_id)}
                                    >
                                        Remover jogador
                                    </Button>
                                )}
                            </div>

                            {playerFichas.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Sem fichas vinculadas.</p>
                            ) : (
                                <ul className="space-y-1 text-sm">
                                    {playerFichas.map((char) => (
                                        <li
                                            key={char.id}
                                            className="border p-2 rounded bg-background flex justify-between items-center"
                                        >
                                            <span>{char.name} — {char.race} • {char.class}</span>

                                            {char.user_id === user?.id && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleUnlink(char.id)}
                                                >
                                                    Remover
                                                </Button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                })
            )}
        </div>
    )
}