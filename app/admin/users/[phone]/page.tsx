import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { UserCrmForm } from "./UserCrmForm"

export default async function UserDetailPage(props: {
  params: Promise<{ phone: string }>
}) {
  const params = await props.params
  const phone = decodeURIComponent(params.phone)
  const supabase = await createClient()

  // Fetch user data along with wraps
  const { data: user, error } = await supabase
    .from("users")
    .select(`
      *,
      wraps (*)
    `)
    .eq("phone", phone)
    .single()

  // Fetch leads independently since there is no foreign key from leads to users
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("phone", phone)

  if (user && leads) {
    user.leads = leads
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <Link href="/admin/users" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Users
        </Link>
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-gray-500 mt-2">Could not find user with phone: {phone}</p>
      </div>
    )
  }

  // We should also fetch payments for this user's wraps if needed, 
  // but for now we'll just check if they have a generated wrap to indicate payment/conversion.

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="text-gray-500 hover:text-black mb-4 inline-flex items-center gap-2 text-sm font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Users
      </Link>
      
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{user.name || "Unknown User"}</h1>
          <p className="text-gray-500 mt-1">{user.phone} • Joined {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Journey */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Wraps Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 border-gray-100 mb-4">User Wraps</h3>
            
            {user.wraps && user.wraps.length > 0 ? (
              <div className="space-y-4">
                {user.wraps.map((wrap: any) => (
                  <div key={wrap.slug} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{wrap.wrap_title || `Wrap: ${wrap.slug}`}</div>
                      <div className="text-sm text-gray-500">
                        Status: <span className="capitalize">{wrap.status}</span> • Purpose: <span className="capitalize">{wrap.purpose}</span>
                      </div>
                    </div>
                    <Link 
                      href={`/admin/wraps/${wrap.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium rounded-md transition-colors"
                    >
                      Edit Wrap <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No wraps created yet.</p>
            )}
          </div>

          {/* Leads Section */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 border-gray-100 mb-4">Lead History</h3>
            
            {user.leads && user.leads.length > 0 ? (
              <div className="space-y-4">
                {user.leads.map((lead: any) => (
                  <div key={lead.id} className="p-4 border border-gray-200 rounded-lg text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-900">Stage {lead.stage} Form</span>
                      <span className="text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700"><span className="font-medium">Purpose:</span> {lead.purpose}</p>
                    {lead.whats_this_for && <p className="text-gray-700"><span className="font-medium">For:</span> {lead.whats_this_for}</p>}
                    {lead.promo_code && <p className="text-gray-700"><span className="font-medium">Promo:</span> {lead.promo_code}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No leads submitted.</p>
            )}
          </div>
          
        </div>

        {/* Right Column: CRM Form */}
        <div>
          <UserCrmForm user={user} />
        </div>
      </div>
    </div>
  )
}
