import type { Actor } from "./Actor";

export interface Movie {
    id: number;
    title: string;
    year: number;
    format: "DVD" | "Blu-ray" | "Digital" | "VHS";
    actors: Actor[];
}