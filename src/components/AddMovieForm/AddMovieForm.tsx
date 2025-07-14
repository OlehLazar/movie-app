import { useState } from "react";
import { addMovie } from "../../features/moviesAPI";
import { useAppDispatch } from "../../app/hooks";
import { addMovieToList } from "../../features/moviesSlice";
import { Button } from "../ui/Button/Button";
import Input from "../ui/Input/Input";
import styles from "./AddMovieForm.module.scss";
import { formats } from "../../constants/formats";

export const AddMovieForm = () => {
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [format, setFormat] = useState<typeof formats[number]>("DVD");
  const [actors, setActors] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddActorField = () => {
    setActors([...actors, ""]);
  };

  const handleRemoveActorField = (index: number) => {
    if (actors.length > 1 && index !== 0) {
      const updatedActors = [...actors];
      updatedActors.splice(index, 1);
      setActors(updatedActors);
    }
  };

  const handleActorChange = (index: number, value: string) => {
    const updatedActors = [...actors];
    updatedActors[index] = value;
    setActors(updatedActors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setMessage("Title cannot be empty or contain only spaces.");
      return;
    }
    
    const validActors = actors.filter(actor => actor.trim() !== "");
    if (validActors.length === 0) {
      setMessage("Please provide at least one actor.");
      return;
    }
    
    if (!year || !format) {
      setMessage("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const newMovie = await addMovie({
        title: title.trim(),
        year: Number(year),
        format,
        actors: validActors,
      });
      dispatch(addMovieToList(newMovie));
      setMessage("Movie added successfully!");
      setTitle("");
      setYear("");
      setFormat("DVD");
      setActors([""]);
      setShowForm(false);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : String(err);

      if (errMessage === "MOVIE_EXISTS") {
        setMessage("Movie with such title already exists");
        return;
      } else if (errMessage === "FORMAT_ERROR") {
        setMessage("Year must be between 1900 and 2021.");
        return;
      }

      setMessage("Unknown API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setShowForm(true)}>
        Add Movie
      </Button>

      {showForm && (
        <>
          <div className={styles.overlay} onClick={() => setShowForm(false)} />

          <div className={`${styles.sidebar} ${showForm ? styles.open : ""}`}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h1>Fill in the fields</h1>
              <div>
                <label>Title:</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Inception"
                />
              </div>

              <div>
                <label>Year:</label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  placeholder="e.g., 2023"
                />
              </div>

              <div className={styles.format}>
                <label>Format:</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as typeof formats[number])}
                >
                  {formats.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div className={styles.actors}>
                <label>Actors:</label>
                {actors.map((actor, idx) => (
                  <div key={idx} className={styles.actorInput}>
                    <Input
                      type="text"
                      value={actor}
                      onChange={(e) => handleActorChange(idx, e.target.value)}
                      placeholder={`Actor ${idx + 1}`}
                    />
                    {actors.length > 1 && idx !== 0 && ( // Не показуємо кнопку видалення для першого філду
                      <Button 
                        type="button" 
                        onClick={() => handleRemoveActorField(idx)}
                        className={styles.removeActor}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button 
                  onClick={handleAddActorField} 
                  type="button"
                >
                  + Add Actor
                </Button>
              </div>

              {message && <p className={styles.message}>{message}</p>}

              <div className={styles.formActions}>
                <Button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Submit"}
                </Button>

                <Button 
                  onClick={() => setShowForm(false)} 
                  type="button"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};