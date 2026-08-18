import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Search } from "lucide-react"

export default async function WrapsPage() {
  const supabase = await createClient()

  const { data: wraps, error } = await supabase
    .from("wraps")
    .select(`
      *,
      users (name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching wraps:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Wraps Management</h1>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search wraps..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Wrap Slug / Title</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Purpose</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {wraps?.map((wrap) => {
                return (
                  <tr key={wrap.slug} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{wrap.wrap_title || "Untitled Wrap"}</div>
                      <div className="text-gray-500 font-mono text-xs mt-1">{wrap.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{wrap.users?.name || "Unknown"}</div>
                      <div className="text-gray-500">{wrap.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${wrap.status === 'generated' ? 'bg-green-100 text-green-800' : 
                          wrap.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                      >
                        {wrap.status || "draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {wrap.purpose || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(wrap.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/wraps/${wrap.slug}`}
                        className="text-black hover:underline font-medium"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                )
              })}
              
              {!wraps?.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No wraps found.
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
