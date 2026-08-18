import { createClient } from "@/lib/supabase/server"
import { Users, FileText, ArrowRight, DollarSign } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch basic stats
  const [
    { count: totalUsers },
    { count: totalWraps },
    { count: generatedWraps },
    { count: totalLeads },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("wraps").select("*", { count: "exact", head: true }),
    supabase.from("wraps").select("*", { count: "exact", head: true }).eq("status", "generated"),
    supabase.from("leads").select("*", { count: "exact", head: true }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalUsers || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Drafts</p>
              <h3 className="text-2xl font-bold text-gray-900">{(totalWraps || 0) - (generatedWraps || 0)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <ArrowRight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Generated Wraps</p>
              <h3 className="text-2xl font-bold text-gray-900">{generatedWraps || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalLeads || 0}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link href="/admin/users" className="block w-full text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Manage Users & CRM</div>
              <div className="text-sm text-gray-500 mt-1">Track outreach, add notes, and view user journey.</div>
            </Link>
            <Link href="/admin/wraps" className="block w-full text-left p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Manage Wraps</div>
              <div className="text-sm text-gray-500 mt-1">Edit wraps, reorder images, and generate drafts.</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
