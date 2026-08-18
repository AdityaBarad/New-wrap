"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, CheckCircle, Clock, XCircle, FileText } from "lucide-react"

export function UserCrmForm({ user }: { user: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [called, setCalled] = useState(user.called || false)
  const [callStatus, setCallStatus] = useState(user.call_status || "pending")
  const [adminNotes, setAdminNotes] = useState(user.admin_notes || "")

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(user.phone)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ called, call_status: callStatus, admin_notes: adminNotes }),
      })
      
      if (!res.ok) throw new Error("Failed to update user")
      
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to save changes")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 border-gray-100">CRM Details</h3>
      
      <div className="space-y-4">
        {/* Called Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-700">Has been called?</span>
          </div>
          <button
            onClick={() => setCalled(!called)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${called ? 'bg-black' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${called ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Call Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Call Status</label>
          <select 
            value={callStatus}
            onChange={(e) => setCallStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="pending">Pending</option>
            <option value="interested">Interested</option>
            <option value="not_interested">Not Interested</option>
            <option value="no_answer">No Answer / Voicemail</option>
            <option value="converted">Converted (Paid)</option>
            <option value="dropped">Dropped Off</option>
          </select>
        </div>

        {/* Admin Notes */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="h-4 w-4" />
            Admin Notes
          </label>
          <textarea 
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={4}
            placeholder="Add notes about this user..."
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
