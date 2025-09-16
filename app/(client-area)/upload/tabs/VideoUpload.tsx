/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as React from "react";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";

import { useToast } from "~/hooks/use-toast";
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

import { uploadVideo } from "~/utils/upload";

import { type VideoFormValues, videoSchema } from "~/lib/validations/schemas";
import { createClient } from "~/utils/supabase/client";
const supabase = createClient();
const {
  data: { session },
} = await supabase.auth.getSession();
export default function VideoUpload() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = React.useState<string | null>(
    null,
  );
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      public: true,
      title: "",
      description: "",
      file: null as any,
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size exceeds 100MB",
        variant: "destructive",
      });
      return;
    }

    form.setValue("file", file);
    const url = URL.createObjectURL(file);
    setPreview(url);

    // try to generate thumbnail for video (client-side)
  };

  const clearSelection = () => {
    const file = form.getValues("file") as File | null;
    if (file) URL.revokeObjectURL(preview || "");
    form.setValue("file", null as any);
    setPreview(null);
    setThumbnailPreview(null);
  };

  const onSubmit = async (values: VideoFormValues) => {
    setUploading(true);
    setProgress(10);
    try {
      const file = values.file as File;
      if (!file) throw new Error("No file selected");

      const { videoUrl, thumbnail_url, duration, fileName } = await uploadVideo(
        file,
        "videos",
        setProgress,
      );

      await axios.post("/api/videos", {
        title: values.title,
        description: values.description,
        public: values.public,
        url: videoUrl,
        video_id: fileName,
        thumbnail_url,
        duration,
        user_id: session?.user.id, //
      });

      toast({ title: "Success", description: "Video uploaded successfully" });
      form.reset();
      clearSelection();
    } catch (err: any) {
      toast({
        title: "Upload failed",
        description: err?.message ?? "Please try again",
        variant: "destructive",
      });
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
                htmlFor="video-upload"
                className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
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
                <video
                  src={preview}
                  className="h-auto w-full rounded-lg"
                  controls
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearSelection}
                >
                  <Cross1Icon className="h-4 w-4" />
                </Button>
              </div>

              {thumbnailPreview && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Thumbnail Preview:</p>
                  <div className="relative h-auto w-32">
                    <img
                      src={thumbnailPreview}
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

              {uploading && <Progress value={progress} className="w-full" />}

              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload Video"}
              </Button>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
