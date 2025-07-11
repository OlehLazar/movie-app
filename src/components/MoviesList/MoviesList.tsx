import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setMovies } from '../../features/moviesSlice';
import { getMovies } from '../../features/moviesAPI';
import type { Movie } from '../../interfaces/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import type { GetMoviesParams } from '../../interfaces/GetMoviesParams';
import styles from './MoviesList.module.scss';
import { Button } from '../ui/Button/Button';

const MOVIES_PER_PAGE = 9;

interface MoviesListProps {
  filters: GetMoviesParams;
}

export const MoviesList = ({ filters }: MoviesListProps) => {
  const dispatch = useAppDispatch();
  const movies = useAppSelector((state) => state.movies.movies);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const query: GetMoviesParams = {
          sort: 'title',
          order: 'ASC',
          limit: MOVIES_PER_PAGE,
          offset: (currentPage - 1) * MOVIES_PER_PAGE,
          ...filters,
        };

        const [data, count] = await getMovies(query);
        dispatch(setMovies(data));
        setHasMore((currentPage * MOVIES_PER_PAGE) < count);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [filters, currentPage, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <h2>Movies List (A-Z)</h2>

      {error && <div className={styles.error}>Error: {error}</div>}

      <ul className={styles.listContainer}>
        {movies.map((movie: Movie) => (
          <li key={movie.id} className={styles.listItem}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>

      <Button onClick={handlePrev} disabled={currentPage === 1 || isLoading}>
        Prev
      </Button>

      Page {currentPage}
      <Button onClick={handleNext} disabled={!hasMore || isLoading}>
        Next
      </Button>

      {isLoading && <div className={styles.spinnerOverlay}>Loading...</div>}
    </div>
  );
};

export default MoviesList;
