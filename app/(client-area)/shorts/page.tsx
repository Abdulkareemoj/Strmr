import { Suspense } from "react";
import { SectionHeader } from "~/components/section-header";
import * as motion from "motion/react-client";
import ShortsList from "~/components/shortsList";

export default function Shorts() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              title="Shorts"
              description="Watch short-form vertical videos from creators"
              badge={{ text: "Quick Watch", variant: "teal" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <Suspense fallback={<div className="py-12 text-center text-muted-foreground">Loading shorts...</div>}>
              <ShortsList />
            </Suspense>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
