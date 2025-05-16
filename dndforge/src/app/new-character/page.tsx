'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function NewCharacterPage() {
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        age: '',
        alignment: '',
        race: '',
        class: '',
    })

    const onChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const isValid = form.name && form.race && form.class

    return (
        <div className="max-w-xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Criar Nova Ficha</h1>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => onChange('name', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                        id="age"
                        type="number"
                        value={form.age}
                        onChange={(e) => onChange('age', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="alignment">Alinhamento</Label>
                    <Select value={form.alignment} onValueChange={(val) => onChange('alignment', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha o alinhamento" />
                        </SelectTrigger>
                        <SelectContent>
                            {[
                                'Leal e Bom', 'Neutro e Bom', 'Caótico e Bom',
                                'Leal e Neutro', 'Neutro', 'Caótico e Neutro',
                                'Leal e Mau', 'Neutro e Mau', 'Caótico e Mau'
                            ].map(alignment => (
                                <SelectItem key={alignment} value={alignment}>
                                    {alignment}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="race">Raça</Label>
                    <Select value={form.race} onValueChange={(val) => onChange('race', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha a raça" />
                        </SelectTrigger>
                        <SelectContent>
                            {[
                                'Humano', 'Elfo', 'Anão', 'Halfling',
                                'Meio-orc', 'Meio-elfo', 'Draconato', 'Tiefling', 'Gnomo'
                            ].map(race => (
                                <SelectItem key={race} value={race}>
                                    {race}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="class">Classe</Label>
                    <Select value={form.class} onValueChange={(val) => onChange('class', val)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha a classe" />
                        </SelectTrigger>
                        <SelectContent>
                            {[
                                'Bárbaro', 'Bardo', 'Bruxo', 'Clérigo',
                                'Druida', 'Feiticeiro', 'Guerreiro', 'Ladino',
                                'Mago', 'Monge', 'Paladino', 'Patrulheiro'
                            ].map(classe => (
                                <SelectItem key={classe} value={classe}>
                                    {classe}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end">
                <Button disabled={!isValid} onClick={() => alert('Ir para próximo passo')}>
                    Próximo
                </Button>
            </div>
        </div>
    )
}
