import type { movieCard, movieCardProps } from "@components/MovieCard/types";

export const localStorageWork = (add: boolean, props: movieCardProps) => {
    let currentFav = localStorage.getItem('favouriteIds');
    currentFav ??= '[]';

    const localStorageObj = JSON.stringify(props.movieCard);
    const currentFavouriteArr = JSON.parse(currentFav);

    if(add) {
        const newArr = currentFav ? 
            JSON.stringify(currentFavouriteArr.concat([props.movieCard])) 
            : 
            [];

        localStorage.setItem('favouriteIds',  currentFav ? `${newArr}` : `[${localStorageObj}]`);
        return;
    }

    localStorage.setItem('favouriteIds', JSON.stringify(currentFavouriteArr.filter((obj: movieCard) => JSON.stringify(obj) !== localStorageObj)));
}

export const getFavouriteIds = () => {
    return (localStorage.getItem('favouriteIds') ?? '').match(/(?<="id":)\d+/gm);
}

export const checkIfIdInFavourite = (id: number) => {
    return (getFavouriteIds() ?? []).some(favId => favId === id.toString());
}

export const getFavouriteFimls = () => {
    return JSON.parse(localStorage.getItem('favouriteIds') ?? '[]') as movieCard[];
}