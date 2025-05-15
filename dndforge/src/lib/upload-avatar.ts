import { supabase } from './supabase'

export async function uploadAvatar(file: File, userId: string) {
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${userId}_${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    return publicUrlData.publicUrl
}
