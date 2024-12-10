import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { Icons } from "~/components/ui/icons";
export default function Component() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/placeholder.svg"
            alt="Album Art"
            width={200}
            height={200}
            className="h-48 w-48 rounded-lg object-cover"
          />
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Starlight Serenade
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              by The Cosmic Crooners
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              From the album &ldquo;Interstellar Melodies&ldquo;
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Slider
            className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-300 dark:[&>span:first-child]:bg-gray-600 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:transition-transform [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-primary"
            defaultValue={[30]}
          />
          <div className="mt-4 flex w-full items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">1:23</span>
            <span className="text-gray-500 dark:text-gray-400">4:56</span>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon">
              <Icons.RewindIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.PlayIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon">
              <Icons.FastForwardIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
