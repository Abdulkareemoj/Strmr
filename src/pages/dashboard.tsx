

import type { GetServerSideProps } from "next"
import { requireAuth } from "~/lib/auth"
import { Button } from "~/components/ui/button"
import { createClient } from "~/utils/supabase/component"
import { useRouter } from "next/router"
import { useState } from "react"

// Define the props type
type DashboardProps = {
  user: {
    id: string
    email: string
  }
  profile: {
    id: string
    firstName: string | null
    lastName: string | null
    fullName: string | null
    email: string
    avatarUrl: string | null
    role: string
  }
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push("/signin")
  }

  // Use the name from the profile, or fallback to email
  const displayName = profile?.fullName || profile?.firstName || user.email.split("@")[0]

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline" disabled={loading}>
          {loading ? "Signing out..." : "Sign out"}
        </Button>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-xs">
        <h2 className="text-xl font-semibold mb-4">Welcome, {displayName}</h2>
        <p className="text-muted-foreground">You are signed in as {user.email}</p>
        {profile?.role === "ADMIN" && (
          <p className="mt-2 text-sm bg-primary/10 text-primary p-2 rounded">You have admin privileges</p>
        )}
      </div>

      {/* Add your dashboard content here */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAuth(context)
}

