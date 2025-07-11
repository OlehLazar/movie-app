import { useRef, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addMovie } from "../../features/moviesAPI";
import { addMovieToList } from "../../features/moviesSlice";
import { Button } from "../ui/Button/Button";
import styles from "./MoviesImport.module.scss";
import { formats } from "../../constants/formats";

export const MoviesImport = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseMoviesFile = (content: string) => {
    const movies = [];
    const blocks = content.split(/\n\s*\n/).filter(block => block.trim() !== '');

    for (const block of blocks) {
      const lines = block.split('\n').filter(line => line.trim() !== '');
      let title = '';
      let releaseYear: number | null = null;
      let format = '';
      let actors: string[] = [];

      for (const line of lines) {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex === -1) continue;

        const key = line.substring(0, separatorIndex).trim();
        const value = line.substring(separatorIndex + 1).trim();

        switch (key) {
          case "Title":
            title = value;
            break;
          case "Release Year":
            releaseYear = parseInt(value, 10);
            break;
          case "Format":
            if (formats.includes(value as typeof formats[number])) {
              format = value;
            }
            break;
          case "Stars":
            actors = value.split(',').map(a => a.trim());
            break;
        }
      }

      if (title && releaseYear !== null && !isNaN(releaseYear) && format && actors.length > 0) {
        movies.push({ title, year: releaseYear as number, format, actors });
      }
    }

    return movies;
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const text = await file.text();
      const parsedMovies = parseMoviesFile(text);

      let successCount = 0;
      let failCount = 0;

      for (const movie of parsedMovies) {
        try {
          const addedMovie = await addMovie(movie);
          dispatch(addMovieToList(addedMovie));
          successCount++;
        } catch (err) {
          console.error("Failed to add movie:", movie.title, err);
          failCount++;
        }
      }

      setMessage(`✅ Imported: ${successCount}, ❌ Failed: ${failCount}`);
    } catch (err) {
      console.error("Error reading file:", err);
      setMessage("Error reading file.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={styles.div}>
      <input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      <Button onClick={handleImportClick} disabled={isLoading}>
        📥
      </Button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default MoviesImport;
