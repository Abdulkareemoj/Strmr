import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

import { Input } from "./ui/input";

export default function VideoUpload() {
  const [file, setFile] = useState<File | undefined>();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const handleCheckBoxChange = (e: any) => {
    setIsPublic(!isPublic);
  };

  async function handleUpload() {
    const data = new FormData();
    if (!file) return;
    setUploading(true);
    data.append("file", file);

    const config: AxiosRequestConfig = {
      onUploadProgress: function (progressEvent: {
        loaded: number;
        total: number;
      }) {
        const percentComplete = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
      },
    };

    try {
      await axios.post("/api/videos", data, config);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  function handleSetFile(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files?.length) {
      setFile(files[0]);
    }
  }

  return (
    //make a dropdown to select whether upload is short  or video
    <>
      <div className="">
        videoUpload {error && <p>{error}</p>}
        {uploading && <p>{progress}</p>}
      </div>
      <form action="POST" method="post">
        <Label htmlFor="file"> File</Label>
        <Input type="file" id="file" accept=".mp4" onChange={handleSetFile} />
        <Input
          type="checkbox"
          checked={isPublic}
          onChange={handleCheckBoxChange}
        />
      </form>
      <Button type="button" onClick={handleUpload}>
        Upload Video
      </Button>
    </>
  );
}
