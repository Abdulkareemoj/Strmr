import UploadComponent from "~/components/UploadComponent";

export default function ShortsUploadPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Upload Shorts</h1>
      <UploadComponent uploadType="shorts" maxFileSize={50} />
    </div>
  );
}
