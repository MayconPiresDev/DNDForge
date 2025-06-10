'use client';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export default function GoogleAuthButton() {
    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <motion.button
            onClick={handleLogin}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-all border border-gray-600"
        >
            <FcGoogle className="w-6 h-6" />
            <span className="font-medium">Entrar com Google</span>
        </motion.button>
    );
}