import { useState } from "react";
import axios from "axios";

export default function VideoUpload() {
  const [file, setFile] = useState<File | undefined>();
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

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
          (progressEvent.loaded * 100) / progressEvent.total
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

  function handleSetFile(event: React.ChangeEvent<HTMLInputElement>) {}

  return (
    <>
      <div>
        videoUpload {error && <p>{error}</p>}
        {uploading && <p>{progress}</p>}
      </div>
      <form action="POST" method="post">
        <label htmlFor="file"> File</label>
        <input type="file" id="file" accept=".mp4" onChange={handleSetFile} />
      </form>
      <button type="button" onClick={handleUpload}>
        Upload Video
      </button>
    </>
  );
}
