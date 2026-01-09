import { supabase } from "./supabase"
import { redirect } from "react-router"

export const getExistingUser = async (id: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error("Error fetching user profile:", error)
            return null
        }
        return data
    } catch (error) {
        console.error("Error in getExistingUser:", error)
        return null
    }
}

export const storeUserData = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("No authenticated user found")

        const profileData = {
            id: user.id,
            email: user.email,
            name: user.user_metadata.full_name || user.email?.split('@')[0],
            image_url: user.user_metadata.avatar_url || null,
            status: 'user', // Default status
            joined_at: new Date().toISOString(),
        }

        const { data, error } = await supabase
            .from('profiles')
            .upsert(profileData)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error("Error storing user data:", error)
        throw error
    }
}

export const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/',
        },
    })

    if (error) throw error
}

export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export const getUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const profile = await getExistingUser(session.user.id)
    return profile || await storeUserData()
}

export const getAllUsers = async (limit: number, offset: number) => {
    try {
        const { data, count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .range(offset, offset + limit - 1)

        if (error) throw error
        return { users: data || [], total: count || 0 }
    } catch (error) {
        console.error("Error fetching all users:", error)
        return { users: [], total: 0 }
    }
}
