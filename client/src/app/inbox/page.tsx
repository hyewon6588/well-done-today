'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/NavBar"
import { Sparkles } from "lucide-react"

type EntryMeta = {
  date: string
  has_ai_reply: boolean
}

type Entry = {
  date: string
  items: string[]
  ai_reply?: string
}

export default function InboxPage() {
  const [entryDates, setEntryDates] = useState<EntryMeta[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [entry, setEntry] = useState<Entry | null>(null)
  const [hasMarkedRead, setHasMarkedRead] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetch("http://localhost:8000/entries", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEntryDates(data)
        if (data.length > 0) setSelectedDate(data[0].date)
      })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!selectedDate || !token) return

    const fetchEntry = () => {
        fetch("http://localhost:8000/entries/today", {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            setEntry(data.entry)
            if (data.entry?.ai_reply && !hasMarkedRead) {
                fetch("http://localhost:8000/notifications/mark-read", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ date: data.entry.date })
                }).then(() => {
                    console.log("[Navbar] Unread status is", data.unread)
                    setHasMarkedRead(true)
                })
                console.log("[InboxPage] Dispatching notification-read")
                window.dispatchEvent(new Event("notification-read"))
              }
          })
      }

      fetchEntry()
      const interval = setInterval(fetchEntry, 10000)
      return () => clearInterval(interval)
    }, [selectedDate])

  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-56px)] flex bg-amber-50 text-slate-800">
        {/* Sidebar with dates */}
        <div className="w-48 border-r border-gray-300 p-4 space-y-2 overflow-y-auto">
          {entryDates.map(({ date, has_ai_reply }) => (
            <button
              key={date}
              className={`text-left w-full px-2 py-1 rounded ${
                selectedDate === date ? "bg-yellow-300 font-semibold" : "hover:bg-yellow-100"
              }`}
              onClick={() => {
                setSelectedDate(date)
              }}
            >
              {date} 
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {!entry ? (
            <p className="text-center text-gray-600 mt-12">No entry found for {selectedDate}.</p>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h2 className="text-xl font-bold">Reflection for {entry.date}</h2>

              <div className="space-y-2 bg-white p-4 rounded shadow">
                {entry.items.map((item, i) => (
                  <p key={i} className="text-gray-700">– {item}</p>
                ))}
              </div>

              {entry.ai_reply && (
                <div className="space-y-2 bg-yellow-100 p-4 rounded shadow">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-yellow-500" />
                    <h3 className="font-semibold">From your WellDone buddy</h3>
                  </div>
                  <p className="text-gray-800">{entry.ai_reply}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
