'use client'

import { Button } from '@/components/ui/button'

type Step3Props = {
    data: Record<string, string>
    onBack: () => void
    onSubmit: () => void
    loading: boolean
}

export function Step3({ data, onBack, onSubmit, loading }: Step3Props) {
    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-lg font-medium text-muted-foreground">Etapa 3 de 3 – Revisar e Salvar</h2>

            <div className="space-y-2 text-sm text-muted-foreground">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-border py-1">
                        <span className="capitalize">{key}</span>
                        <span className="text-foreground font-medium">{value}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="secondary" onClick={onBack}>Voltar</Button>
                <Button onClick={onSubmit} disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Ficha'}
                </Button>
            </div>
        </div>
    )
}
