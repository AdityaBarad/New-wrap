import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"

export default async function UsersPage() {
  const supabase = await createClient()

  // Fetch users and their wraps to determine status
  const { data: users, error } = await supabase
    .from("users")
    .select(`
      *,
      wraps (
        status,
        plan_id
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Users & CRM</h1>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name / Phone</th>
                <th className="px-6 py-4 font-medium">Wrap Status</th>
                <th className="px-6 py-4 font-medium">Call Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users?.map((user) => {
                const hasWraps = user.wraps && user.wraps.length > 0
                const hasGenerated = user.wraps?.some((w: any) => w.status === 'generated')
                const wrapStatusLabel = hasGenerated ? "Generated" : hasWraps ? "Draft" : "None"
                
                return (
                  <tr key={user.phone} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{user.name || "Unknown"}</div>
                      <div className="text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${wrapStatusLabel === 'Generated' ? 'bg-green-100 text-green-800' : 
                          wrapStatusLabel === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {wrapStatusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${user.called ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-gray-700 capitalize">{user.call_status || 'Pending'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/users/${encodeURIComponent(user.phone)}`}
                        className="text-black hover:underline font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                )
              })}
              
              {!users?.length && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
