import Header from '@/components/Header'
import { getAllUsers } from '~/lib/auth'
import { useLoaderData } from 'react-router'

export async function clientLoader() {
  try {
    const { users, total } = await getAllUsers(100, 0);
    return { users, total };
  } catch (error) {
    console.error("Error loading users:", error);
    return { users: [], total: 0 };
  }
}

const AllUsers = () => {
  const { users, total } = useLoaderData<typeof clientLoader>();

  return (
    <main className="dashboard wrapper">
      <Header
        title="All Users"
        description="Check out our current users in real time."
      />

      <section className="mt-10">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-sm font-medium">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Joined At</th>
                  <th className="p-4">Account ID</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.image_url || '/assets/icons/profile-placeholder.svg'}
                            alt={user.name}
                            className="size-10 rounded-full object-cover bg-gray-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'User');
                            }}
                          />
                          <span className="font-semibold text-dark-100">{user.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{user.email}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(user.joined_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-gray-400 font-mono text-xs">
                        {user.id}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 text-sm text-gray-500 text-right">
            Total Users: {total}
          </div>
        </div>
      </section>
    </main>
  )
}

export default AllUsers
