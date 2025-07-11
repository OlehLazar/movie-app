import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Movie } from "../interfaces/Movie";

interface MoviesState {
  movies: Movie[];
}

const initialState: MoviesState = {
  movies: [],
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
    addMovieToList: (state, action: PayloadAction<Movie>) => {
      state.movies.push(action.payload);
    },
    removeMovieFromList: (state, action: PayloadAction<number>) => {
      state.movies = state.movies.filter((movie) => movie.id !== action.payload);
    },
  },
});

export const { setMovies, addMovieToList, removeMovieFromList } = moviesSlice.actions;
export default moviesSlice.reducer;
