"use client";

import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";

const baseurl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(baseurl+"/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Signup failed");
      }

      router.push("/login");
    } catch (err:unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
      setError("An unknown error occurred.");
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
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-screen-lg px-6 py-16 gap-7">
        {/* Left: Welcome Section */}
        <div className="flex flex-col justify-center px-6 space-y-6">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="bg-white rounded-full p-4 shadow-md drop-shadow-md">
              <Mail className="h-10 w-10 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">
              Welcome to <br /> WellDoneToday
            </h1>
            <p className="text-slate-700 text-lg mt-6">
              <strong>WellDoneToday</strong> is a daily self-reflection tool
              that helps you log what you did well and receive encouraging
              replies from AI.
            </p>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 fill-amber-600" />
              <p className="text-slate-700 italic">
                &quot;Your inbox of encouragement, one message at a time.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Right: Signup Card */}
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-center text-[#D89031]">
              Sign up
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
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              className="w-full bg-amber-400 hover:bg-amber-600 text-white"
              onClick={handleSignup}
            >
              Sign up
            </Button>

            <p className="text-sm text-center text-slate-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#D89031] font-semibold hover:underline"
              >
                Log in
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
