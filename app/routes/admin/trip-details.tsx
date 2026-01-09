import { useParams, useLoaderData } from 'react-router';
import { getTripById } from '~/lib/trips';
import Header from '@/components/Header';
import { cn, parseTripData } from '@/lib/utils';

export async function clientLoader({ params }: { params: { id: string } }) {
  try {
    const trip = await getTripById(params.id);
    if (!trip) {
      throw new Response("Trip not found", { status: 404 });
    }
    return {
      trip: {
        ...trip,
        ...parseTripData(trip.trip_details),
        imageUrls: trip.image_urls || []
      }
    };
  } catch (error) {
    console.error("Error loading trip:", error);
    throw error;
  }
}

const TripDetails = () => {
  const { trip } = useLoaderData<typeof clientLoader>();

  const mainImage = trip.imageUrls?.[0] || '/assets/images/sample.jpeg';
  const otherImages = trip.imageUrls?.slice(1) || [];

  return (
    <main className="dashboard wrapper">
      <Header
        title={trip.name || "Trip Details"}
        description={`Explore the details of ${trip.name}`}
      />

      <section className="flex flex-col gap-8 mt-6">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px]">
          <div className={cn("md:col-span-2 md:row-span-2 h-full rounded-xl overflow-hidden relative group")}>
            <img src={mainImage} alt={trip.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          </div>
          {otherImages.slice(0, 2).map((img: string, idx: number) => (
            <div key={idx} className="h-full rounded-xl overflow-hidden relative group">
              <img src={img} alt={`${trip.name} ${idx + 2}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
          ))}
          {/* Fallback for empty slots if needed or just empty */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-dark-100">Itinerary</h2>

              {trip.itinerary && trip.itinerary.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {trip.itinerary.map((item: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="size-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">
                          {item.day || index + 1}
                        </div>
                        {trip.itinerary && index !== trip.itinerary.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="pb-6">
                        <h3 className="font-semibold text-lg text-dark-100">{item.location}</h3>
                        {item.activities && item.activities.length > 0 && (
                          <ul className="mt-2 list-disc list-inside text-gray-600 text-sm leading-relaxed">
                            {item.activities.map((activity: any, actIdx: number) => (
                              <li key={actIdx}>{activity.description}</li>
                            ))}
                          </ul>
                        )}
                        {/* Fallback description if old format */}
                        {item.description && !item.activities && (
                          <p className="text-gray-600 mt-1 text-sm leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No itinerary details available.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-dark-100">About this Trip</h2>
              <p className="text-gray-600 leading-relaxed">
                {trip.description || "No description provided for this trip."}
              </p>
            </div>
          </div>

          {/* Sidebar Details */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-dark-100">Trip Overview</h2>

              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Estimated Price</span>
                <span className="font-bold text-primary-600 text-lg">{trip.estimatedPrice}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Travel Style</span>
                <span className="font-medium text-dark-100 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {trip.travelStyle}
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-dark-100">
                  {trip.duration || 'Flexible'}
                </span>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(trip as any).tags?.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
};

export default TripDetails;
