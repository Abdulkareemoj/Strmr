import VideoPlayer from "@/components/VideoPlayer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function VideoPage() {
  const router = useRouter();
  const { videoId } = router.query as { videoId: string };

  return <VideoPlayer id={videoId} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: { query: context.query },
  };
};

// import { useState } from 'react'
// import { auth } from "../auth" // Replace with the actual path to your auth.ts file

// export default function HomePage() {
//   const [videoId, setVideoId] = useState('')

//   return (
//     <div>
//       <input type="text" value={videoId} onChange={e => setVideoId(e.target.value)} />
//       <video controls>
//         <source src={`/api/videos/stream?id=${videoId}`} type="video/mp4" />
//       </video>
//     </div>
//   )
// }
