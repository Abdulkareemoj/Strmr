import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { JSX, SVGProps } from "react";

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
              From the album "Interstellar Melodies"
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Slider
            className="[&_[role=slider]]:bg-primary [&>span:first-child_span]:bg-primary w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-300 dark:[&>span:first-child]:bg-gray-600 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:transition-transform [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0"
            defaultValue={[30]}
          />
          <div className="mt-4 flex w-full items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">1:23</span>
            <span className="text-gray-500 dark:text-gray-400">4:56</span>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon">
              <RewindIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon">
              <PlayIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button variant="ghost" size="icon">
              <FastForwardIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FastForwardIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  );
}

function PlayIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function RewindIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
    </svg>
  );
}
