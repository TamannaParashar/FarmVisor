"use client"

import { signIn, useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import "./style.css"

export default function Landing() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Image src="/bg.webp" fill={true} className="object-cover absolute opacity-80" alt="Background image" priority/>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/40 to-purple-800/30"></div>
        <main className="relative z-10 flex items-center justify-center min-h-screen">FarmVisor</main>
        <div className="absolute top-4 right-4 z-20">
          <button onClick={() => signIn("google", { callbackUrl: "/Home" })} className="relative bg-black text-white rounded-lg px-6 py-3 font-extrabold transition-all duration-300 shadow-lg hover:bg-gray-900 border border-purple-500/30 backdrop-blur-sm">
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-lg blur-sm"></div>
          </button>
        </div>

        <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-20 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>
    )
  }

  router.push("/Home")
}
