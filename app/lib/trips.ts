import { supabase } from "./supabase"

export const getAllTrips = async (limit: number, offset: number) => {
    try {
        const { data, count, error } = await supabase
            .from('trips')
            .select('*', { count: 'exact' })
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false })

        if (error) throw error
        return { allTrips: data || [], total: count || 0 }
    } catch (error) {
        console.error("Error fetching all trips:", error)
        return { allTrips: [], total: 0 }
    }
}

export const getTripById = async (tripId: string) => {
    try {
        const { data, error } = await supabase
            .from('trips')
            .select('*')
            .eq('id', tripId)
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error("Error fetching trip by ID:", error)
        return null
    }
}
