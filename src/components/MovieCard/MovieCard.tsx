import { useState } from "react";
import { deleteMovie, getMovieById } from "../../features/moviesAPI";
import type { Movie } from "../../interfaces/Movie";
import { useAppDispatch } from "../../app/hooks";
import { removeMovieFromList } from "../../features/moviesSlice";
import { Button } from "../ui/Button/Button";
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: Pick<Movie, "id" | "title" | "year" | "format">;
  onMovieDeleted: () => void;
}

export const MovieCard = ({ movie, onMovieDeleted }: MovieCardProps) => {
  const dispatch = useAppDispatch();

  const [isExpanded, setIsExpanded] = useState(false);
  const [fullMovie, setFullMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string; type: 'details' | 'delete'} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsExpanded(!isExpanded);

    if (!isExpanded && !fullMovie) {
      try {
        setLoading(true);
        setError(null);
        const fetchedMovie = await getMovieById(movie.id);

        const adaptedMovie: Movie = {
          id: fetchedMovie.id,
          title: fetchedMovie.title,
          year: fetchedMovie.year,
          format: fetchedMovie.format,
          actors: fetchedMovie.actors,
        };

        setFullMovie(adaptedMovie);
      } catch (err) {
        setError({
          message: err instanceof Error ? err.message : "Failed to load movie details",
          type: 'details'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteMovie(movie.id);
      dispatch(removeMovieFromList(movie.id));
      onMovieDeleted();
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : "Failed to delete the movie",
        type: 'delete'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const displayMovie = fullMovie ?? {
    ...movie,
    actors: [],
  };

  const clearError = () => setError(null);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {movie.title} ({movie.year})
        </h3>
        <p className={styles.meta}>Format: {movie.format}</p>
      </div>

      {/* Загальне повідомлення про помилку */}
      {error && error.type === 'delete' && (
        <div className={`${styles.error} ${styles.globalError}`}>
          <span>{error.message}</span>
          <button 
            className={styles.closeError} 
            onClick={clearError}
            aria-label="Close error"
          >
            &times;
          </button>
        </div>
      )}

      <div className={styles.actions}>
        <Button onClick={handleToggle}>
          <p>{isExpanded ? "Hide details" : "Details"}</p>
        </Button>

        <Button 
          onClick={handleDelete} 
          disabled={isDeleting}
        >
          <p>{isDeleting ? "Deleting..." : "Delete"} </p>
        </Button>
      </div>

      {isExpanded && (
        <div className={styles.details}>
          {loading && <div className={styles.loading}>Loading...</div>}
          
          {/* Помилка деталей фільму */}
          {error && error.type === 'details' && (
            <div className={styles.error}>
              <span>{error.message}</span>
              <button 
                className={styles.closeError} 
                onClick={clearError}
                aria-label="Close error"
              >
                &times;
              </button>
            </div>
          )}

          {!loading && !error && (
            <div>
              <p className={styles.actors}>
                <strong>Actors:</strong>{" "}
                {Array.isArray(displayMovie.actors) && displayMovie.actors.length > 0
                  ? displayMovie.actors.map((actor) => actor.name).join(", ")
                  : "No actors listed"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};