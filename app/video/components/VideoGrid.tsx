"use client";

interface Video {
  _id: string;
  title: string;
  youtubeLink: string;
  date: string;
  category: string;
}

interface VideoGridProps {
  videos: Video[];
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        No videos found.
      </p>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((video) => {
          const videoId = getYouTubeVideoId(video.youtubeLink);
          const embedUrl = videoId
            ? `https://www.youtube.com/embed/${videoId}`
            : null;

          return (
            <div key={video._id} className="w-full">
              <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    Invalid YouTube URL
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <h3 className="text-white text-lg font-semibold">
                  {video.title}
                </h3>
                {video.date && (
                  <p className="text-white/70 text-sm mt-1">
                    {new Date(video.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

