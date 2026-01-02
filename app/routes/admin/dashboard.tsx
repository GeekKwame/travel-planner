import { Header } from "../../../components"
const Dashboard = () => {
  // Placeholder user object for now.
  // In a real application, this would come from an authentication context or similar.
  const user = { name: "Admin" };

  return (
    <main className="dashboard wrapper">
      <Header 
        title={`Welcome ${user?.name ?? `Guest`} 👋`}
        description="Track activity, trends and popular destinations in real time."
      />
  
        Dashboard Page Content

    </main>
  )
}

export default Dashboard
