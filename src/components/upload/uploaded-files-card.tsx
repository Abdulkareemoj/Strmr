import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { EmptyCard } from "~/components/upload/empty-card";
import { type UploadedFile } from "~/types/types";

interface UploadedFilesCardProps {
  uploadedFiles: UploadedFile[];
}

export function UploadedFilesCard({ uploadedFiles }: UploadedFilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ScrollArea className="pb-4">
            {uploadedFiles.map((file) => (
              <div key={file.key} className="relative aspect-video w-64">
                {file.url ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    sizes="(min-width: 640px) 640px, 100vw"
                  />
                ) : (
                  <div className="text-red-500">URL not available</div>
                )}
              </div>
            ))}
          </ScrollArea>
        ) : (
          <EmptyCard title={""} />
        )}
      </CardContent>
    </Card>
  );
}
