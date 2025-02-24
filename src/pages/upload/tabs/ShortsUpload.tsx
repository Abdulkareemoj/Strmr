// import * as React from "react"
// import { createClient } from "~/utils/supabase/component"
// import { useToast } from "~/hooks/use-toast"
// import { FileTextIcon, TrashIcon, UploadIcon, Cross1Icon } from "@radix-ui/react-icons"

// import { Button } from "~/components/ui/button"
// import { Progress } from "~/components/ui/progress"
// import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
// import { Input } from "~/components/ui/input"
// import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

// const supabase = createClient()

// interface UploadedFile {
//   key: string
//   url: string
//   name: string
// }

// export default function ShortsUpload() {
//   const [files, setFiles] = React.useState<File[]>([])
//   const [previews, setPreviews] = React.useState<string[]>([])
//   const [uploading, setUploading] = React.useState(false)
//   const [progresses, setProgresses] = React.useState<Record<string, number>>({})
//   const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
//   const [errors, setErrors] = React.useState<string[]>([])
//   const { toast } = useToast()

//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFiles = event.target.files
//     if (!selectedFiles) return

//     const newFiles = Array.from(selectedFiles)
//     setFiles(newFiles)

//     // Create previews
//     const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
//     setPreviews(newPreviews)
//   }

//   const onUpload = async () => {
//     setUploading(true)
//     setErrors([])

//     for (const file of files) {
//       try {
//         setProgresses((prev) => ({ ...prev, [file.name]: 0 }))

//         // Check if file already exists
//         const { data: existingFiles, error: listError } = await supabase.storage
//           .from("strmrvids")
//           .list("shorts", { search: file.name })

//         if (listError) throw listError

//         if (existingFiles && existingFiles.length > 0) {
//           throw new Error(`A file named ${file.name} already exists. Please rename your file and try again.`)
//         }

//         const { data, error } = await supabase.storage.from("strmrvids").upload(`shorts/${file.name}`, file, {
//           cacheControl: "3600",
//         })

//         if (error) throw error

//         setProgresses((prev) => ({ ...prev, [file.name]: 100 }))

//         const {
//           data: { publicUrl },
//         } = supabase.storage.from("strmrvids").getPublicUrl(`shorts/${file.name}`)

//         setUploadedFiles((prev) => [
//           ...prev,
//           {
//             key: data.path,
//             url: publicUrl,
//             name: file.name,
//           },
//         ])

//         toast({ title: "Success", description: `Short ${file.name} uploaded successfully` })
//       } catch (error) {
//         console.error("Error uploading short:", error)
//         setErrors((prev) => [
//           ...prev,
//           `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
//         ])
//         setProgresses((prev) => {
//           const newProgresses = { ...prev }
//           delete newProgresses[file.name]
//           return newProgresses
//         })
//       }
//     }

//     setUploading(false)
//     setFiles([])
//     setPreviews([])
//     setProgresses({})
//   }

//   const onDelete = async (file: UploadedFile) => {
//     try {
//       const { error } = await supabase.storage.from("strmrvids").remove([file.key])

//       if (error) throw error

//       setUploadedFiles((prev) => prev.filter((f) => f.key !== file.key))
//       toast({ title: "Success", description: `Short ${file.name} deleted successfully` })
//     } catch (error) {
//       console.error("Error deleting short:", error)
//       setErrors((prev) => [
//         ...prev,
//         `Failed to delete ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
//       ])
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex w-full items-center justify-center">
//         <label
//           htmlFor="shorts-upload"
//           className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//         >
//           <div className="flex flex-col items-center justify-center pb-6 pt-5">
//             <UploadIcon className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
//             <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
//               <span className="font-semibold">Click to upload</span> or drag and drop
//             </p>
//             <p className="text-xs text-gray-500 dark:text-gray-400">MP4, AVI, MOV (MAX. 50MB)</p>
//           </div>
//           <Input
//             id="shorts-upload"
//             type="file"
//             accept="video/*"
//             className="hidden"
//             onChange={handleFileSelect}
//             multiple
//             disabled={uploading}
//           />
//         </label>
//       </div>

