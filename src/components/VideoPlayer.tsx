function VideoPlayer({ id }: { id: string }) {
  return (
    <video
      src={`/api/videos/?videoID=${id}`}
      width="auto"
      height="auto"
      controls
      id="video-player"
    />
  );
}

export default VideoPlayer;
