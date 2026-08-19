import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { WrapEditForm } from "./WrapEditForm"

export default async function WrapEditPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const supabase = await createClient()

  const { data: wrap, error } = await supabase
    .from("wraps")
    .select(`
      *,
      users (name, phone)
    `)
    .eq("slug", params.slug)
    .single()

  if (error || !wrap) {
    return (
      <div className="p-8">
        <Link href="/admin/wraps" className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Wraps
        </Link>
        <h1 className="text-2xl font-bold">Wrap Not Found</h1>
        <p className="text-gray-500 mt-2">Could not find wrap with slug: {params.slug}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <Link href="/admin/wraps" className="text-gray-500 hover:text-black inline-flex items-center gap-2 text-sm font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Wraps
        </Link>
        <a 
          href={`/wrap/${wrap.slug}?preview=true`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Public Wrap <ExternalLink className="h-4 w-4" />
        </a>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Edit: {wrap.wrap_title || wrap.slug}
        </h1>
        <p className="text-gray-500 mt-1">
          Owner: <Link href={`/admin/users/${encodeURIComponent(wrap.phone)}`} className="text-blue-600 hover:underline">{wrap.users?.name || wrap.phone}</Link>
        </p>
      </div>

      <WrapEditForm wrap={wrap} />
    </div>
  )
}
