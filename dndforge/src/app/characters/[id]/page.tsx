'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Pencil, Trash2 } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { CharacterPDF } from '@/components/pdf/CharacterPDF'
import { toast } from 'sonner'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

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

    const [notes, setNotes] = useState<{ id: string, content: string, user_id: string }[]>([])
    const [newNote, setNewNote] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingText, setEditingText] = useState('')
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null)

    useEffect(() => {
        const fetchCharacter = async () => {
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                toast.error('Ficha não encontrada ou acesso negado.')
                router.push('/dashboard')
                return
            }

            setCharacter(data)
            setLoading(false)
        }

        fetchCharacter()
    }, [id, router])

    useEffect(() => {
        const fetchNotes = async () => {
            const { data } = await supabase
                .from('character_notes')
                .select('id, content, user_id')
                .eq('character_id', id)
                .order('created_at', { ascending: false })

            if (data) setNotes(data)
        }

        if (character) fetchNotes()
    }, [character, id])

    const handleDeleteNote = async (noteId: string) => {
        const { error } = await supabase.from('character_notes').delete().eq('id', noteId)
        if (error) {
            toast.error('Erro ao deletar nota.')
        } else {
            setNotes((prev) => prev.filter((n) => n.id !== noteId))
            toast.success('Nota deletada.')
        }
        setNoteToDelete(null)
    }

    if (loading || !character) return <p className="p-4">Carregando ficha...</p>

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => router.back()}>
                ← Voltar
            </Button>

            <PDFDownloadLink
                document={<CharacterPDF character={character} notes={notes} />}
                fileName={`${character.name.replace(/\s+/g, '_')}.pdf`}
            >
                {({ loading }) => (
                    <Button variant="outline" className="mb-4">
                        {loading ? 'Gerando PDF...' : 'Exportar como PDF'}
                    </Button>
                )}
            </PDFDownloadLink>

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

            <hr className="my-6" />
            <h2 className="text-xl font-semibold">📝 Notas</h2>

            <div className="space-y-4 mt-4">
                <div className="flex flex-col gap-2">
                    <Textarea
                        placeholder="Escreva uma nova nota..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button
                        onClick={async () => {
                            if (!newNote.trim()) return

                            const { error, data } = await supabase
                                .from('character_notes')
                                .insert({
                                    character_id: id,
                                    user_id: user?.id,
                                    content: newNote
                                })
                                .select()
                                .single()

                            if (!error && data) {
                                setNotes((prev) => [data, ...prev])
                                setNewNote('')
                                toast.success('Nota adicionada.')
                            } else {
                                toast.error('Erro ao adicionar nota.')
                            }
                        }}
                    >
                        Adicionar Nota
                    </Button>
                </div>

                {notes.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Sem notas por enquanto.</p>
                ) : (
                    <ul className="space-y-3">
                        {notes.map((note) => (
                            <li key={note.id} className="bg-muted p-3 rounded flex justify-between items-start gap-4">
                                {editingId === note.id ? (
                                    <div className="flex-1 space-y-2">
                                        <Textarea
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={async () => {
                                                    const { error } = await supabase
                                                        .from('character_notes')
                                                        .update({ content: editingText })
                                                        .eq('id', note.id)

                                                    if (!error) {
                                                        setNotes((prev) =>
                                                            prev.map((n) => (n.id === note.id ? { ...n, content: editingText } : n))
                                                        )
                                                        setEditingId(null)
                                                        setEditingText('')
                                                        toast.success('Nota atualizada.')
                                                    } else {
                                                        toast.error('Erro ao salvar edição.')
                                                    }
                                                }}
                                            >
                                                Salvar
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingId(null)
                                                    setEditingText('')
                                                }}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="flex-1 text-sm whitespace-pre-wrap">{note.content}</p>
                                        {note.user_id === user?.id && (
                                            <div className="flex flex-col items-end gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setEditingId(note.id)
                                                        setEditingText(note.content)
                                                    }}
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => setNoteToDelete(note.id)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Deseja remover esta nota?</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setNoteToDelete(null)}
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => noteToDelete && handleDeleteNote(noteToDelete)}
                                                            >
                                                                Remover
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        )}
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