//       {previews.length > 0 && (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Previews</h3>
//           <div className="grid grid-cols-2 place-content-center gap-4">
//             {previews.map((preview, index) => (
//               <div key={index} className="relative">
//                 <video src={preview} className="h-auto w-full" controls />
//                 <Button
//                   variant="destructive"
//                   size="icon"
//                   className="absolute right-2 top-2"
//                   onClick={() => {
//                     setFiles(files.filter((_, i) => i !== index))
//                     setPreviews(previews.filter((_, i) => i !== index))
//                   }}
//                 >
//                   <Cross1Icon className="h-4 w-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//           <Button onClick={onUpload} disabled={uploading}>
//             {uploading ? "Uploading..." : "Upload Selected Shorts"}
//           </Button>
//         </div>
//       )}

//       {Object.entries(progresses).map(([fileName, progress]) => (
//         <div key={fileName} className="space-y-2">
//           <p>{fileName}</p>
//           <Progress value={progress} className="w-full" />
//         </div>
//       ))}

//       {errors.length > 0 && (
//         <div className="space-y-2">
//           {errors.map((error, index) => (
//             <Alert key={index} variant="destructive">
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           ))}
//         </div>
//       )}

//       <UploadedFilesCard uploadedFiles={uploadedFiles} onDelete={onDelete} />
//     </div>
//   )
// }

// function UploadedFilesCard({
//   uploadedFiles,
//   onDelete,
// }: {
//   uploadedFiles: UploadedFile[]
//   onDelete: (file: UploadedFile) => void
// }) {
//   const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

//   return (
//     <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
//       <div className="flex flex-col space-y-1.5 p-6">
//         <h3 className="text-2xl font-semibold leading-none tracking-tight">Uploaded Shorts</h3>
//         <p className="text-sm text-muted-foreground">View and manage your uploaded shorts here</p>
//       </div>
//       <div className="p-6">
//         {uploadedFiles.length > 0 ? (
//           <ScrollArea className="h-[300px]">
//             <div className="space-y-4">
//               {uploadedFiles.map((file) => (
//                 <div key={file.key} className="flex items-center justify-between">
//                   <div className="flex items-center space-x-4">
//                     <FileTextIcon className="h-8 w-8" />
//                     <div>
//                       <p className="font-medium">{file.name}</p>
//                       <p className="text-sm text-muted-foreground">Short</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Button variant="outline" size="sm" onClick={() => setPreviewUrl(file.url)}>
//                       Preview
//                     </Button>
//                     <Button variant="destructive" size="sm" onClick={() => onDelete(file)}>
//                       <TrashIcon className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <ScrollBar orientation="vertical" />
//           </ScrollArea>
//         ) : (
//           <div className="py-10 text-center">
//             <h3 className="mt-2 text-sm font-semibold text-gray-900">No shorts</h3>
//             <p className="mt-1 text-sm text-gray-500">Get started by uploading a short.</p>
//           </div>
//         )}
//       </div>
//       {previewUrl && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="relative w-full max-w-3xl">
//             <video src={previewUrl} controls className="w-full" />
//             <Button variant="outline" size="sm" className="absolute right-2 top-2" onClick={() => setPreviewUrl(null)}>
//               Close
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
import * as React from "react"
import { useToast } from "~/hooks/use-toast"
import { FileTextIcon, UploadIcon, Cross1Icon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ShortFormValues, shortSchema } from "~/lib/schemas"

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

export default function ShortsUpload() {
  const [preview, setPreview] = React.useState<string | null>(null)
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const { toast } = useToast()

  const form = useForm<ShortFormValues>({
    resolver: zodResolver(shortSchema),
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

const onSubmit = async (values: ShortFormValues) => {
  setUploading(true)
  setProgress(0)

  try {
    const file = values.file;
    const reader = new FileReader()
    
    reader.onload = async () => {
      try {
        const base64File = reader.result as string;

        const response = await fetch("/api/shorts/upload", {
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
          description: "Short uploaded successfully",
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
                htmlFor="short-upload"
                className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <UploadIcon className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    MP4, AVI, MOV (MAX. 50MB)
                  </p>
                </div>
                <Input
                  id="short-upload"
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
                      <Input placeholder="Short title" {...field} />
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
                        placeholder="Short description"
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
                        Make this short publicly accessible
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
                {uploading ? "Uploading..." : "Upload Short"}
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  )
}