'use client'

import { Button } from '@/components/ui/button'

export default function TablesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground">Mesas</h1>
            <p className="text-muted-foreground">Crie ou entre em campanhas como mestre ou jogador.</p>

            <Button>Criar nova mesa</Button>

            {/* Aqui vai a listagem de mesas */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-border p-4 rounded-md bg-card">
                    <h3 className="font-semibold">Campanha dos Dragões</h3>
                    <p className="text-sm text-muted-foreground">3 jogadores • mestre: Bea</p>
                </div>
            </div>
        </div>
    )
}
