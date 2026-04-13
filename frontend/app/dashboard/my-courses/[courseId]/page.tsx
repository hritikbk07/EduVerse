"use client";

import { useState } from "react";
import { useLessons } from "@/src/hooks/useLesson";
import VideoPlayer from "@/src/components/video-player/VideoPlayer";


const CoursePlayer = ({ params }: { params: { courseId: string } }) => {
  const { lessons, loading } = useLessons(params.courseId);
  const [currentVideo, setCurrentVideo] = useState<string>("");

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="font-bold mb-4">Lessons</h2>

        {lessons.map((lesson) => (
          <div
            key={lesson._id}
            className="p-2 cursor-pointer hover:bg-gray-200 rounded"
            onClick={() => setCurrentVideo(lesson.videoUrl)}
          >
            {lesson.title}
          </div>
        ))}
      </div>

      {/* Video Player */}
      <div className="flex-1 p-6">
        {currentVideo ? (
          <VideoPlayer videoUrl={currentVideo} />
        ) : (
          <p>Select a lesson to start</p>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;