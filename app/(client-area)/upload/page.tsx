import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SectionHeader } from "~/components/section-header";
import VideoUpload from "./tabs/VideoUpload";
import ShortsUpload from "./tabs/ShortsUpload";
import { Metadata } from "next/types";
import * as motion from "motion/react-client";

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload your videos, shorts and content",
};

export default function Upload() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              title="Create & Upload"
              description="Share your content with the world"
              badge={{ text: "Creator", variant: "purple" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-lg border border-neutral-800/50 bg-neutral-900/30 p-6 md:p-8">
              <Tabs defaultValue="video" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="grid w-full max-w-xs grid-cols-2 bg-neutral-800/50">
                    <TabsTrigger 
                      value="video"
                      className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                    >
                      Video
                    </TabsTrigger>
                    <TabsTrigger 
                      value="short"
                      className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white"
                    >
                      Short
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="video" className="mt-0">
                  <VideoUpload />
                </TabsContent>

                <TabsContent value="short" className="mt-0">
                  <ShortsUpload />
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
