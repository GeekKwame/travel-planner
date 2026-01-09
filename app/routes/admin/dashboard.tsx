import { Header, StatsCard, TripCard } from "../../../components";
import { getUsersAndTripsStats } from "~/lib/dashboard";
import { getAllTrips } from "~/lib/trips";
import { useLoaderData } from "react-router";
import { parseTripData } from "@/lib/utils";

export async function clientLoader() {
  try {
    const [stats, recentTrips] = await Promise.all([
      getUsersAndTripsStats(),
      getAllTrips(4, 0)
    ]);

    return {
      stats,
      recentTrips: recentTrips.allTrips
    };
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    return {
      stats: null,
      recentTrips: []
    };
  }
}

const Dashboard = () => {
  const { stats, recentTrips } = useLoaderData<typeof clientLoader>();

  // Fallback values in case stats loading fails
  const totalUsers = stats?.totalUsers || 0;
  const usersJoined = stats?.usersJoined || { currentMonth: 0, lastMonth: 0 };
  const totalTrips = stats?.totalTrips || 0;
  const tripsCreated = stats?.tripsCreated || { currentMonth: 0, lastMonth: 0 };
  const userRole = stats?.userRole || { total: 0, currentMonth: 0, lastMonth: 0 };

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome Admin 👋`}
        description="Track activity, trends and popular destinations in real time."
      />

      <section className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
          />

          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />

          <StatsCard
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            lastMonthCount={userRole.lastMonth}
          />
        </div>
      </section>


      <section className="flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-dark-100">Recent Trips</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {recentTrips.length > 0 ? (
            recentTrips.map((trip: any) => {
              const trip_details = parseTripData(trip.trip_details);
              return (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  name={trip.name}
                  imageUrl={trip.image_urls?.[0] || '/assets/images/sample.jpeg'}
                  location={trip_details?.itinerary?.[0]?.location || 'Unknown Location'}
                  tags={trip.tags || []}
                  price={trip.estimated_price}
                />
              )
            })
          ) : (
            <p className="text-gray-500">No trips created yet.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;