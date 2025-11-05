import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieCard from "./components/MovieCard";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar"; // <-- import the updated SearchBar
import { fetchHome, searchMovie } from "./api";
import {   fetchMoreMovies } from "./api";
import TrailerPage from './components/TrailerPage';
import "./App.css";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const response = await fetchHome();

        if (response.data && response.data.data && response.data.data.movies) {
          setMovies(response.data.data.movies);
          if (response.data.data.movies.length > 0) {
            setFeaturedMovie(response.data.data.movies[0]);
          }
        } else {
          setError("Failed to load movies data");
        }
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to connect to the server. Please make sure the server is running.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Search handler for SearchBar component
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError("Please enter a movie name to search");
      return;
    }

    try {
      setSearchLoading(true);
      setError(null);

      const response = await searchMovie(query.trim());

      if (response.data) {
        const { status, data, message } = response.data;
        console.log("Search response:", response.data);

        if (status === "success" || status === "partial_success") {
          const { searchedMovie, similarMovies } = data;
          setSearchResults({
            movie: searchedMovie,
            similarMovies: {
              directorMovies: similarMovies?.directorMovies || [],
              actorMovies: similarMovies?.actorMovies || [],
              genreMovies: similarMovies?.genreMovies || []
            },
            isPartialResult: status === "partial_success"
          });
          setFeaturedMovie(null);
          if (status === "partial_success") {
            setError(message || "Found the movie, but couldn't get all recommendations");
          }
        } else {
          setError(message || "No results found for your search.");
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error("Error searching movies:", err);
      if (err.response && err.response.status === 404) {
        setError("Movie not found. Please try a different title.");
      } else {
        setError(err.response?.data?.message || "Failed to search for movies. Please try again.");
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const handleMore = () => {
    console.log("Loading more movies");
  };

  if (loading) {
    return (
      <div style={{ 
        backgroundColor: '#0a0d11', 
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <h2>Loading movies...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="app">
            <div className="container">
              <header className="app-header">
                <h1>SAME DRAMA's</h1>
                <p>A movie recommendation platform for you</p>
              </header>

              {/* ✅ Use the SearchBar component with mic support */}
              <div className="search-section">
                <SearchBar onSearch={handleSearch} onMore={handleMore} />
              </div>

              {error && <div className="error-message">{error}</div>}

              {searchResults && (
                <div className="search-results-section">
                  <h2>Search Results</h2>
                  <div className="searched-movie">
                    <h3>Your Movie</h3>
                    <MovieCard movie={searchResults.movie} />
                  </div>

                  {searchResults.similarMovies.directorMovies.length > 0 && (
                    <div className="recommendation-section">
                      <h3>Movies by the Same Director</h3>
                      <div className="movies-grid">
                        {searchResults.similarMovies.directorMovies.map((movie, index) => (
                          <MovieCard key={`director-${index}`} movie={movie} />
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.similarMovies.actorMovies.length > 0 && (
                    <div className="recommendation-section">
                      <h3>Movies with Similar Cast</h3>
                      <div className="movies-grid">
                        {searchResults.similarMovies.actorMovies.map((movie, index) => (
                          <MovieCard key={`actor-${index}`} movie={movie} />
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.similarMovies.genreMovies.length > 0 && (
                    <div className="recommendation-section">
                      <h3>Similar Genre Movies</h3>
                      <div className="movies-grid">
                        {searchResults.similarMovies.genreMovies.map((movie, index) => (
                          <MovieCard key={`genre-${index}`} movie={movie} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!searchResults && (
                <div className="movies-section">
                  <div className="section-header">
                    <h2>Recommended Movies</h2>
                    <button 
                      className="more-button"
                      onClick={handleMore}
                      disabled={loading}
                    >
                      More Movies
                    </button>
                  </div>

                  <div className="movies-grid">
                    {movies.map((movie, index) => (
                      <MovieCard key={index} movie={movie} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Footer />
          </div>
        } />

        <Route path="/movie-trailer" element={<TrailerPage />} />
      </Routes>
    </Router>
  );
};

export default App;
