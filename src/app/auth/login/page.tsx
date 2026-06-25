"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex">

      {/* Left Section */}

      <div className="hidden lg:flex flex-1 items-center justify-center p-16">

        <div className="max-w-lg">

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-blue-200 backdrop-blur">

            <Sparkles size={18} />

            <span>AI Powered Recruitment</span>

          </div>

          <h1 className="mt-8 text-6xl font-bold leading-tight text-white">
            Hire Smarter.
            <br />
            Hire Faster.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            ROVE Hire helps HR teams streamline hiring with job
            management, candidate tracking, interview scheduling,
            offer generation and AI-assisted workflows.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-5">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold text-white">10k+</h3>
              <p className="mt-2 text-slate-300">
                Candidates Managed
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold text-white">250+</h3>
              <p className="mt-2 text-slate-300">
                Companies
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Right Section */}

      <div className="flex flex-1 items-center justify-center p-6">

        <Card className="w-full max-w-md rounded-3xl border-0 bg-white/95 shadow-2xl backdrop-blur">

          <CardContent className="p-10">

            <div className="text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                R
              </div>

              <h2 className="mt-6 text-4xl font-bold">
                Welcome Back
              </h2>

              <p className="mt-2 text-slate-500">
                Sign in to your HR Dashboard
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >

              <div className="space-y-2">

                <Label>Email Address</Label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <Input
                    type="email"
                    placeholder="hr@company.com"
                    className="h-12 pl-10 rounded-xl"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </div>

              </div>

              <div className="space-y-2">

                <Label>Password</Label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    className="h-12 pl-10 pr-10 rounded-xl"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

                <p className="font-semibold text-blue-700">
                  Demo Credentials
                </p>

                <p className="mt-2 text-sm text-slate-700">
                  Email:
                  <span className="font-medium ml-2">
                    hr@rove.com
                  </span>
                </p>

                <p className="text-sm text-slate-700">
                  Password:
                  <span className="font-medium ml-2">
                    Password123
                  </span>
                </p>

              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl text-base"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </Button>

            </form>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}