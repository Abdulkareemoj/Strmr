"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import VideoUpload from "./tabs/VideoUpload";
import ShortsUpload from "./tabs/ShortsUpload";
import { Metadata } from "next/types";

const metadata: Metadata = {
  title: "Upload",
  description: "Upload Page",
};
// const FormSchema = z.object({
//   videotype: z.string({
//     required_error: "Please select one.",
//   }),
// });

export default function Upload() {
  return (
    <main className="mx-auto flex flex-col justify-center p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Video Upload</h1>
        <p className="text-muted-foreground text-xl">
          Please specify the video type
        </p>
      </div>
      <Tabs defaultValue="video" className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex justify-center">
          <TabsList className="grid w-full max-w-sm grid-cols-2">
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="short">Short</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="video">
          <VideoUpload />
        </TabsContent>
        <TabsContent value="short">
          <ShortsUpload />
        </TabsContent>
      </Tabs>
    </main>
  );
}
