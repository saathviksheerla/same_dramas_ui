import React, { useState } from 'react';
import './MovieCard.css';
import { fetchTrailer } from '../api';

const MovieCard = ({ movie }) => {

  const [showLanguages, setShowLanguages] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  const languages = ['Hindi', 'English', 'Telugu']; // extend if needed

  const fetchYouTubeVideo = async (language) => {
    try{
      const response = await fetchTrailer(language, movie.title);

      const data = response.data;

      if (response.status === 200 && data.url) {
        const embedUrl = data.url.replace('watch?v=', 'embed/') + '?controls=1&rel=0';

        // Open trailer in new tab
        const trailerWindow = window.open('', '_blank', 'width=900,height=600');
        trailerWindow.document.write(`
          <html>
            <head>
              <title>Trailer - ${movie.title}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background-color: #111;
                  color: #fff;
                  text-align: center;
                }
                h2 { margin-bottom: 20px; }
                iframe { border: none; max-width: 100%; }
              </style>
            </head>
            <body>
              <h2>You are watching the trailer of "${movie.title}"</h2>
              <iframe width="800" height="450" src="${embedUrl}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </body>
          </html>
        `);
        trailerWindow.document.close();
      } else {
        alert(data.error || 'Trailer not found.');
      }
    } catch (err) {
      console.error('Error fetching trailer:', err);
      alert('Failed to fetch trailer.');
    }
  };

  return (
    <div className="movie-card">
      {/* Poster */}
      <div className="movie-poster">
        {movie.img ? (
          <img src={movie.img} alt={movie.title} />
        ) : (
          <div className="image-not-available">
            <span>No Image Available</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>

        <div className="movie-meta">
          {movie.year && <span className="movie-year">{movie.year}</span>}
          {movie.genre && <span className="movie-genre">{movie.genre}</span>}
        </div>

        <p className="movie-description">{movie.description}</p>

        {/* Watch Trailer Button */}
        <button
          onClick={() => setShowLanguages(!showLanguages)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            padding: '12px 24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Watch Trailer
        </button>

        
        <div className={`language-overlay ${showLanguages ? 'show' : ''}`}>
          <p className="select-language-text">Select a language:</p>

          <div className="language-buttons">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  fetchYouTubeVideo(lang);
                  setShowLanguages(false); 
                }}
                className="language-btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(244, 244, 240, 1)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
        {/* ===== End Language Overlay ===== */}
      </div>
    </div>
  );
};

export default MovieCard;
