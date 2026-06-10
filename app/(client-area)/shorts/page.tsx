import { SectionHeader } from "~/components/section-header";
import * as motion from "motion/react-client";

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
            className="text-center py-12"
          >
            <p className="text-neutral-400">Shorts feature coming soon</p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
