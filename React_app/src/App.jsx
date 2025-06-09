import React, { useState } from 'react';
import Search from './components/search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import {useDebounce} from 'react-use';

const API_URL_BASE = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [movieList, setMovieList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm])

  const fetchMovies = async (query) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ? `${API_URL_BASE}/search/movie?query=${encodeURIComponent(query)}&sort_by=popularity.desc`
      : `${API_URL_BASE}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      if(data.Response=== 'False') {
        throw new Error(data.error || 'Faield to fetch movies');  
        setMovieList ([]);
        return;  
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error.message}`);
      setErrorMessage('Failed to fetch movies. Please try again later.');
    }finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="logo" />
          <h1>
            Find Your Favorite <span className='text-gradient'>Movies</span> here
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className='mt-[40px]'>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red">{errorMessage}</p>
          ):(
            <ul>
              {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
