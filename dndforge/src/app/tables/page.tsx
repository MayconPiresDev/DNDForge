'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

type Table = {
    id: string
    name: string
    description: string
    master_id: string
    created_at: string
}

export default function TablesPage() {
    const { user } = useUser()
    const [tables, setTables] = useState<Table[]>([])
    const [form, setForm] = useState({ name: '', description: '' })
    const [loading, setLoading] = useState(false)
    const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null)
    const router = useRouter()

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

        const { data, error } = await supabase
            .from('tables')
            .insert({
                name: form.name,
                description: form.description,
                master_id: user?.id
            })
            .select()
            .single()

        if (!error && data) {
            setTables(prev => [data, ...prev])
            setForm({ name: '', description: '' })
            toast.success('Mesa criada com sucesso!')
        } else {
            toast.error('Erro ao criar mesa.')
        }

        setLoading(false)
    }

    const handleDelete = async (tableId: string) => {
        const { error } = await supabase.from('tables').delete().eq('id', tableId)
        if (!error) {
            setTables(prev => prev.filter(t => t.id !== tableId))
            toast.success('Mesa deletada.')
        } else {
            toast.error('Erro ao deletar mesa.')
        }
        setSelectedToDelete(null)
    }

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
                    <div
                        key={table.id}
                        onClick={() => router.push(`/tables/${table.id}`)}
                        className="border rounded-lg p-4 space-y-2 bg-card cursor-pointer hover:ring-2 ring-ring transition"
                    >
                        <h2 className="text-lg font-semibold">{table.name}</h2>
                        <p className="text-sm text-muted-foreground">
                            {table.description || 'Sem descrição'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Criada em: {new Date(table.created_at).toLocaleDateString('pt-BR')}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            Jogadores: — | Fichas: —
                        </p>

                        {table.master_id === user?.id && (
                            <>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigator.clipboard.writeText(`${location.origin}/join/${table.id}`)
                                        toast.success('Link de convite copiado!')
                                    }}
                                >
                                    Copiar Link de Convite
                                </Button>

                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedToDelete(table.id)
                                            }}
                                        >
                                            Deletar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Deseja excluir a mesa "{table.name}"?</DialogTitle>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setSelectedToDelete(null)}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDelete(table.id)}
                                            >
                                                Confirmar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
