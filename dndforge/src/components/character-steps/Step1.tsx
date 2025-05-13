'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

type Step1Props = {
    data: {
        name: string
        age: string
        alignment: string
        race: string
        class: string
    }
    onChange: (field: string, value: string) => void
    onNext: () => void
}

const races = ['Humano', 'Elfo', 'Anão', 'Halfling', 'Meio-orc', 'Meio-elfo', 'Draconato', 'Tiefling', 'Gnomo']
const classes = ['Bárbaro', 'Bardo', 'Bruxo', 'Clérigo', 'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino', 'Mago', 'Monge', 'Paladino', 'Patrulheiro']
const alignments = [
    'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
    'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
    'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
]

export function Step1({ data, onChange, onNext }: Step1Props) {
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-lg font-medium text-muted-foreground">Etapa 1 de 3 – Identidade</h2>

            <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={data.name} onChange={(e) => onChange('name', e.target.value)} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input id="age" type="number" value={data.age} onChange={(e) => onChange('age', e.target.value)} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="alignment">Alinhamento</Label>
                <Select value={data.alignment} onValueChange={(value) => onChange('alignment', value)}>
                    <SelectTrigger id="alignment">
                        <SelectValue placeholder="Escolha o alinhamento" />
                    </SelectTrigger>
                    <SelectContent>
                        {alignments.map((alignment) => (
                            <SelectItem key={alignment} value={alignment}>
                                {alignment}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="race">Raça</Label>
                <Select value={data.race} onValueChange={(value) => onChange('race', value)}>
                    <SelectTrigger id="race">
                        <SelectValue placeholder="Escolha a raça" />
                    </SelectTrigger>
                    <SelectContent>
                        {races.map((race) => (
                            <SelectItem key={race} value={race}>
                                {race}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Select value={data.class} onValueChange={(value) => onChange('class', value)}>
                    <SelectTrigger id="class">
                        <SelectValue placeholder="Escolha a classe" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={onNext} disabled={!data.name || !data.race || !data.class}>
                    Próximo
                </Button>
            </div>
        </div>
    )
}
