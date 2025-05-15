'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'

type Table = {
    id: string
    name: string
    description: string
    created_at: string
}

export default function TablesPage() {
    const { user, loading: authLoading } = useUser()
    const [tables, setTables] = useState<Table[]>([])
    const [form, setForm] = useState({ name: '', description: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user) return

        const fetchTables = async () => {
            const { data, error } = await supabase
                .from('tables')
                .select('*')
                .eq('master_id', user.id)
                .order('created_at', { ascending: false })

            if (!error) setTables(data || [])
        }

        fetchTables()
    }, [user])

    const handleCreate = async () => {
        if (!form.name.trim()) return

        setLoading(true)
        const { data, error } = await supabase.from('tables').insert({
            name: form.name,
            description: form.description,
            master_id: user?.id
        }).select().single()

        if (!error && data) {
            setTables(prev => [data, ...prev])
            setForm({ name: '', description: '' })
        } else {
            alert('Erro ao criar mesa')
        }

        setLoading(false)
    }

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('Deseja deletar esta mesa?')
        if (!confirm) return

        const { error } = await supabase.from('tables').delete().eq('id', id)
        if (!error) setTables(prev => prev.filter(t => t.id !== id))
    }

    if (authLoading || !user) return <p className="p-4">Carregando...</p>

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Suas Mesas</h1>

            <div className="space-y-2 max-w-md">
                <Label htmlFor="name">Nome da Mesa</Label>
                <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />

                <Label htmlFor="description">Descrição</Label>
                <Input
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />

                <Button onClick={handleCreate} disabled={loading}>
                    {loading ? 'Criando...' : 'Criar Mesa'}
                </Button>
            </div>

            <hr />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tables.map((table) => (
                    <div key={table.id} className="border rounded-lg p-4 space-y-2 bg-card">
                        <h2 className="text-lg font-semibold">{table.name}</h2>
                        <p className="text-sm text-muted-foreground">{table.description || 'Sem descrição'}</p>
                        <p className="text-xs text-muted-foreground">Criada em: {new Date(table.created_at).toLocaleDateString('pt-BR')}</p>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(table.id)}>
                            Deletar
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
