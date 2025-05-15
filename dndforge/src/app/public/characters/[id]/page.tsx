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
        id: '',
        name: '',
        age: '',
        alignment: '',
        race: '',
        class: '',
        avatar_url: '',
        strength: '',
        dexterity: '',
        constitution: '',
        intelligence: '',
        wisdom: '',
        charisma: '',
        is_public: false
    })

    useEffect(() => {
        const fetchCharacter = async () => {
            const { data, error } = await supabase
                .from('characters')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                alert('Erro ao carregar ficha')
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
            .eq('id', formData.id)

        if (error) {
            alert('Erro ao atualizar ficha: ' + error.message)
        } else {
            alert('Ficha atualizada com sucesso!')
            router.push('/dashboard')
        }

        setSaving(false)
    }

    const toggleVisibility = async () => {
        const newValue = !formData.is_public

        const { error } = await supabase
            .from('characters')
            .update({ is_public: newValue })
            .eq('id', formData.id)

        if (error) {
            alert('Erro ao atualizar visibilidade')
        } else {
            setFormData((prev) => ({ ...prev, is_public: newValue }))
        }
    }

    if (loading) return <p className="p-4">Carregando ficha...</p>

    return (
        <div className="max-w-xl mx-auto space-y-6 p-6">
            <h1 className="text-2xl font-bold text-foreground">Editar Ficha</h1>

            {Object.entries(formData).map(([field, value]) => (
                field !== 'id' &&
                field !== 'user_id' &&
                field !== 'created_at' &&
                field !== 'is_public' &&
                (
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

            <hr className="my-6" />

            <div className="space-y-4">
                <h3 className="text-md font-semibold">Compartilhamento público</h3>

                <p className="text-sm text-muted-foreground">
                    {formData.is_public
                        ? 'Esta ficha está pública. Qualquer pessoa com o link pode visualizá-la.'
                        : 'Esta ficha está privada. Apenas você pode visualizá-la.'}
                </p>

                {formData.is_public && (
                    <div className="text-sm bg-muted p-3 rounded select-all overflow-x-auto">
                        {`${location.origin}/public/characters/${formData.id}`}
                    </div>
                )}

                <Button variant="outline" onClick={toggleVisibility}>
                    {formData.is_public ? 'Tornar Privada' : 'Tornar Pública'}
                </Button>
            </div>
        </div>
    )
}
