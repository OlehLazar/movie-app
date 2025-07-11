export interface GetMoviesParams {
    actor?: string;
    title?: string;
    search?: string;
    sort?: 'id' | 'title' | 'year';
    order?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
}