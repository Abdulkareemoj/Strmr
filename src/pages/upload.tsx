import VideoUpload from "~/components/VideoUpload";
export const metadata: Metadata = {
  title: "Upload",
  description: "Upload Page",
};
function UploadPage() {
  return (
    <main>
      <VideoUpload />
    </main>
  );
}
export default UploadPage;
