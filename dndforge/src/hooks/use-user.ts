'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useUser() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getUser().then(({ data, error }) => {
            if (!error) setUser(data.user)
            setLoading(false)
        })
    }, [])

    return { user, loading }
}
