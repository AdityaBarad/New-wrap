"use client"
// Trigger hot reload

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Save, Wand2, Crop as CropIcon, X, Check, Search, Loader2 } from "lucide-react"
import { AiLoading } from "@/components/stages/ai-loading"
import { uploadBlobToSupabase } from "@/context/wrap-context"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/lib/cropImage"

// Sortable Image Component
function SortableImage({ url, id, index, onEdit }: { url: string, id: string, index: number, onEdit: (id: string, url: string) => void }) {
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
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(id, url); }}
        className="absolute bottom-2 right-2 z-10 bg-black/80 text-white p-1.5 rounded-md cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
        type="button"
      >
        <CropIcon className="h-4 w-4" />
      </button>
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
  const [hasPassword, setHasPassword] = useState(wrap.has_password || false)
  const [password, setPassword] = useState(wrap.password || "")
  
  const [userNames, setUserNames] = useState(wrap.user_names || "")
  const [anniversaryDate, setAnniversaryDate] = useState(wrap.anniversary_date || "")
  const [destinationCity, setDestinationCity] = useState(wrap.destination_city || "")
  const [travelHours, setTravelHours] = useState(wrap.travel_hours || "")
  const [whereDidYouMeet, setWhereDidYouMeet] = useState(wrap.where_did_you_meet || "")
  const [locationVisited, setLocationVisited] = useState(wrap.location_visited || "")
  const [tripStartDate, setTripStartDate] = useState(wrap.trip_start_date || "")
  const [numberOfPeople, setNumberOfPeople] = useState(wrap.number_of_people || "")
  const [delusionalHabit, setDelusionalHabit] = useState(wrap.delusional_habit || "")
  const [birthYear, setBirthYear] = useState(wrap.birth_year || "")
  const [storyParagraph, setStoryParagraph] = useState(wrap.story_paragraph || "")
  
  const [songVideoId, setSongVideoId] = useState(wrap.song_video_id || "")
  const [songTitle, setSongTitle] = useState(wrap.song_title || "")
  const [songArtist, setSongArtist] = useState(wrap.song_artist || "")
  const [cardColor, setCardColor] = useState(wrap.card_color || "")
  
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
  
  // Crop state
  const [croppingImage, setCroppingImage] = useState<{id: string, url: string} | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)
  
  // Song search state
  const [songQuery, setSongQuery] = useState("")
  const [songResults, setSongResults] = useState<any[]>([])
  const [songLoading, setSongLoading] = useState(false)

  useEffect(() => {
    if (!songQuery.trim()) {
      setSongResults([])
      return
    }

    const timer = setTimeout(async () => {
      setSongLoading(true)
      try {
        const res = await fetch(`/api/search-song?q=${encodeURIComponent(songQuery)}`)
        if (res.ok) {
          const json = await res.json()
          setSongResults(json.results || [])
        }
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setSongLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [songQuery])

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleApplyCrop = async () => {
    if (!croppingImage || !croppedAreaPixels) return
    setIsCropping(true)
    try {
      const croppedBlob = await getCroppedImg(croppingImage.url, croppedAreaPixels)
      if (croppedBlob) {
        // Upload to Supabase
        const newUrl = await uploadBlobToSupabase(
          URL.createObjectURL(croppedBlob),
          "wrap-assets",
          `${wrap.slug}/crops/${croppingImage.id}-${Date.now()}`
        )
        
        if (newUrl) {
          // Update photos array
          setPhotos((prev: any) => prev.map((p: any) => p.id === croppingImage.id ? { ...p, url: newUrl } : p))
          setCroppingImage(null)
        } else {
          alert("Failed to upload cropped image")
        }
      }
    } catch (e) {
      console.error(e)
      alert("Failed to crop image")
    } finally {
      setIsCropping(false)
    }
  }

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
          ai_content: aiContentObj,
          has_password: hasPassword,
          password: password,
          user_names: userNames,
          anniversary_date: anniversaryDate,
          destination_city: destinationCity,
          travel_hours: travelHours,
          where_did_you_meet: whereDidYouMeet,
          location_visited: locationVisited,
          trip_start_date: tripStartDate,
          number_of_people: numberOfPeople,
          delusional_habit: delusionalHabit,
          birth_year: birthYear,
          story_paragraph: storyParagraph,
          song_video_id: songVideoId,
          song_title: songTitle,
          song_artist: songArtist,
          card_color: cardColor
        }),
      })
      
      if (!res.ok) {
        const rawText = await res.text()
        console.error("Raw server response:", rawText)
        let errData: any = {}
        try { errData = JSON.parse(rawText) } catch (e) {}
        throw new Error(errData.details ? JSON.stringify(errData.details) : errData.error || `Server Error: ${res.status} ${res.statusText}`)
      }
      
      alert("Wrap saved successfully!")
      router.refresh()
    } catch (err: any) {
      console.error(err)
      alert("Failed to save changes: " + (err.message || err))
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
      
      // 5. Automatically make it active since we generated it from the admin panel
      await fetch(`/api/admin/wraps/${wrap.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: true,
          wrap_title: title,
          purpose: purpose,
          has_password: hasPassword,
          password: password,
          user_names: userNames,
          anniversary_date: anniversaryDate,
          destination_city: destinationCity,
          travel_hours: travelHours,
          where_did_you_meet: whereDidYouMeet,
          location_visited: locationVisited,
          trip_start_date: tripStartDate,
          number_of_people: numberOfPeople,
          delusional_habit: delusionalHabit,
          birth_year: birthYear,
          story_paragraph: storyParagraph,
          song_video_id: songVideoId,
          song_title: songTitle,
          song_artist: songArtist,
          card_color: cardColor
        }),
      })
      
      // Success! Redirect to the live wrap.
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
            <h4 className="font-medium text-gray-900 mb-4">Additional Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">User Names</label>
                <input type="text" value={userNames} onChange={(e) => setUserNames(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Anniversary Date</label>
                <input type="text" value={anniversaryDate} onChange={(e) => setAnniversaryDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Destination City</label>
                <input type="text" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Travel Hours</label>
                <input type="text" value={travelHours} onChange={(e) => setTravelHours(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Where Did You Meet?</label>
                <input type="text" value={whereDidYouMeet} onChange={(e) => setWhereDidYouMeet(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location Visited</label>
                <input type="text" value={locationVisited} onChange={(e) => setLocationVisited(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Trip Start Date</label>
                <input type="text" value={tripStartDate} onChange={(e) => setTripStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Number of People</label>
                <input type="text" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Delusional Habit</label>
                <input type="text" value={delusionalHabit} onChange={(e) => setDelusionalHabit(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Birth Year</label>
                <input type="text" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Card Color</label>
                <input type="text" value={cardColor} onChange={(e) => setCardColor(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <label className="block text-sm font-medium text-gray-700">Story Paragraph</label>
              <textarea 
                value={storyParagraph} 
                onChange={(e) => setStoryParagraph(e.target.value)} 
                rows={4}
                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-4">Song Information</h4>
            
            {/* Song Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search YouTube for a Song</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  value={songQuery} 
                  onChange={(e) => setSongQuery(e.target.value)}
                  placeholder="Type a song title or artist..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
                {songLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />}
              </div>
              
              {songResults.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-md bg-white divide-y divide-gray-100 max-h-60 overflow-y-auto shadow-sm relative z-10">
                  {songResults.map(song => (
                    <div 
                      key={song.videoId} 
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        setSongTitle(song.title)
                        setSongArtist(song.artist)
                        setSongVideoId(song.videoId)
                        setSongQuery("")
                        setSongResults([])
                      }}
                    >
                      <img src={song.thumbnail} alt="" className="w-12 h-10 object-cover rounded" />
                      <div className="flex-1 overflow-hidden">
                        <div className="text-sm font-medium text-gray-900 truncate">{song.title}</div>
                        <div className="text-xs text-gray-500 truncate">{song.artist}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Song Title</label>
                <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Song Artist</label>
                <input type="text" value={songArtist} onChange={(e) => setSongArtist(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Song Video ID or YouTube URL</label>
                <input 
                  type="text" 
                  value={songVideoId} 
                  onChange={(e) => {
                    let val = e.target.value;
                    try {
                      if (val.includes("youtube.com") || val.includes("youtu.be")) {
                        const url = new URL(val.startsWith("http") ? val : `https://${val}`);
                        if (url.searchParams.has("v")) {
                          val = url.searchParams.get("v") || val;
                        } else if (url.hostname === "youtu.be") {
                          val = url.pathname.slice(1) || val;
                        }
                      }
                    } catch (err) {}
                    setSongVideoId(val)
                  }} 
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" 
                  placeholder="e.g. dQw4w9WgXcQ"
                />
              </div>
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
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Password Protection</div>
                <div className="text-sm text-gray-500">Require a password to view this wrap</div>
              </div>
              <button
                onClick={() => setHasPassword(!hasPassword)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${hasPassword ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${hasPassword ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            {hasPassword && (
              <div className="space-y-2 mt-4">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="text" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter password"
                />
              </div>
            )}
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
                  <SortableImage 
                    key={photo.id} 
                    id={photo.id} 
                    url={photo.url} 
                    index={index} 
                    onEdit={(id, url) => {
                      setCroppingImage({ id, url })
                      setCrop({ x: 0, y: 0 })
                      setZoom(1)
                    }} 
                  />
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
    
    {/* Crop Modal */}
    {croppingImage && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col h-[85vh]">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Crop Image (Focal Point)</h3>
            <button onClick={() => setCroppingImage(null)} className="p-1 hover:bg-gray-100 rounded-md">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="relative flex-1 bg-gray-900 w-full">
            <Cropper
              image={croppingImage.url}
              crop={crop}
              zoom={zoom}
              aspect={9 / 16}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Zoom:</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(Number(e.target.value))
                }}
                className="w-32 accent-black"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCroppingImage(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                type="button"
              >
                Cancel
              </button>
              <button 
                onClick={handleApplyCrop}
                disabled={isCropping}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                type="button"
              >
                {isCropping ? "Applying..." : (
                  <>
                    <Check className="h-4 w-4" />
                    Apply Crop
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
