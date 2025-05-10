import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Bell } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    fetch("http://localhost:8000/notifications/unread", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setHasUnread(data.unread === true))
      .catch(() => setHasUnread(false))
  }, [])


  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  return (
    <nav className="w-full bg-yellow-400 border-b shadow-sm py-3 px-6 flex justify-between items-center">
      <div className="text-xl font-bold text-amber-800">WellDoneToday</div>
      <div className="space-x-6 text-sm font-medium text-slate-700">
        <Link href="/write" className="text-amber-800 hover:text-yellow-900">Write</Link>
        <Link href="/inbox" className="text-amber-800 hover:text-yellow-900">Inbox</Link>
        <div className="relative inline-block">
          <Bell className="w-5 h-5 text-amber-800" />
          {hasUnread && (
            <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
          )}
      </div>
        <button onClick={handleLogout} className="text-amber-800 hover:text-yellow-900">Sign out</button>
      </div>
    </nav>
  )
}
