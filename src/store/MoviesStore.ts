import { makeAutoObservable, runInAction } from "mobx";
import { makeMovieCardArray, makeMovieCard } from "@shared/makeMovieCardArray";
import type { movieCard } from "@components/MovieCard/types";

class MoviesStore {
    movies: movieCard[] = [];
    loading = false;
    loadingSingle = false;
    error: string | null = null;
    page = 1;
    hasMore = true;
    magicString = import.meta.env.VITE_MAGIC_STRING;
    currentFilters: { genres?: string, year?: string, rating?: string } = {};

    constructor() {
        makeAutoObservable(this);
    }

    async fetchMovies(page = 1, filters?: { genres?: string, year?: string, rating?: string }) {
        if (this.loading || (!this.hasMore && page !== 1)) {
            return;
        }

        if (page === 1) {
            this.movies = [];
            this.hasMore = true;
            this.error = null;
            this.loading = true;
            if (filters) {
                this.currentFilters = filters;
            }

        } else {
            this.loading = true;
        }

        let url = `https://api.kinopoisk.dev/v1.4/movie?page=${page}&limit=50&selectFields=id&selectFields=name&selectFields=rating&selectFields=genres&selectFields=premiere&selectFields=description&selectFields=poster&notNullFields=name&notNullFields=description&notNullFields=premiere.world&notNullFields=genres.name&notNullFields=rating.kp&sortField=votes.kp&sortType=-1`;

        if (filters?.genres) {
            filters.genres.split(',').forEach(genre =>
                url += `&genres.name=${genre}`
            );
        }
        if (filters?.year) url += `&year=${filters.year}`;
        if (filters?.rating) url += `&rating.kp=${filters.rating}`;

        this.loading = true;
        this.error = null;
        try {
            const res = await fetch(url, {
                headers: {
                    'Content-type': 'application/json',
                    'X-API-KEY': this.magicString,
                }
            });
            const data = await res.json();
            runInAction(() => {
                if (page === 1) {
                    this.movies = makeMovieCardArray(data.docs);
                } else {
                    this.movies = [...this.movies, ...makeMovieCardArray(data.docs)];
                }
                this.page = page;
                this.hasMore = data.docs.length > 0;
                this.loading = false;
            });
        //eslint-disable-next-line
        } catch (e) {
            runInAction(() => {
                this.error = "Ошибка загрузки";
                this.loading = false;
            });
        }
    }

    async fetchMovieById(id: number) {
        //eslint-disable-next-line
        if(!!this.movies.find((val) => val.id === id)) {
            return;
        }
        this.loadingSingle = true;
        this.error = null;
        try {
            const res = await fetch(`https://api.kinopoisk.dev/v1.4/movie/${id}`, {
                headers: {
                    'Content-type': 'application/json',
                    'X-API-KEY': this.magicString,
                }
            });
            const data = await res.json();
            runInAction(() => {
                this.movies = [...this.movies, makeMovieCard(data)];
                this.loadingSingle = false;
            });
        //eslint-disable-next-line
        } catch (e) {
            runInAction(() => {
                this.error = "Ошибка загрузки";
                this.loadingSingle = false;
            });
        }
    }

    loadNextPage() {
        this.fetchMovies(this.page + 1, this.currentFilters);
    }

    private scrollPositions = new Map<string, number>();
    
    saveScrollPosition(filters: { genres?: string, year?: string, rating?: string }) {
        const key = this.getFiltersKey(filters);
        this.scrollPositions.set(key, window.scrollY);
    }
    
    restoreScrollPosition(filters: { genres?: string, year?: string, rating?: string }) {
        const key = this.getFiltersKey(filters);
        const position = this.scrollPositions.get(key) || 0;
        window.scrollTo(0, position);
    }
    
    private getFiltersKey(filters: { genres?: string, year?: string, rating?: string }): string {
        return JSON.stringify(filters);
    }
}

export const moviesStore = new MoviesStore();