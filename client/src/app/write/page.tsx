'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sparkles,Inbox } from "lucide-react"
import Navbar from "@/components/NavBar"

export default function WritePage() {
  const router = useRouter()

  const [items, setItems] = useState(["", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [checkedToday, setCheckedToday] = useState(false)

  useEffect(() => {
    const checkTodayEntry = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("http://localhost:8000/entries/today", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (data.entry) {
          setAlreadySubmitted(true)
        }
      } catch (err) {
        console.error("Failed to check today's entry", err)
      } finally {
        setCheckedToday(true)
      }
    }

    checkTodayEntry()
  }, [])


  const handleChange = (value: string, index: number) => {
    const updated = [...items]
    updated[index] = value
    setItems(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:8000/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      })

      if (res.status === 400) {
        setError("You've already submitted today.")
      } else if (!res.ok) {
        throw new Error("Failed to save entry.")
      } else {
        setSuccess(true)
        setTimeout(() => router.push("/inbox"), 1000)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
        <div className="h-[calc(100vh-56px)] bg-amber-100 flex justify-center px-4 overflow-y-hidden">
            <div className="w-full max-w-2xl space-y-6 pt-25 text-center">
            
            {!checkedToday ? null : alreadySubmitted ? (
            <div className="text-center space-y-4 pt-32">
              <div className="inline-flex items-center justify-center rounded-full bg-white shadow w-14 h-14 mx-auto">
                <Inbox className="text-yellow-500 w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                You've already submitted today's reflection!
              </h2>
              <p className="text-slate-600">
                Check your inbox to see your entry and encouraging replies.
              </p>
              <Button
                onClick={() => router.push("/inbox")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Go to Inbox
              </Button>
            </div>
            ) : (
                    <>
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center rounded-full bg-white shadow w-14 h-14 mx-auto">
                                <Sparkles className="text-yellow-500 w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800">What did you do well today?</h1>
                            <p className="text-slate-600">Write 3 things you’re proud of, then send them off for a kind reply ✉️</p>
                        </div>

                        {/* Entry form */}
                        <Card className="bg-white shadow-md">
                            <CardContent className="space-y-4 py-6">
                                {[0, 1, 2].map((i) => (
                                <Input
                                    key={i}
                                    placeholder={`What’s one thing you did well?`}
                                    value={items[i]}
                                    onChange={(e) => handleChange(e.target.value, i)}
                                />
                                ))}

                                {error && <p className="text-sm text-red-500">{error}</p>}
                                {success && <p className="text-sm text-green-600">Saved! Redirecting...</p>}

                                <Button
                                onClick={handleSubmit}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                                disabled={loading || items.some(item => item.trim() === "")}
                                >
                                {loading ? "Sending..." : "Send Reflection"}
                                </Button>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div>
    </>
  )
}
