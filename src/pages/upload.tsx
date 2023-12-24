import { type Metadata } from "next";
import VideoUpload from "~/components/VideoUpload";
export const metadata: Metadata = {
  title: "Upload",
  description: "Upload Page",
};
function Upload() {
  return (
    <main>
      <VideoUpload />
    </main>
  );
}
export default Upload;
