"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Save, Wand2 } from "lucide-react"
import { AiLoading } from "@/components/stages/ai-loading"
import { uploadBlobToSupabase } from "@/context/wrap-context"

// Sortable Image Component
function SortableImage({ url, id, index }: { url: string, id: string, index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="relative bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group aspect-square flex items-center justify-center"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 left-2 z-10 bg-white/80 p-1 rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-gray-700" />
      </div>
      <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
        {index + 1}
      </div>
      {url ? (
        <img src={url} alt={`Photo ${index}`} className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-400 text-sm">Empty Slot</span>
      )}
    </div>
  )
}

export function WrapEditForm({ wrap }: { wrap: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  const [title, setTitle] = useState(wrap.wrap_title || "")
  const [purpose, setPurpose] = useState(wrap.purpose || "")
  const [isActive, setIsActive] = useState(wrap.is_active || false)
  
  const [aiContentStr, setAiContentStr] = useState(
    wrap.ai_content ? JSON.stringify(wrap.ai_content, null, 2) : ""
  )
  
  // Setup dnd-kit state for photos
  // Map photo URLs to objects with unique IDs for dnd-kit
  const initialPhotos = (wrap.photo_urls || []).map((url: string, index: number) => ({
    id: `photo-${index}-${Math.random().toString(36).substr(2, 9)}`,
    url
  }))
  const [photos, setPhotos] = useState(initialPhotos)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setPhotos((items: any) => {
        const oldIndex = items.findIndex((item: any) => item.id === active.id)
        const newIndex = items.findIndex((item: any) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      let aiContentObj = null
      if (aiContentStr.trim()) {
        try {
          aiContentObj = JSON.parse(aiContentStr)
        } catch (e) {
          alert("Invalid JSON in AI Content. Please fix it before saving.")
          setLoading(false)
          return
        }
      }

      const photoUrls = photos.map((p: any) => p.url)
      
      const res = await fetch(`/api/admin/wraps/${wrap.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wrap_title: title,
          purpose,
          is_active: isActive,
          photo_urls: photoUrls,
          ai_content: aiContentObj
        }),
      })
      
      if (!res.ok) throw new Error("Failed to update wrap")
      
      alert("Wrap saved successfully!")
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to save changes")
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!confirm("Are you sure you want to generate this wrap now? This will consume AI API credits and overwrite any existing drafts.")) return
    
    setGenerating(true)
    try {
      // 1. Generate text via Groq
      const genRes = await fetch("/api/generate-wrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: wrap.purpose,
          userNames: wrap.user_names,
          anniversaryDate: wrap.anniversary_date,
          destinationCity: wrap.destination_city,
          travelHours: wrap.travel_hours,
          whereDidYouMeet: wrap.where_did_you_meet,
          locationVisited: wrap.location_visited,
          tripStartDate: wrap.trip_start_date,
          numberOfPeople: wrap.number_of_people,
          delusionalHabit: wrap.delusional_habit,
          birthYear: wrap.birth_year,
          storyParagraph: wrap.story_paragraph,
          photoCount: (wrap.photo_urls || []).length,
          song: wrap.song_title ? `${wrap.song_title} by ${wrap.song_artist}` : null,
        }),
      })

      if (!genRes.ok) throw new Error("AI Text generation failed")
      const { content } = await genRes.json()

      // 2. Generate personality image
      let personalityBlobUrl: string | null = null
      if (content.personalityCard?.imagePrompt) {
        try {
          const imgRes = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: content.personalityCard.imagePrompt }),
          })
          if (imgRes.ok) {
            const blob = await imgRes.blob()
            personalityBlobUrl = URL.createObjectURL(blob)
          }
        } catch (e) {
          console.error("Image generation failed:", e)
        }
      }

      // 3. Upload image if exists
      let personalityImageUrl: string | null = null
      if (personalityBlobUrl) {
        personalityImageUrl = await uploadBlobToSupabase(
          personalityBlobUrl,
          "wrap-assets",
          `${wrap.slug}/personality`
        )
      }

      // 4. Save the final wrap
      const saveRes = await fetch("/api/save-wrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wrapData: { slug: wrap.slug },
          aiContent: content,
          personalityImageUrl,
          photoUrls: photos.map((p: any) => p.url),
        }),
      })

      if (!saveRes.ok) throw new Error("Failed to save final wrap")
      
      // Success! Redirect to the wrap.
      window.location.href = `/wrap/${wrap.slug}`
      await new Promise(() => {}) // Hang the promise to prevent UI flickering before redirect

    } catch (err) {
      console.error(err)
      alert("Generation failed.")
      setGenerating(false)
    }
  }

  return (
    <>
      {generating && <AiLoading accentColor="var(--wr-yellow)" />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b pb-4 border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Wrap Details</h3>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-black text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Wrap Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Purpose</label>
              <input 
                type="text" 
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">AI Content (JSON)</label>
              <textarea 
                value={aiContentStr}
                onChange={(e) => setAiContentStr(e.target.value)}
                rows={10}
                className="w-full border border-gray-300 rounded-md p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="{}"
              />
              <p className="text-xs text-gray-500">Edit the generated AI content structure manually. Ensure it is valid JSON.</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Active Status</div>
                <div className="text-sm text-gray-500">Controls if the wrap is visible to the user</div>
              </div>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Photos Drag and Drop */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
            <p className="text-sm text-gray-500">Drag to reorder photos. The order will be used in the generated wrap.</p>
          </div>
          
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              <SortableContext 
                items={photos.map((p: any) => p.id)}
                strategy={rectSortingStrategy}
              >
                {photos.map((photo: any, index: number) => (
                  <SortableImage key={photo.id} id={photo.id} url={photo.url} index={index} />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </div>
      </div>
      
      {/* Sidebar Actions */}
      <div className="space-y-6">
        {wrap.status === 'draft' && (
          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-900 mb-2">Draft Mode</h3>
            <p className="text-sm text-yellow-800 mb-4">
              This wrap is currently a draft. If the user has paid manually or you want to generate it for them, click below.
            </p>
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="w-full flex justify-center items-center gap-2 bg-yellow-500 text-white rounded-md py-2.5 px-4 hover:bg-yellow-600 transition-colors disabled:opacity-50 font-medium"
            >
              <Wand2 className="h-4 w-4" />
              {generating ? "Generating..." : "Generate AI Wrap"}
            </button>
          </div>
        )}
        
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Wrap Info</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Slug</dt>
              <dd className="font-mono text-gray-900">{wrap.slug}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd className="text-gray-900 capitalize font-medium">{wrap.status}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="text-gray-900">{new Date(wrap.created_at).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Song</dt>
              <dd className="text-gray-900 text-right max-w-[150px] truncate">{wrap.song_title || "None"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
    </>
  )
}
