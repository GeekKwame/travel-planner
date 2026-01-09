import React from 'react'
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { logoutUser } from "~/lib/auth";
import { cn } from "@/lib/utils";

interface RootNavbarProps {
    user?: {
        status?: string;
        image_url?: string;
    } | null;
}

const RootNavbar = ({ user }: RootNavbarProps) => {
    const navigate = useNavigate();
    const location = useLocation()
    const params = useParams();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/sign-in')
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    return (
        <nav className={cn(location.pathname === `/travel/${params.tripId}` ? 'bg-white' : 'glassmorphism', 'w-full fixed z-50')}>
            <header className="root-nav wrapper">
                <Link to='/' className="link-logo">
                    <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                    <h1>Tourvisto</h1>
                </Link>

                <aside>
                    <nav className="flex items-center gap-6 mr-4">
                        <Link to="/" className={cn('text-base font-normal text-white', { "text-dark-100": location.pathname.startsWith('/travel') || location.pathname === '/my-trips' })}>
                            Explore
                        </Link>
                        {user && (
                            <>
                                <Link to="/my-trips" className={cn('text-base font-normal text-white', { "text-dark-100": location.pathname.startsWith('/travel') || location.pathname === '/my-trips' })}>
                                    My Trips
                                </Link>
                                <Link to="/create-trip" className={cn('text-base font-normal text-white', { "text-dark-100": location.pathname.startsWith('/travel') || location.pathname === '/my-trips' })}>
                                    AI Planner
                                </Link>
                            </>
                        )}
                        {user?.status === 'admin' && (
                            <Link to="/dashboard" className={cn('text-base font-normal text-white', { "text-dark-100": location.pathname.startsWith('/travel') || location.pathname === '/my-trips' })}>
                                Admin
                            </Link>
                        )}
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <img src={user?.image_url || '/assets/images/david.webp'} alt="user" referrerPolicy="no-referrer" className="rounded-full size-8 border border-white/20" />
                            <button onClick={handleLogout} className="cursor-pointer hover:opacity-80 transition-opacity">
                                <img
                                    src="/assets/icons/logout.svg"
                                    alt="logout"
                                    className={cn("size-6 rotate-180", { "filter invert": location.pathname.startsWith('/travel') || location.pathname === '/my-trips' })}
                                />
                            </button>
                        </div>
                    ) : (
                        <Link to="/sign-in" className="text-base font-normal text-white bg-primary-600 px-6 py-2 rounded-full hover:bg-primary-700 transition-all">
                            Sign In
                        </Link>
                    )}
                </aside>
            </header>
        </nav>
    )
}
export default RootNavbar

