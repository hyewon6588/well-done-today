import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const router = useRouter()

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
        <button onClick={handleLogout} className="text-amber-800 hover:text-yellow-900">Sign out</button>
      </div>
    </nav>
  )
}
