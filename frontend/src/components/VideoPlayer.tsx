import React from "react";

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  if (!videoUrl) return null;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 bg-black/40 backdrop-blur-xl">
      <video 
        src={videoUrl} 
        controls 
        className="w-full h-auto aspect-video object-contain"
        controlsList="nodownload"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
