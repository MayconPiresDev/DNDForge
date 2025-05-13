import Link from "next/link"

const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/new-character", label: "Nova Ficha" },
    { href: "/tables", label: "Mesas" }
]

export function Sidebar() {
    return (
        <aside className="w-64 h-full border-r px-6 py-10 bg-muted text-muted-foreground hidden md:block">
            <nav className="flex flex-col gap-6 text-sm">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-foreground font-medium transition"
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
