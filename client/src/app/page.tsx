"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Sparkles } from "lucide-react";
import Navbar from "../components/NavBar";

const baseurl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const encouragementQuotes = [
  "Progress isn’t always loud or obvious. Sometimes it’s simply showing up, trying again, and choosing not to quit.",
  "Even the smallest effort toward your goal counts. You’re building resilience, one step at a time.",
  "Growth happens quietly—each reflection, each small win, adds up in powerful ways.",
  "You’re not behind. You’re exactly where you need to be to take your next step forward.",
  "The fact that you showed up for yourself today is already something to be proud of."
];

export default function HomePage() {
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quote, setQuote] = useState("");
  const router = useRouter();

  useEffect(() => {
    setQuote(encouragementQuotes[Math.floor(Math.random() * encouragementQuotes.length)]);

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const checkTodayEntry = async () => {
      try {
        const res = await fetch(`${baseurl}/entries/today`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.entry) {
          setHasSubmittedToday(true);
        }
      } catch (err) {
        console.error("Failed to check today's entry", err);
      } finally {
        setLoading(false);
      }
    };

    checkTodayEntry();
  }, []);

  const EncouragementCard = () => (
    <div className="bg-white rounded-lg shadow p-10 w-full max-w-sm min-h-[250px] text-center flex flex-col justify-between">
      <h2 className="text-2xl font-semibold text-slate-800">Encouragement</h2>
      <Sparkles className="mx-auto text-yellow-500 fill-yellow-500 w-10 h-10" />
      <p className="italic text-slate-600 text-lg">&quot;{quote}&quot;</p>
    </div>
  );

  return (
    <>
      {isLoggedIn &&  <Navbar />}
      <main className={`${
        isLoggedIn ? "min-h-[calc(100vh-60px)]" : "min-h-screen"
      } bg-amber-100 flex flex-col justify-center items-center px-4 py-12`}>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">Welcome to WellDoneToday</h1>
          <p className="text-slate-700 text-lg max-w-xl">
            Reflect on your day, celebrate small wins, and get kind encouragement from your WellDone Buddy.
          </p>
        </div>

        {!loading && isLoggedIn ? (
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {hasSubmittedToday ? (
              <div className="bg-white rounded-lg shadow p-10 w-full max-w-sm min-h-[250px] text-center flex flex-col justify-between">
                <h2 className="text-2xl font-semibold text-slate-800">Today&apos;s Entry Submitted</h2>
                <p className="text-slate-600 text-lg">Check your inbox for your reply from your well done buddy!</p>
                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                  onClick={() => router.push("/inbox")}
                >
                  Go to Inbox
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-10 w-full max-w-sm min-h-[250px] text-center flex flex-col justify-between">
                <h2 className="text-2xl font-semibold text-slate-800">Your Entries</h2>
                <p className="text-slate-600 text-lg">You haven&apos;t written anything yet.
                Reflect on a small win to get started.</p>
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600 text-white mt-2"
                  onClick={() => router.push("/write")}
                >
                  New Entry
                </Button>
              </div>
            )}
            <EncouragementCard />
          </div>
        ) : !loading && (
          <div className="space-y-4 text-center">
            {/* <h2 className="text-2xl font-semibold text-slate-800">Welcome!</h2> */}
            <p className="text-slate-600">Please log in to start reflecting and receive encouragement.</p>
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => router.push("/login")}
            >
              Log In
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
