import { useState, useEffect } from "react";
import Input from "../ui/Input/Input";
import styles from "./MoviesFilter.module.scss";
import { useDebounce } from "../../app/hooks";

interface FilterParams {
  title?: string;
  actor?: string;
}

interface MoviesFilterProps {
  onFilterChange: (filters: FilterParams) => void;
}

export const MoviesFilter = ({ onFilterChange }: MoviesFilterProps) => {
  const [title, setTitle] = useState('');
  const [actor, setActor] = useState('');

  const debouncedTitle = useDebounce(title, 500);
  const debouncedActor = useDebounce(actor, 500);

  useEffect(() => {
    const filters: FilterParams = {};
    if (debouncedTitle.trim().length >= 3) filters.title = debouncedTitle.trim();
    if (debouncedActor.trim().length >= 2) filters.actor = debouncedActor.trim();

    onFilterChange(filters);
  }, [debouncedTitle, debouncedActor, onFilterChange]);

  return (
    <form className={styles.filterContainer} onSubmit={(e) => e.preventDefault()}>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Movie title"
      />

      <Input
        type="text"
        value={actor}
        onChange={(e) => setActor(e.target.value)}
        placeholder="Actor name"
      />
    </form>
  );
};
