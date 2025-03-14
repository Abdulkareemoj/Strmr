import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "~/utils/supabase/component"
import { db } from "~/server/db"
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user ID" })
  }

  const supabase = createClient()

  // Get the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // Check if the user is updating their own profile or is an admin
  const profile = await db.profile.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (session.user.id !== id && profile?.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" })
  }

  switch (req.method) {
    case "GET":
      return handleGet(id, res)
    case "PUT":
      return handleUpdate(id, req, res, supabase)
    case "DELETE":
      return handleDelete(id, res, supabase)
    default:
      return res.status(405).json({ error: "Method not allowed" })
  }
}

async function handleGet(id: string, res: NextApiResponse) {
  try {
    const profile = await db.profile.findUnique({
      where: { id },
    })

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" })
    }

    return res.status(200).json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return res.status(500).json({ error: "Failed to fetch profile" })
  }
}

async function handleUpdate(
  id: string,
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: ReturnType<typeof createClient>,
) {
  try {
    const { firstName, lastName, avatarUrl } = req.body

    // Update the profile in prisma
    const updatedProfile = await db.profile.update({
      where: { id },
      data: {
        firstName,
        lastName,
        fullName: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        avatarUrl,
        updatedAt: new Date(),
      },
    })

    // Also update the user metadata in Supabase Auth
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
        avatar_url: avatarUrl,
      },
    })

    if (updateError) {
      console.error("Error updating Supabase user:", updateError)
      // We don't want to fail the request if only the metadata update fails
    }

    return res.status(200).json(updatedProfile)
  } catch (error) {
    console.error("Error updating profile:", error)
    return res.status(500).json({ error: "Failed to update profile" })
  }
}

async function handleDelete(id: string, res: NextApiResponse, supabase: ReturnType<typeof createClient>) {
  try {
    // Delete the user from Supabase Auth
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(id)

    if (deleteAuthError) {
      console.error("Error deleting Supabase user:", deleteAuthError)
      return res.status(500).json({ error: "Failed to delete user from authentication" })
    }

    // The profile should be automatically deleted by the ON DELETE CASCADE constraint
    // But we can explicitly delete it to be sure
    await db.profile.delete({
      where: { id },
    })

    return res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return res.status(500).json({ error: "Failed to delete user" })
  }
}

