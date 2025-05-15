'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

type Character = {
    id: string
    name: string
    class: string
    race: string
}

type Table = {
    id: string
    name: string
    description: string
    created_at: string
}

export default function TableDetailsPage() {
    const { id } = useParams()
    const { user } = useUser()
    const [table, setTable] = useState<Table | null>(null)
    const [linkedCharacters, setLinkedCharacters] = useState<Character[]>([])
    const [myCharacters, setMyCharacters] = useState<Character[]>([])
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
                .select('character_id, characters (id, name, race, class)')
                .eq('table_id', id)

            if (!error) {
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

        fetchTable()
        fetchLinkedCharacters()
        fetchMyCharacters()
    }, [id, user])

    const handleLink = async () => {
        if (!selectedChar) return
        const { error } = await supabase.from('character_table_links').insert({
            character_id: selectedChar,
            table_id: id,
        })

        if (!error) {
            const char = myCharacters.find(c => c.id === selectedChar)
            if (char) setLinkedCharacters((prev) => [...prev, char])
        }
    }

    if (!table) return <p className="p-4">Carregando mesa...</p>

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">{table.name}</h1>
            <p className="text-muted-foreground">{table.description || 'Sem descrição'}</p>

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

            <h2 className="text-lg font-semibold">Fichas vinculadas</h2>
            {linkedCharacters.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma ficha vinculada ainda.</p>
            ) : (
                <ul className="space-y-2">
                    {linkedCharacters.map((char) => (
                        <li key={char.id} className="border rounded p-3 bg-card flex justify-between items-center">
                            <div>
                                <strong>{char.name}</strong> — {char.race} • {char.class}
                            </div>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={async () => {
                                    const confirm = window.confirm(`Remover "${char.name}" da mesa?`)
                                    if (!confirm) return

                                    const { error } = await supabase
                                        .from('character_table_links')
                                        .delete()
                                        .eq('character_id', char.id)
                                        .eq('table_id', id)

                                    if (!error) {
                                        setLinkedCharacters((prev) => prev.filter((c) => c.id !== char.id))
                                    } else {
                                        alert('Erro ao remover ficha')
                                    }
                                }}
                            >
                                Remover
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}