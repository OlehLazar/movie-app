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

  const handleActorChange = (index: number, value: string) => {
    const updatedActors = [...actors];
    updatedActors[index] = value;
    setActors(updatedActors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !year || !format || actors.length === 0 || actors.some(a => a.trim() === "")) {
      setMessage("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const newMovie = await addMovie({
        title,
        year: Number(year),
        format,
        actors,
      });
      dispatch(addMovieToList(newMovie));
      window.location.reload();
      setMessage("Movie added successfully!");
      setTitle("");
      setYear("");
      setFormat("DVD");
      setActors([""]);
      setShowForm(false);
    } catch (err) {
      console.error("Error adding movie:", err);
      setMessage("Failed to add movie.");
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
                  <Input
                    key={idx}
                    type="text"
                    value={actor}
                    onChange={(e) => handleActorChange(idx, e.target.value)}
                    placeholder={`Actor ${idx + 1}`}
                  />
                ))}
                <Button onClick={handleAddActorField} >
                  + Add Actor
                </Button>
              </div>

              {message && <p>{message}</p>}

              <div>
                <Button
                  onClick={() => {
                    const form = document.querySelector('form');
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                  }}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Submit"}
                </Button>

                <Button onClick={() => setShowForm(false)} >
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