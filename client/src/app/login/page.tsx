"use client";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const baseurl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

  const handleLogin = async () => {
    try {
      const res = await fetch(baseurl+"/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login Failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      router.push("/");
    } catch (err:unknown) {
      if (err instanceof Error) {
      setError(err.message);
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#fffef9]"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "contain",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-screen-lg px-6 py-16 gap-10">
        {/* Left: Welcome Section */}
        <div className="flex flex-col justify-center px-6 space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="bg-white rounded-full p-4 shadow-md drop-shadow-md">
              <Mail className="h-10 w-10 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">
              Good to see you again.
            </h1>
            <p className="text-slate-700 text-lg mt-3">
              Pick up where you left off, reflect on what went well, and receive words of encouragement — one message at a time.
            </p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 fill-amber-600" />
              <p className="text-slate-700 italic">
                &quot;Today&apos;s small wins, worth celebrating.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Right: Signup Card */}
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center text-[#D89031]">
              Login
            </h2>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              className="w-full bg-amber-400 hover:bg-amber-600 text-white"
              onClick={handleLogin}
            >
              Login
            </Button>

            <p className="text-sm text-center text-slate-600">
              Don&apos;t have an account yet?{" "}
              <a
                href="/signup"
                className="text-[#D89031] font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
