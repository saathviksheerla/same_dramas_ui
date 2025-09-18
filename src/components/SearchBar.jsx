import React, { useState, useRef } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch, onMore }) => {
  const [movieInput, setMovieInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  if (
    !recognitionRef.current &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
  ) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMovieInput(transcript);
      handleSearch(transcript); // auto-trigger search
    };

    recognitionRef.current = recognition;
  }

  const handleSearch = async (query = movieInput) => {
    if (query.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSearch(query);
        setMovieInput("");
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

 const handleMicClick = () => {
  if (!recognitionRef.current) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  // Option 1: Ignore clicks while listening
  if (isListening) return;
  recognitionRef.current.start();
};

  

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
  
        
          <div className="search-input-wrapper">
            <button
            type="button"
            onClick={handleMicClick}
            className={`mic-button ${isListening ? "listening" : ""}`}
            disabled={isSubmitting}
            aria-label="Voice search"
          >
            <img
              src="/mic.png"  // <-- public folder path
              alt="mic"
              className="mic-icon"
            />
          </button>

          </div>

          <input
            type="text"
            value={movieInput}
            onChange={(e) => setMovieInput(e.target.value)}
            placeholder="Search for movies..."
            className="search-input"
            disabled={isSubmitting}
          />
          
          <button
            type="submit"
            className="search-button"
            disabled={isSubmitting || !movieInput.trim()}
          >
            {isSubmitting ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onMore: PropTypes.func.isRequired,
};

export default SearchBar;
