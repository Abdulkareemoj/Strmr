  /* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react"
import { useToast } from "~/hooks/use-toast"
import {  UploadIcon, Cross1Icon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type VideoFormValues, videoSchema } from "~/lib/schemas"

import { Button } from "~/components/ui/button"
import { Progress } from "~/components/ui/progress"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Switch } from "~/components/ui/switch"

export default function VideoUpload() {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const { toast } = useToast()

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      public: true,
      title: "",
      description: "",
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    form.setValue("file", file)
    setPreview(URL.createObjectURL(file))
  }

 const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

const onSubmit = async (values: VideoFormValues) => {
  setUploading(true)
  setProgress(0)

  try {
    const file = values.file;
    const reader = new FileReader()
    
    reader.onload = async () => {
      try {
        const base64File = reader.result as string;

        const response = await fetch("/api/videos/upload", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64File,
            title: values.title,
            description: values.description,
            public: values.public,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Upload failed" }));
          throw new Error(errorData.error || "Upload failed")
        }

        const data = await response.json()
        
        toast({
          title: "Success",
          description: "Video uploaded successfully",
        })

        // Reset form and preview
        form.reset()
        setPreview(null)
      } catch (error) {
        console.error("Upload error:", error)
        throw error
      }
    }

    reader.onerror = () => {
      throw new Error("Failed to read file")
    }

    // Start reading the file
    reader.readAsDataURL(file)

  } catch (error) {
    console.error("Form error:", error)
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to upload video",
      variant: "destructive",
    })
  } finally {
    setUploading(false)
    setProgress(0)
  }
}
  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!preview && (
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="video-upload"
                className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <UploadIcon className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    MP4, AVI, MOV (MAX. 100MB)
                  </p>
                </div>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          {preview && (
            <>
              <div className="relative">
                <video src={preview} className="h-auto w-full rounded-lg" controls />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => {
                    form.setValue("file", null)
                    setPreview(null)
                  }}
                >
                  <Cross1Icon className="h-4 w-4" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Video description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="public"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Public</FormLabel>
                      <FormDescription>
                        Make this video publicly accessible
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {uploading && (
                <Progress value={progress} className="w-full" />
              )}

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload Video"}
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}