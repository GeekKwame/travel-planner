import { Header, StatsCard, TripCard } from "../../../components";

const Dashboard = () => {
  const user = { name: "Admin" };

  const dashboardStats = {
    totalUsers: 12450,
    usersJoined: { currentMonth: 218, lastMonth: 176 },
    totalTrips: 3210,
    tripsCreated: { total: 62, currentMonth: 25, lastMonth: 15 },
    userRole: "Admin",
  };

  const { totalUsers, usersJoined, totalTrips, tripsCreated } = dashboardStats;

  return (
    <main className="dashboard wrapper">
      <Header 
        title={`Welcome ${user?.name ?? `Guest`} 👋`}
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
        </div>
      </section>

      <TripCard />
    </main>
  );
};

export default Dashboard;