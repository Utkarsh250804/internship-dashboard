import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "./components/MovieCard";
import "./App.css";

function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);

  const API_KEY = "52814ddd";

  useEffect(() => {

    const timer = setTimeout(() => {

      if (query) {

        searchMovies();

      }

    }, 500); // debouncing

    return () => clearTimeout(timer);

  }, [query, page]);

  const searchMovies = async () => {

    const res = await axios.get(
      `https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${API_KEY}`
    );

    if (page === 1) {
      setMovies(res.data.Search || []);
    } else {
      setMovies(prev => [...prev, ...(res.data.Search || [])]);
    }

  };

  const loadMore = () => {
    setPage(page + 1);
  };

  return (

    <div className="app">

      <h1>Movie Search App</h1>

      <input
        type="text"
        placeholder="Search Movies..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />

      <div className="movie-grid">

        {movies.map(movie => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}

      </div>

      {movies.length > 0 && (
        <button onClick={loadMore}>
          Load More
        </button>
      )}

    </div>

  );

}

export default App;