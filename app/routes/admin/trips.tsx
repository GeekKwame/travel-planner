import { getAllTrips } from '~/lib/trips';
import { useLoaderData, Link } from 'react-router';
import Header from '@/components/Header';
import { TripCard } from '../../../components';

export async function clientLoader() {
    try {
        const { allTrips } = await getAllTrips(100, 0);
        return { trips: allTrips };
    } catch (error) {
        console.error("Error loading trips:", error);
        return { trips: [] };
    }
}

const Trips = () => {
    const { trips } = useLoaderData<typeof clientLoader>();

    return (
        <main className="dashboard wrapper">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Header
                    title="All Trips"
                    description="Manage and view all your curated travel experiences."
                />
                <Link to="/admin/create-trip" className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all font-medium whitespace-nowrap w-fit">
                    <img src="/assets/icons/magic-star.svg" alt="magic" className="size-5" />
                    Generate New AI Trip
                </Link>
            </div>

            <section className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.length > 0 ? (
                        trips.map((trip: any) => (
                            <TripCard
                                key={trip.id}
                                id={trip.id}
                                name={trip.name}
                                imageUrl={trip.image_urls?.[0] || '/assets/images/sample.jpeg'}
                                location={trip.itinerary?.[0]?.location || 'Unknown Location'}
                                tags={trip.tags || []}
                                price={trip.estimatedPrice}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No trips found.</p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default Trips;
