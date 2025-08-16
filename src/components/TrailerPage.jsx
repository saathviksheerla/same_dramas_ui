import React from 'react';
import { useLocation } from 'react-router-dom';

const TrailerPage = () => {
  const location = useLocation();
  const { title, url } = location.state || {};

  if (!url || !title) {
    return <p>Invalid trailer data. Please try again from the movie page.</p>;
  }

  // Convert YouTube watch URL to embed URL
  const embedUrl = url.replace("watch?v=", "embed/");

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>You are watching the trailer of "{title}"</h2>
      <div style={{ marginTop: '20px' }}>
        <iframe
          width="800"
          height="450"
          src={`${embedUrl}?autoplay=1&modestbranding=1&controls=1`}
          title={`Trailer of ${title}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TrailerPage;
