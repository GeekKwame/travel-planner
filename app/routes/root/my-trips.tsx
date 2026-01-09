import { getAllTrips } from '~/lib/trips';
import { useLoaderData, Link, redirect } from 'react-router';
import Header from '@/components/Header';
import { TripCard } from '../../../components';
import { getUser } from '~/lib/auth';
import { parseTripData } from '@/lib/utils';

export async function clientLoader() {
    try {
        const user = await getUser();
        if (!user) return redirect('/sign-in');

        const { allTrips } = await getAllTrips(100, 0);
        // Filter trips by the current user's ID
        const myTrips = allTrips.filter((trip: any) => trip.user_id === user.id);

        return {
            trips: myTrips.map(trip => ({
                ...trip,
                details: parseTripData(trip.trip_details)
            }))
        };
    } catch (error) {
        console.error("Error loading my trips:", error);
        return { trips: [] };
    }
}

const MyTrips = () => {
    const { trips } = useLoaderData<typeof clientLoader>();

    return (
        <main className="min-h-screen bg-light-200 pt-32 pb-20">
            <div className="wrapper flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Header
                        title="My Travel Experiences"
                        description="View and manage all your personally curated AI travel plans."
                    />
                    <Link to="/create-trip" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all font-medium whitespace-nowrap w-fit">
                        <img src="/assets/icons/magic-star.svg" alt="magic" className="size-5" />
                        Plan New Trip
                    </Link>
                </div>

                <section>
                    {trips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trips.map((trip: any) => (
                                <TripCard
                                    key={trip.id}
                                    id={trip.id}
                                    name={trip.name}
                                    imageUrl={trip.image_urls?.[0] || '/assets/images/sample.jpeg'}
                                    location={trip.details?.itinerary?.[0]?.location || 'Unknown Location'}
                                    tags={trip.tags || []}
                                    price={trip.estimated_price}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <img src="/assets/icons/magic-star.svg" className="size-16 opacity-20 mb-4" alt="empty" />
                            <p className="text-gray-500 text-lg font-medium">You haven't generated any AI trips yet.</p>
                            <Link to="/create-trip" className="mt-4 text-primary-600 font-semibold hover:underline">
                                Start your first plan with AI →
                            </Link>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default MyTrips;
