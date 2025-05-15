'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'

export default function JoinTablePage() {
    const { id } = useParams()
    const router = useRouter()
    const { user, loading: userLoading } = useUser()
    const [joined, setJoined] = useState(false)
    const [message, setMessage] = useState('Entrando na mesa...')

    useEffect(() => {
        if (userLoading) return
        if (!user) {
            setMessage('Você precisa estar logado para entrar em uma mesa.')
            return
        }

        const joinTable = async () => {
            // Verifica se já está na mesa
            const { data: existing } = await supabase
                .from('table_players')
                .select('*')
                .eq('table_id', id)
                .eq('player_id', user.id)
                .maybeSingle()

            if (existing) {
                setMessage('Você já está nesta mesa.')
                setJoined(true)
                return
            }

            // Faz o insert
            const { error } = await supabase.from('table_players').insert({
                table_id: id,
                player_id: user.id
            })

            if (error) {
                setMessage('Erro ao entrar na mesa.')
            } else {
                setMessage('Você entrou na mesa com sucesso!')
                setJoined(true)
            }
        }

        joinTable()
    }, [id, user, userLoading])

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-2">Convite para Mesa</h1>
            <p>{message}</p>
            {joined && (
                <button
                    className="mt-4 underline text-blue-600"
                    onClick={() => router.push('/tables')}
                >
                    Ir para Minhas Mesas
                </button>
            )}
        </div>
    )
}
