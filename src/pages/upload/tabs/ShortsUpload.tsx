"use client";

import * as React from "react";
import { createClient } from "~/utils/supabase/component";
import { toast } from "sonner";
import { FileTextIcon, Trash2Icon, UploadIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Input } from "~/components/ui/input";

// Initialize Supabase client (replace with your actual Supabase URL and anon key)
const supabase = createClient();

interface UploadedFile {
  key: string;
  url: string;
  name: string;
}

export default function ShortsUpload() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesToUpload = event.target.files;
    if (!filesToUpload) return;

    setUploading(true);
    setFiles(Array.from(filesToUpload));

    for (const file of filesToUpload) {
      try {
        const { data, error } = await supabase.storage
          .from("strmrvids")
          .upload(`shorts/${file.name}`, file, {
            cacheControl: "3600",
            upsert: false,
            onUploadProgress: (progress) => {
              const percent = (progress.loaded / progress.total) * 100;
              setProgresses((prev) => ({ ...prev, [file.name]: percent }));
            },
          });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("strmrvids")
          .getPublicUrl(`shorts/${file.name}`);

        setUploadedFiles((prev) => [
          ...prev,
          {
            key: data.path,
            url: publicUrl,
            name: file.name,
          },
        ]);

        toast.success(`Short ${file.name} uploaded successfully`);
      } catch (error) {
        console.error("Error uploading short:", error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setFiles([]);
    setProgresses({});
  };

  const onDelete = async (file: UploadedFile) => {
    try {
      const { error } = await supabase.storage
        .from("shorts")
        .remove([file.key]);

      if (error) throw error;

      setUploadedFiles((prev) => prev.filter((f) => f.key !== file.key));
      toast.success(`Short ${file.name} deleted successfully`);
    } catch (error) {
      console.error("Error deleting short:", error);
      toast.error(`Failed to delete ${file.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex w-full items-center justify-center">
        <label
          htmlFor="shorts-upload"
          className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <UploadIcon className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              MP4, AVI, MOV (MAX. 50MB)
            </p>
          </div>
          <Input
            id="shorts-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={onUpload}
            multiple
            disabled={uploading}
          />
        </label>
      </div>
      {Object.entries(progresses).map(([fileName, progress]) => (
        <div key={fileName} className="space-y-2">
          <p>{fileName}</p>
          <Progress value={progress} className="w-full" />
        </div>
      ))}
      <UploadedFilesCard uploadedFiles={uploadedFiles} onDelete={onDelete} />
    </div>
  );
}

function UploadedFilesCard({
  uploadedFiles,
  onDelete,
}: {
  uploadedFiles: UploadedFile[];
  onDelete: (file: UploadedFile) => void;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Uploaded Shorts
        </h3>
        <p className="text-sm text-muted-foreground">
          View and manage your uploaded shorts here
        </p>
      </div>
      <div className="p-6">
        {uploadedFiles.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div
                  key={file.key}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <FileTextIcon className="h-8 w-8" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">Short</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(file)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        ) : (
          <div className="py-10 text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No shorts
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by uploading a short.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
