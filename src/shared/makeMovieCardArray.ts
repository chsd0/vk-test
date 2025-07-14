import type { movieCard } from "@components/MovieCard/types"

export interface dataValue {
    id: number,
    name: string,
    description: string,
    premiere: {world: string},
    rating: {kp: number, imdb: number},
    poster: {previewUrl: string},
    genres: {name: string}[]
}

export const makeMovieCardArray = (data: dataValue[]) => {
    return data.map((val: dataValue) => ({
        id: val.id,
        title: val.name,
        releaseDate: val.premiere.world,
        rating: Number(val.rating.kp.toFixed(1)),
        imdbRating: Number(val.rating.imdb.toFixed(1)),
        imgUrl: val.poster.previewUrl,
        description: val.description,
        genres: val.genres.map(genre => genre.name)
    } as movieCard))
}

export const makeMovieCard = (val: dataValue) => {
    return {
        id: val.id,
        title: val.name,
        releaseDate: val.premiere.world,
        rating: Number(val.rating.kp.toFixed(1)),
        imdbRating: Number(val.rating.imdb.toFixed(1)),
        imgUrl: val.poster.previewUrl,
        description: val.description,
        genres: val.genres.map(genre => genre.name)
    } as movieCard
}