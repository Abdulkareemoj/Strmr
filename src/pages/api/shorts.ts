import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "~/utils/supabase/component"

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure we're always sending JSON responses
  res.setHeader('Content-Type', 'application/json')

  try {
    const supabase = createClient()

    switch (req.method) {
      case "POST":
        return await handleUpload(req, res, supabase)
      case "DELETE":
        return await handleDelete(req, res, supabase)
      case "GET":
        return await handleGet(req, res, supabase)
      default:
        return res.status(405).json({ error: "Method not allowed" })
    }
  } catch (error) {
    // Log the full error for debugging
    console.error('API route error:', error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Internal server error",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    })
  }
}
async function handleUpload(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: ReturnType<typeof createClient>
) {
  try {
//      // Get the user session
//   const { data: { session } } = await supabase.auth.getSession()
  
//   if (!session?.user) {
//     return res.status(401).json({ error: "Unauthorized" })
//   }
    const { file, title, description, public: isPublic } = req.body

    if (!file || !title || !description) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Convert base64 to buffer
    const fileData = Buffer.from(file.split(',')[1], 'base64')
    const fileName = `${Date.now()}_${title.replace(/\s+/g, '_')}.mp4`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("strmrvids")
      .upload(`shorts/${fileName}`, fileData, {
        contentType: 'video/mp4',
        cacheControl: "3600",
      })

    if (uploadError) {
      console.error("Storage upload error:", uploadError)
      return res.status(500).json({ error: uploadError.message })
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("strmrvids")
      .getPublicUrl(`shorts/${fileName}`)

    // Create short record in Supabase database
    const { data: short, error: insertError } = await supabase
      .from('Short')
      .insert({
        title,
        description,
        shortId: fileName,
        url: publicUrl,
        public: isPublic,
        thumbnailUrl: null,
        duration: 0,
         userId: "temp-user" // session.user.id,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Database insert error:", insertError)
      // Try to clean up the uploaded file
      await supabase.storage.from("strmrvids").remove([`shorts/${fileName}`])
      return res.status(500).json({ error: insertError.message })
    }

    return res.status(200).json({ short })
  } catch (error) {
    console.error("Upload error:", error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to upload short" 
    })
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: ReturnType<typeof createClient>
) {
  try {
    const { shortId } = req.query

    if (!shortId || typeof shortId !== 'string') {
      return res.status(400).json({ error: "No short ID provided" })
    }

    // First, get the short record
    const { data: short, error: fetchError } = await supabase
      .from('Short')
      .select()
      .eq('shortId', shortId)
      .single()

    if (fetchError) {
      return res.status(404).json({ error: "Short not found" })
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("strmrvids")
      .remove([`shorts/${short.shortId}`])

    if (storageError) {
      console.error("Storage delete error:", storageError)
      return res.status(500).json({ error: storageError.message })
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('Short')
      .delete()
      .eq('shortId', shortId)

    if (deleteError) {
      console.error("Database delete error:", deleteError)
      return res.status(500).json({ error: deleteError.message })
    }

    return res.status(200).json({ message: "Short deleted successfully" })
  } catch (error) {
    console.error("Delete error:", error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to delete short" 
    })
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  supabase: ReturnType<typeof createClient>
) {
  try {
    const { shortId } = req.query

    if (shortId && typeof shortId === 'string') {
      // Get specific short
      const { data: short, error } = await supabase
        .from('Short')
        .select()
        .eq('shortId', shortId)
        .single()

      if (error) {
        return res.status(404).json({ error: "Short not found" })
      }

      // Create a signed URL if needed
      const { data: signedUrl } = await supabase.storage
        .from("strmrvids")
        .createSignedUrl(`shorts/${short.shortId}`, 3600)

      return res.status(200).json({
        ...short,
        url: signedUrl?.signedUrl || short.url
      })
    } else {
      // Get all shorts
      const { data: shorts, error } = await supabase
        .from('Short')
        .select()
        .eq('public', true)
        .order('id', { ascending: false })

      if (error) {
        return res.status(500).json({ error: "Failed to fetch shorts" })
      }

      return res.status(200).json(shorts)
    }
  } catch (error) {
    console.error("Get error:", error)
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to fetch shorts" 
    })
  }
}