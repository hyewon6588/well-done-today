import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

const baseurl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function Navbar() {
  const router = useRouter()
  const [hasUnread, setHasUnread] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const fetchUnread = () => {
      fetch(baseurl+"/notifications/unread", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setHasUnread(data.unread === true))
        .catch(() => setHasUnread(false))
    }
  
    fetchUnread()
    const interval = setInterval(fetchUnread, 10000)
    // Listen for notification-read event
    
    window.addEventListener("notification-read", fetchUnread)
    return () => {
      clearInterval(interval)
      window.removeEventListener("notification-read", fetchUnread)
    }
  }, [])


  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }
  const toggleNotification = () => {
    if (hasUnread) setShowMessage(!showMessage)
  }


  return (
    <nav className="w-full bg-yellow-400 border-b-6 border-b-amber-400 shadow-sm py-3 px-6 flex justify-between items-center">
      <div className="text-xl font-bold text-amber-800">WellDoneToday</div>
      <div className="space-x-6 text-sm font-medium text-slate-700">
        <Link href="/write" className="text-amber-800 hover:text-yellow-900">Write</Link>
        <Link href="/inbox" className="text-amber-800 hover:text-yellow-900">Inbox</Link>
        <div className="relative inline-flex justify-center align-bottom">
          <button onClick={toggleNotification}>
            <Bell className="w-5 h-5 text-amber-800" />
            {hasUnread && (
              <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>
          {showMessage && (
            <div className="absolute left-1 transform -translate-x-2/3 top-7 mt-1 bg-amber-50 text-sm text-amber-800 shadow-md rounded px-3 py-2 z-50 w-64">
              You have unread responses from your WellDone Buddy
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="text-amber-800 hover:text-yellow-900">Sign out</button>
      </div>
    </nav>
  )
}
