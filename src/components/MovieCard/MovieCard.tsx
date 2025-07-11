import { useState } from "react";
import { deleteMovie, getMovieById } from "../../features/moviesAPI";
import type { Movie } from "../../interfaces/Movie";
import { useAppDispatch } from "../../app/hooks";
import { removeMovieFromList } from "../../features/moviesSlice";
import { Button } from "../ui/Button/Button";
import styles from './MovieCard.module.scss';

interface MovieCardProps {
  movie: Pick<Movie, "id" | "title" | "year" | "format">;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const dispatch = useAppDispatch();

  const [isExpanded, setIsExpanded] = useState(false);
  const [fullMovie, setFullMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggle = async () => {
    setIsExpanded(!isExpanded);

    if (!isExpanded && !fullMovie) {
      try {
        setLoading(true);
        setError(null);
        const fetchedMovie = await getMovieById(movie.id);
        console.log("Fetched movie:", fetchedMovie);

        const adaptedMovie: Movie = {
          id: fetchedMovie.id,
          title: fetchedMovie.title,
          year: fetchedMovie.year,
          format: fetchedMovie.format,
          actors: fetchedMovie.actors,
        };

        setFullMovie(adaptedMovie);
        console.log("Adapted movie:", adaptedMovie);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMovie(movie.id);
      dispatch(removeMovieFromList(movie.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete movie");
    } finally {
      setIsDeleting(false);
    }
  };

  const displayMovie = fullMovie ?? {
    ...movie,
    actors: [],
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {movie.title} ({movie.year})
        </h3>
        <p className={styles.meta}>Format: {movie.format}</p>
      </div>

      <div className={styles.actions}>
        <Button onClick={handleToggle}>
          <p>{isExpanded ? "Hide details" : "Details"}</p>
        </Button>

        <Button onClick={handleDelete} disabled={isDeleting}>
          <p>{isDeleting ? "Deleting..." : "Delete"} </p>
        </Button>
      </div>

      {isExpanded && (
        <div className={styles.details}>
          {loading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>Error: {error}</p>}
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
