"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fakeUser = { name: "Demo User", email }
    login(fakeUser as any)
    alert(`Logged in as ${email}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center  from-purple-500 via-pink-500 to-indigo-500 animate-gradient-x">
      <Card className="w-[400px] backdrop-blur-md bg-white/30 border border-white/20 shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-white/80">
            Login to access EduVerse
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-5">
            <div className="relative">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <div className="relative">
                {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} /> */}
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="pl-10 bg-white/20 placeholder-white/50 text-white focus:bg-white/30"
                />
              </div>
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <div className="relative">
                {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={18} /> */}
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="pl-10 bg-white/20 placeholder-white/50 text-white focus:bg-white/30"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button type="submit" className="w-full bg-white text-purple-700 font-bold hover:bg-white/90">
              Login
            </Button>
            <p className="text-center text-sm text-white/70">
              Don&apos;t have an account?{" "}
              <span className="text-white font-semibold hover:underline cursor-pointer">
                Sign up
              </span>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
