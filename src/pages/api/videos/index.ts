/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next"
import { env } from "~/env"
  import { createClient } from "~/utils/supabase/component"

  export const config = {
    api: {
      bodyParser: {
        sizeLimit: '100mb',
      },
      responseLimit: false,
    },
  }

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const supabase = createClient()

    // Set proper headers
    res.setHeader('Content-Type', 'application/json')

    switch (req.method) {
      case "POST":
        return handleUpload(req, res, supabase)
      case "DELETE":
        return handleDelete(req, res, supabase)
      case "GET":
        return handleGet(req, res, supabase)
      default:
        return res.status(405).json({ error: "Method not allowed" })
    }
  }

  // async function handleUpload(
  //   req: NextApiRequest,
  //   res: NextApiResponse,
  //   supabase: ReturnType<typeof createClient>
  // ) {
  //   try {
  //     // Get the user session
  //   const { data: { session } } = await supabase.auth.getSession()
    
  //   if (!session?.user) {
  //     return res.status(401).json({ error: "Unauthorized" })
  //   }
  //     const { file, title, description, public: isPublic } = req.body

  //     if (!file || !title || !description) {
  //       return res.status(400).json({ error: "Missing required fields" })
  //     }

  //     // Convert base64 to buffer
  //     const fileData = Buffer.from(file.split(',')[1], 'base64')
  //     const fileName = `${Date.now()}_${title.replace(/\s+/g, '_')}.mp4`

  //     // Upload to Supabase Storage
  //     const { data: uploadData, error: uploadError } = await supabase.storage
  //       .from("strmrvids")
  //       .upload(`videos/${fileName}`, fileData, {
  //         contentType: 'video/mp4',
  //         cacheControl: "3600",
  //       })

  //     if (uploadError) {
  //       console.error("Storage upload error:", uploadError)
  //       return res.status(500).json({ error: uploadError.message })
  //     }

  //     // Get the public URL
  //     const { data: { publicUrl } } = supabase.storage
  //       .from("strmrvids")
  //       .getPublicUrl(`videos/${fileName}`)

  //     // Create video record in Supabase database
  //     const { data: video, error: insertError } = await supabase
  //       .from('Video')
  //       .insert({
  //         title,
  //         description,
  //         videoId: fileName,
  //         url: publicUrl,
  //         public: isPublic,
  //         thumbnailUrl: null,
  //         duration: 0,
  //      userId: "temp-user" // session.user.id,
  //       })
  //       .select()
  //       .single()

  //     if (insertError) {
  //       console.error("Database insert error:", insertError)
  //       // Try to clean up the uploaded file
  //       await supabase.storage.from("strmrvids").remove([`videos/${fileName}`])
  //       return res.status(500).json({ error: insertError.message })
  //     }

  //     return res.status(200).json({ video })
  //   } catch (error) {
  //     console.error("Upload error:", error)
  //     return res.status(500).json({ 
  //       error: error instanceof Error ? error.message : "Failed to upload video" 
  //     })
  //   }
  // }

  async function handleUpload(req: NextApiRequest, res: NextApiResponse, supabase: ReturnType<typeof createClient>) {
    try {
      // Get the user session
      // const {
      //   data: { session },
      // } = await supabase.auth.getSession()

      // if (!session?.user) {
      //   return res.status(401).json({ error: "Unauthorized" })
      // }

      const { file, title, description, public: isPublic } = req.body

      if (!file || !title || !description) {
        return res.status(400).json({ error: "Missing required fields" })
      }

      // Convert base64 to buffer
      let fileData
      try {
        // Make sure we're handling the base64 data correctly
        const base64Data = file.split(",")[1]
        if (!base64Data) {
          return res.status(400).json({ error: "Invalid file format" })
        }
        fileData = Buffer.from(base64Data, "base64")
      } catch (error) {
        console.error("Base64 conversion error:", error)
        return res.status(400).json({ error: "Failed to file data" })
      }

      const fileName = `${Date.now()}_${title.replace(/\s+/g, "_")}.mp4`

      // Upload to Supabase Storage with better error handling
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("strmrvids")
        .upload(`videos/${fileName}`, fileData, {
          contentType: "video/mp4",
          cacheControl: "3600",
        })

      if (uploadError) {
        console.error("Storage upload error:", uploadError)
        return res.status(500).json({
          error: uploadError.message,
          details: uploadError,
        })
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("strmrvids").getPublicUrl(`videos/${fileName}`)

      // Create video record in Supabase database
      const { data: video, error: insertError } = await supabase
        .from("Video")
        .insert({
          title,
          description,
          videoId: fileName,
          url: publicUrl,
          public: isPublic,
          thumbnailUrl: null,
          duration: 0,
          userId: "temp"//session.user.id, // Use the actual user ID
        })
        .select()
        .single()

      if (insertError) {
        console.error("Database insert error:", insertError)
        // Try to clean up the uploaded file
        await supabase.storage.from("strmrvids").remove([`videos/${fileName}`])
        return res.status(500).json({ error: insertError.message })
      }

      return res.status(200).json({ video })
    } catch (error) {
      console.error("Upload error:", error)
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to upload video",
        stack: env.NODE_ENV === "development" ? (error as Error).stack : undefined,
      })
    }
  }


  async function handleDelete(
    req: NextApiRequest,
    res: NextApiResponse,
    supabase: ReturnType<typeof createClient>
  ) {
    try {
      const { videoId } = req.query

      if (!videoId || typeof videoId !== 'string') {
        return res.status(400).json({ error: "No video ID provided" })
      }

      // First, get the video record
      const { data: video, error: fetchError } = await supabase
        .from('Video')
        .select()
        .eq('videoId', videoId)
        .single()

      if (fetchError) {
        return res.status(404).json({ error: "Video not found" })
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("strmrvids")
        .remove([`videos/${video.videoId}`])

      if (storageError) {
        console.error("Storage delete error:", storageError)
        return res.status(500).json({ error: storageError.message })
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('Video')
        .delete()
        .eq('videoId', videoId)

      if (deleteError) {
        console.error("Database delete error:", deleteError)
        return res.status(500).json({ error: deleteError.message })
      }

      return res.status(200).json({ message: "Video deleted successfully" })
    } catch (error) {
      console.error("Delete error:", error)
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to delete video" 
      })
    }
  }

  async function handleGet(
    req: NextApiRequest,
    res: NextApiResponse,
    supabase: ReturnType<typeof createClient>
  ) {
    try {
      const { videoId } = req.query

      if (videoId && typeof videoId === 'string') {
        // Get specific video
        const { data: video, error } = await supabase
          .from('Video')
          .select()
          .eq('videoId', videoId)
          .single()

        if (error) {
          return res.status(404).json({ error: "Video not found" })
        }

        // Create a signed URL if needed
        const { data: signedUrl } = await supabase.storage
          .from("strmrvids")
          .createSignedUrl(`videos/${video.videoId}`, 3600)

        return res.status(200).json({
          ...video,
          url: signedUrl?.signedUrl || video.url
        })
      } else {
        // Get all videos
        const { data: videos, error } = await supabase
          .from('Video')
          .select()
          .eq('public', true)
          .order('id', { ascending: false })

        if (error) {
          return res.status(500).json({ error: "Failed to fetch videos" })
        }

        return res.status(200).json(videos)
      }
    } catch (error) {
      console.error("Get error:", error)
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to fetch videos" 
      })
    }
  }