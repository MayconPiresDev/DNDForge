import { Sword, Shield, Dice5, Sparkles } from 'lucide-react';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800">
            {/* Header Hero */}
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Sword className="w-8 h-8 text-yellow-400" />
                    <Sparkles className="w-6 h-6 text-yellow-200 animate-pulse" />
                    <Shield className="w-8 h-8 text-yellow-400" />
                </div>

                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2">
                    Dungeon Master&#39;s Forge
                </h1>

                <p className="text-xl text-yellow-100 max-w-2xl mx-auto mb-8">
                    Forje seu herói com sabedoria arcana e parta para aventuras épicas!
                </p>
            </div>

            {/* Auth Card */}
            <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm border border-yellow-600/30 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Dice5 className="w-8 h-8 text-yellow-400" />
                        <h2 className="text-2xl font-semibold text-yellow-50">Comece sua Jornada</h2>
                    </div>

                    <GoogleAuthButton />

                    <div className="mt-6 text-center">
                        <p className="text-sm text-yellow-100/80">
                            Ao continuar, você concorda com nossos{' '}
                            <a href="#" className="text-yellow-300 hover:underline">Termos de Aventura</a>
                        </p>
                    </div>
                </div>

                {/* Decorative Footer */}
                <div className="bg-yellow-900/20 py-3 px-6 border-t border-yellow-700/30">
                    <p className="text-xs text-center text-yellow-100/60">
                        Não é um dragão... é só um app incrível!
                    </p>
                </div>
            </div>

            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden -z-10">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-yellow-400/10"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 100}px`,
                            height: `${Math.random() * 300 + 100}px`,
                            filter: 'blur(40px)',
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}
                    />
                ))}
            </div>
        </main>
    );
}