export interface movieCard {
    id: number,
    title: string,
    releaseDate: string,
    rating: number,
    imdbRating?: number,
    imgUrl: string,
    description: string,
    genres: string[]
}

export interface movieCardProps {
    movieCard: movieCard
}
