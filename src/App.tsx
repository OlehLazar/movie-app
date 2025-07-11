import styles from './App.module.scss';
import MoviesList from './components/MoviesList/MoviesList';
import { Provider } from 'react-redux';
import { store } from './app/reduxStore';
import { AddMovieForm } from './components/AddMovieForm/AddMovieForm';
import MoviesImport from './components/MoviesImport/MoviesImport';
import { useEffect, useState } from 'react';
import { registerUser } from './features/authService';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './app/reduxStore';
import type { GetMoviesParams } from './interfaces/GetMoviesParams';
import { MoviesFilter } from './components/MoviesFilter/MoviesFilter';

const InitAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      const existingToken = localStorage.getItem('jwtToken');
      if (!existingToken) {
        try {
          await registerUser(dispatch);
          console.log("✅ Auth initialized");
        } catch (err) {
          console.error("Auth error:", err);
        }
      }
    };

    init();
  }, [dispatch]);

  return null;
};

const App = () => {
  const [filters, setFilters] = useState<GetMoviesParams>({});

  return (
    <Provider store={store}>
      <InitAuth />
      <div className={styles.root}>
        <main>
          <div className={styles.div}>
            <AddMovieForm />
            <MoviesImport />
            <MoviesFilter onFilterChange={setFilters} />
          </div>
          <MoviesList filters={filters} />
        </main>
      </div>
    </Provider>
  );
};

export default App;
