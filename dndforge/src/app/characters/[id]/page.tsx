'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'

type Character = {
    id: string
    name: string
    age: string
    alignment: string
    race: string
    class: string
    avatar_url?: string
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
    created_at: string
}

export default function CharacterDetailsPage() {
    const { id } = useParams()
    const router = useRouter()
    const { user } = useUser()
    const [character, setCharacter] = useState<Character | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCharacter = async () => {
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                alert('Ficha não encontrada ou você não tem acesso.')
                router.push('/dashboard')
                return
            }

            setCharacter(data)
            setLoading(false)
        }

        fetchCharacter()
    }, [id, router])

    if (loading || !character) return <p className="p-4">Carregando ficha...</p>

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => router.back()}>
                ← Voltar
            </Button>

            {character.avatar_url && (
                <img
                    src={character.avatar_url}
                    alt={character.name}
                    className="w-full h-64 object-cover rounded-lg"
                />
            )}

            <div>
                <h1 className="text-3xl font-bold">{character.name}</h1>
                <p className="text-muted-foreground">
                    {character.race} • {character.class}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    Idade: {character.age} • Alinhamento: {character.alignment}
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Atributos</h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    {[
                        ['Força', character.strength],
                        ['Destreza', character.dexterity],
                        ['Constituição', character.constitution],
                        ['Inteligência', character.intelligence],
                        ['Sabedoria', character.wisdom],
                        ['Carisma', character.charisma]
                    ].map(([label, value]) => (
                        <li
                            key={label}
                            className="border p-3 rounded bg-card flex justify-between items-center"
                        >
                            <span>{label}</span>
                            <strong className="text-foreground">{value}</strong>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
