/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/
import axios from "axios";
import * as React from "react";
import { useToast } from "~/hooks/use-toast";
import { UploadIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ShortFormValues, shortSchema } from "~/lib/validations/schemas";

import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";

export default function ShortsUpload() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
    null,
  );
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { toast } = useToast();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const form = useForm<ShortFormValues>({
    resolver: zodResolver(shortSchema),
    defaultValues: {
      public: true,
      title: "",
      description: "",
      file: null as any, // Cast to any to satisfy TypeScript
    },
  });

  // Function to generate a thumbnail from the video
  const generateThumbnail = (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create a video element
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      // Create a URL for the video file
      const videoUrl = URL.createObjectURL(videoFile);
      video.src = videoUrl;

      // When the video metadata is loaded, seek to the desired time
      video.onloadedmetadata = () => {
        // Seek to 1 second or 25% of the video, whichever is less
        const seekTime = Math.min(1, video.duration * 0.25);
        video.currentTime = seekTime;

        // When the video frame is available, capture it
        video.onseeked = () => {
          // Create a canvas element
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw the video frame to the canvas
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(videoUrl);
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convert the canvas to a data URL
          const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);

          // Clean up
          URL.revokeObjectURL(videoUrl);

          // Set the thumbnail preview
          setThumbnailPreview(thumbnailDataUrl);

          // Return the data URL
          resolve(thumbnailDataUrl);
        };

        // Handle errors
        video.onerror = () => {
          URL.revokeObjectURL(videoUrl);
          reject(new Error("Error generating thumbnail"));
        };
      };

      // Handle errors
      video.onerror = () => {
        URL.revokeObjectURL(videoUrl);
        reject(new Error("Error loading video"));
      };
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size before setting
    if (file.size > 50 * 1024 * 1024) {
      // 50MB
      toast({
        title: "Error",
        description: "File size exceeds 50MB limit",
        variant: "destructive",
      });
      return;
    }

    form.setValue("file", file);
    const videoUrl = URL.createObjectURL(file);
    setPreview(videoUrl);

    // Generate thumbnail
    generateThumbnail(file).catch((error) => {
      console.error("Error generating thumbnail:", error);
      toast({
        title: "Warning",
        description: "Could not generate thumbnail. Upload may still work.",
        variant: "destructive",
      });
    });
  };

  const onSubmit = async (values: ShortFormValues) => {
    setUploading(true);
    setProgress(0);

    try {
      const file = values.file as File;
      if (!file) {
        throw new Error("No file selected");
      }

      // Use a promise-based approach for FileReader
      const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        });
      };

      // Update progress to show we're processing
      setProgress(10);

      // Read the file
      const base64File = await readFileAsDataURL(file);

      // Get the thumbnail
      let thumbnailData = thumbnailPreview;

      // If we don't have a thumbnail preview, try to generate one now
      if (!thumbnailData) {
        try {
          thumbnailData = await generateThumbnail(file);
        } catch (error) {
          console.error("Error generating thumbnail:", error);
          // Continue without a thumbnail - the server will handle it
        }
      }

      // Update progress to show we're starting upload
      setProgress(20);

      const { data } = await axios.post(
        "/api/shorts",
        {
          file: base64File,
          title: values.title,
          description: values.description,
          public: values.public,
          thumbnail: thumbnailData, // Send the thumbnail data
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          // Increase timeout since we're uploading large files
          timeout: 300000, // 5 minutes
          maxBodyLength: Number.POSITIVE_INFINITY,
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setProgress(progress);
          },
        },
      );

      toast({
        title: "Success",
        description: "Short uploaded successfully",
      });

      // Reset form and preview
      form.reset({
        public: true,
        title: "",
        description: "",
        file: null as any,
      });
      setPreview(null);
      setThumbnailPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
      if (axios.isAxiosError(error)) {
        // Log the full response for debugging
        console.error("Full error response:", error.response?.data);
        toast({
          title: "Error",
          description:
            error.response?.data?.error ||
            error.response?.statusText ||
            error.message ||
            "Upload failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to upload video",
          variant: "destructive",
        });
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

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
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
                <video
                  ref={videoRef}
                  src={preview}
                  className="h-auto w-full rounded-lg"
                  controls
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    form.setValue("file", null as any);
                    setPreview(null);
                    setThumbnailPreview(null);
                  }}
                >
                  <Cross1Icon className="h-4 w-4" />
                </Button>
              </div>

              {thumbnailPreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Thumbnail Preview:</p>
                  <div className="relative h-auto w-32">
                    <img
                      src={thumbnailPreview || "/placeholder.svg"}
                      alt="Video thumbnail"
                      className="w-full rounded-md object-cover"
                    />
                  </div>
                </div>
              )}

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

              {uploading && <Progress value={progress} className="w-full" />}

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload Short"}
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
