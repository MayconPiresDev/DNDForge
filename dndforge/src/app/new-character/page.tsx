'use client'

import { useState } from 'react'
import { Step1 } from '@/components/character-steps/Step1'
import { Step2 } from '@/components/character-steps/Step2'
import { Step3 } from '@/components/character-steps/Step3'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'

export default function NewCharacterPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useUser()

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
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

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        if (!user) return
        setLoading(true)

        const { error } = await supabase.from('characters').insert({
            ...formData,
            user_id: user.id
        })

        if (error) {
            alert('Erro ao salvar ficha: ' + error.message)
        } else {
            alert('Ficha salva com sucesso!')
            router.push('/dashboard')
        }

        setLoading(false)
    }

    if (authLoading) return <p className="p-4 text-muted-foreground">Carregando...</p>
    if (!user) return <p className="p-4 text-red-500">Você precisa estar logado para criar uma ficha.</p>

    return (
        <div className="p-6">
            {step === 1 && (
                <Step1 data={formData} onChange={handleChange} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
                <Step2 data={formData} onChange={handleChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />
            )}
            {step === 3 && (
                <Step3 data={formData} onBack={() => setStep(2)} onSubmit={handleSubmit} loading={loading} />
            )}
        </div>
    )
}
