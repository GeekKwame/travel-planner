import { supabase } from "./supabase"
import type { DashboardStats } from "~/index"

export const getUsersAndTripsStats = async (): Promise<DashboardStats> => {
    const d = new Date();
    const startCurrent = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
    const startPrev = new Date(d.getFullYear(), d.getMonth() - 1, 1).toISOString();
    const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();

    const [
        { count: totalUsers },
        { count: currentMonthUsers },
        { count: lastMonthUsers },
        { count: totalTrips },
        { count: currentMonthTrips },
        { count: lastMonthTrips },
        { count: totalActiveUsers }
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('joined_at', startCurrent),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('joined_at', startPrev).lte('joined_at', endPrev),
        supabase.from('trips').select('*', { count: 'exact', head: true }),
        supabase.from('trips').select('*', { count: 'exact', head: true }).gte('created_at', startCurrent),
        supabase.from('trips').select('*', { count: 'exact', head: true }).gte('created_at', startPrev).lte('created_at', endPrev),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('status', 'user')
    ])

    return {
        totalUsers: totalUsers || 0,
        usersJoined: {
            currentMonth: currentMonthUsers || 0,
            lastMonth: lastMonthUsers || 0
        },
        userRole: {
            total: totalActiveUsers || 0,
            currentMonth: 0, // Simplified for now
            lastMonth: 0
        },
        totalTrips: totalTrips || 0,
        tripsCreated: {
            currentMonth: currentMonthTrips || 0,
            lastMonth: lastMonthTrips || 0
        },
    }
}
