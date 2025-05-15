'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function EditCharacterPage() {
    const { id } = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        alignment: '',
        race: '',
        class: '',
        strength: '',
        dexterity: '',
        constitution: '',
        intelligence: '',
        wisdom: '',
        charisma: ''
    })

    useEffect(() => {
        const fetchCharacter = async () => {
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                alert('Erro ao carregar ficha: ' + error.message)
                router.push('/dashboard')
                return
            }

            setFormData(data)
            setLoading(false)
        }

        fetchCharacter()
    }, [id, router])

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        setSaving(true)

        const { error } = await supabase
            .from('characters')
            .update(formData)
            .eq('id', id)

        if (error) {
            alert('Erro ao atualizar ficha: ' + error.message)
        } else {
            alert('Ficha atualizada com sucesso!')
            router.push('/dashboard')
        }

        setSaving(false)
    }

    if (loading) return <p className="p-4 text-muted-foreground">Carregando ficha...</p>

    return (
        <div className="max-w-xl mx-auto space-y-6 p-6">
            <h1 className="text-2xl font-bold text-foreground">Editar Ficha</h1>

            {Object.entries(formData).map(([field, value]) => (
                field !== 'id' && field !== 'user_id' && field !== 'created_at' && (
                    <div key={field} className="space-y-2">
                        <Label className="capitalize" htmlFor={field}>{field}</Label>
                        <Input
                            id={field}
                            type={field === 'age' || typeof value === 'number' ? 'number' : 'text'}
                            value={value ?? ''}
                            onChange={(e) => handleChange(field, e.target.value)}
                        />
                    </div>
                )
            ))}

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>
        </div>
    )
}
