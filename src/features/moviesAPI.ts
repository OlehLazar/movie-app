import type { GetMoviesParams } from "../interfaces/GetMoviesParams";
import type { Movie } from "../interfaces/Movie";
import { store } from "../app/reduxStore";

declare global {
  interface Window {
    env: {
      API_URL: string;
    };
  }
}

const API_URL = window.env.API_URL;


const getAuthHeaders = () => {
  const token = store.getState().auth.token;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `${token}` }),
  };
};

interface GetMoviesResponse {
  status: number;
  data: Movie[];
  meta: {
    total: number;
  };
  error?: { code: string };
}

export const getMovies = async (
  params: GetMoviesParams
): Promise<[Movie[], number]> => {
  const queryParams = new URLSearchParams();

  if (params) {
    if (params.actor) queryParams.append('actor', params.actor);
    if (params.title) queryParams.append('title', params.title);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));
  }

  const url = `${API_URL}/movies?${queryParams.toString()}`;
  const response = await fetch(url, { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error(`Error fetching movies: ${response.statusText}`);
  }

  const result: GetMoviesResponse = await response.json();

  if (result.status !== 1 || !Array.isArray(result.data)) {
    console.error("❌ API returned error or invalid format:", result);
    throw new Error(result?.error?.code || 'Invalid response from API');
  }

  return [result.data, result.meta.total];
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await fetch(`${API_URL}/movies/${id}`, { headers: getAuthHeaders() });

  if (!response.ok) {
    throw new Error(`Error fetching movie with ID ${id}: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.status !== 1 || !result.data) {
    console.error("❌ API returned error for single movie:", result);
    throw new Error(result?.error?.code || 'Movie not found');
  }

  return result.data;
};

export const addMovie = async (movie: {
  title: string;
  year: number;
  format: string;
  actors: string[];
}) => {
  const response = await fetch(`${API_URL}/movies`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(movie),
  });

  const result = await response.json();

  if (result.status !== 1) {
    console.error("Error adding movie:", result);
    throw new Error(result?.error?.code || "Unknown API error");
  }

  return result.data;
};


export const deleteMovie = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/movies/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error deleting movie with ID ${id}: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.status !== 1) {
    throw new Error(result?.error?.code || 'Failed to delete movie');
  }
};
