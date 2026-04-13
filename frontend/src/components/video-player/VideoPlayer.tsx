"use client";

import { useState } from "react";

interface Props {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: Props) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full">
      {loading && <p className="text-center">Loading video...</p>}

      <video
        src={videoUrl}
        controls
        className="w-full rounded-xl shadow-lg"
        onLoadedData={() => setLoading(false)}
      />
    </div>
  );
};

export default VideoPlayer;