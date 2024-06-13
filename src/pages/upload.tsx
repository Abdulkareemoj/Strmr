import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import axios, { type AxiosProgressEvent } from "axios";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/ui/use-toast";
import { Progress } from "~/components/ui/progress";
import { Input } from "~/components/ui/input";
import { type Metadata } from "next";
export const metadata: Metadata = {
  title: "Upload",
  description: "Upload Page",
};
const FormSchema = z.object({
  videotype: z.string({
    required_error: "Please select one.",
  }),
});

export default function Upload() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function handleSubmit(data: z.infer<typeof FormSchema>) {
    if (!file) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("video", file);

    const config = {
      onUploadProgress: function (progressEvent: AxiosProgressEvent) {
        const percentComplete = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        setProgress(percentComplete);
      },
    };

    try {
      await axios.post(`/api/${data.videotype}`, formData, config);
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setUploading(false);
      setProgress(0);
      setFileName("");
    }
  }

  function handleSetFile(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files?.length) {
      const file = files[0] ?? null;
      setFile(file);
      if (file) {
        setFileName(file.name);
      }
    }
  }

  return (
    <main className="mx-auto flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="videotype"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl">Video Upload</FormLabel>
                <FormDescription>Please specify the video type</FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a video type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="short">Short</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <Input type="file" accept="video/*" onChange={handleSetFile} />
          {fileName && <p>Selected file: {fileName}</p>}
          <Button type="submit" disabled={uploading}>
            Upload
          </Button>
          {uploading && <Progress value={progress} className="w-[60%]" />}
          {error && <p>Error: {error}</p>}
        </form>
      </Form>
    </main>
  );
}
