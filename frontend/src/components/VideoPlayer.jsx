import React from 'react';

const VideoPlayer = ({ url, title }) => {
  // Simple check to convert YouTube watch link to embed link
  const embedUrl = url?.replace("watch?v=", "embed/");

  return (
    <div className="w-full">
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800">
        {url ? (
          <iframe className="w-full h-full" src={embedUrl} title={title} allowFullScreen />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Select a lecture to start watching</div>
        )}
      </div>
      <h2 className="text-2xl font-bold mt-6">{title}</h2>
    </div>
  );
};

export default VideoPlayer;