"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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

import { type VideoFormValues, videoSchema } from "~/lib/validations/schemas";

export default function VideoUpload() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      public: true,
      title: "",
      description: "",
      file: null as any,
    },
  });

  const onSubmit = async (values: VideoFormValues) => {
    if (!file) {
      toast.error("Please select a video file");
      return;
    }

    setUploading(true);
    try {
      const presignedRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "videos",
          fileType: file.type,
        }),
      });

      if (!presignedRes.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, publicUrl } = await presignedRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Failed to upload file");

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          isPublic: values.public,
          url: publicUrl,
          duration: 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to save video metadata");

      toast.success("Video uploaded successfully");
      form.reset();
      setPreview(null);
      setFile(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Please try again");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel className="text-neutral-300">Video File</FormLabel>
                <FormControl>
                  <div className="rounded-lg border-2 border-dashed border-neutral-700 bg-neutral-900/50 p-8">
                    {!file ? (
                      <label className="flex cursor-pointer flex-col items-center gap-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800">
                          <Upload className="w-6 h-6 text-neutral-400" />
                        </div>
                        <p className="text-sm text-neutral-300">
                          Click to select a video file
                        </p>
                        <p className="text-xs text-neutral-500">
                          MP4, WebM, AVI (max 512MB)
                        </p>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              setFile(f);
                              setPreview(URL.createObjectURL(f));
                            }
                          }}
                        />
                      </label>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        {preview && (
                          <video
                            src={preview}
                            className="max-h-48 rounded-lg"
                            controls
                          >
                            <track kind="captions" />
                          </video>
                        )}
                        <p className="text-sm text-neutral-300">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-neutral-700 text-white hover:bg-neutral-800/50"
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Change video
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormDescription className="text-neutral-400">
                  Max 512MB. Supported formats: MP4, WebM, AVI
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-300">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter video title"
                    className="border-neutral-700 bg-neutral-800/50 text-white placeholder:text-neutral-500"
                    {...field}
                  />
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
                <FormLabel className="text-neutral-300">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter video description"
                    className="border-neutral-700 bg-neutral-800/50 text-white placeholder:text-neutral-500 min-h-24"
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
              <FormItem className="flex items-center justify-between rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-neutral-300">Public Video</FormLabel>
                  <FormDescription className="text-neutral-400">
                    Make this video visible to all users
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

          <Button
            type="submit"
            className="w-full bg-white text-black hover:bg-neutral-200 font-semibold"
            disabled={uploading || !file}
          >
            {uploading ? "Uploading..." : "Publish Video"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
