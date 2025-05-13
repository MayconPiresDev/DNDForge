'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

type Step2Props = {
    data: {
        strength: string
        dexterity: string
        constitution: string
        intelligence: string
        wisdom: string
        charisma: string
    }
    onChange: (field: string, value: string) => void
    onNext: () => void
    onBack: () => void
}

export function Step2({ data, onChange, onNext, onBack }: Step2Props) {
    const atributos = [
        { id: 'strength', label: 'Força' },
        { id: 'dexterity', label: 'Destreza' },
        { id: 'constitution', label: 'Constituição' },
        { id: 'intelligence', label: 'Inteligência' },
        { id: 'wisdom', label: 'Sabedoria' },
        { id: 'charisma', label: 'Carisma' },
    ]

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-lg font-medium text-muted-foreground">Etapa 2 de 3 – Atributos</h2>

            {atributos.map((attr) => (
                <div key={attr.id} className="space-y-2">
                    <Label htmlFor={attr.id}>{attr.label}</Label>
                    <Input
                        id={attr.id}
                        type="number"
                        value={data[attr.id as keyof typeof data]}
                        onChange={(e) => onChange(attr.id, e.target.value)}
                        min={1}
                        max={30}
                    />
                </div>
            ))}

            <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={onBack}>Voltar</Button>
                <Button onClick={onNext}>Próximo</Button>
            </div>
        </div>
    )
}
