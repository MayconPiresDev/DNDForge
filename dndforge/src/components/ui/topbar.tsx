import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LogoutButton } from '@/components/ui/logout-button'

export function Topbar() {
    return (
        <header className="w-full h-16 flex items-center justify-between px-6 border-b bg-background shadow-sm">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
                D&D Forge
            </h1>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <LogoutButton />
            </div>
        </header>
    )
}
