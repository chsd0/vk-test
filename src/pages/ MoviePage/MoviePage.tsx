import { useState } from 'react';
import { Header, FavouriteModal } from '@components';
import { localStorageWork, checkIfIdInFavourite } from '@shared/localStorageWork';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import { moviesStore } from '@store/MoviesStore';
import BookMarkIcon from '@assets/bookmark.svg?react';
import styles from './MoviePage.module.scss';
import CircularProgress from '@mui/material/CircularProgress';

const MoviePage = observer(() => {
    const id = Number(useParams<{id: string}>().id);
    const movie = moviesStore.movies.find(movie => movie.id === id);
    if(!movie) {
        moviesStore.fetchMovieById(id);
    }

    const {title, releaseDate, rating, imgUrl, description, genres, imdbRating} = {...movie};
    const bookMarkIconClass = 'add-to-favourites__icon';
    const [isFilled, setFilled] = useState(checkIfIdInFavourite(id));
    const isFavouriteClass = isFilled ? 'filled' : '';
    const iconClass = styles[bookMarkIconClass] + (isFilled ? ' ' + styles[isFavouriteClass] : '');

    const [open, setOpen] = useState(false);

    const handleClickFavourite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(true)
    };

    const handleAgree = () => {
        setOpen(false);
        localStorageWork(!isFilled, {movieCard: {...movie!}});
        setTimeout(() => setFilled(!isFilled), 100); // без таймаута содеражние диалога меняется до его закрытия
    };

    const handleClose = () => {
        setOpen(false);
    };

    let ratingClass, imdbRatingClass;
    if(rating && imdbRating){
        ratingClass = styles['rating__value'] + ' ' +
                            (rating > 7 ? styles['good']
                            : Number(rating) > 5 ? styles['average']
                            : styles['bad']);

        imdbRatingClass = styles['rating__value'] + ' ' +
                            (imdbRating > 7 ? styles['good']
                            : Number(imdbRating) > 5 ? styles['average']
                            : styles['bad']);
    }

    let release; 
    if(releaseDate) {
        release = new Date(releaseDate);
    }

    return (
    <>
        <Header />
        {moviesStore.loadingSingle ?
            <div className={styles['spinner-wrapper']}>
                <CircularProgress />
                <span>Загрузка...</span>
            </div>
        :
        <div className={styles['movie']}>
            <section className={styles['movie__poster-section']}>
                <img src={imgUrl} className={styles['movie__poster']}/> 
                <button className={styles['add-to-favourites']} onClick={handleClickFavourite}>
                    <span className={styles['add-to-favourites__text']}>
                        {isFilled ? 
                            'Убрать из избранного'
                            :
                            'Добавить в избранное'
                        }
                    </span>
                    <BookMarkIcon className={iconClass} />
                </button>
            </section>
            <section className={styles['movie__information-section']}>
                <div className={styles['movie__name-and-description']}>
                    <h1 className={styles['movie__name']}>{title}</h1>
                    <p className={styles['movie__description']}>{description}</p>
                    <div className={styles['movie__description-wrapper']}>
                        <p className={styles['movie__description-title']}>О фильме</p>
                        <div className={styles['description__additional']}>
                            <div className={styles['description__col']}>
                                <span className={styles['description__additional-text']}>
                                    {'Жанр' + (genres ? (genres.length > 1 ? 'ы' : '') : '')}
                                </span>
                                <span className={styles['description__additional-text']}>
                                    Дата выхода
                                </span>
                            </div>
                            <div className={styles['description__col']}>
                                <span className={styles['description__additional-text']}>
                                    {genres?.map((val: string) => val[0].toUpperCase() + val.slice(1, val.length)).join(', ')}
                                </span>
                                <span className={styles['description__additional-text']}>
                                    {release ? 
                                        release.toLocaleDateString('ru-RU', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                                }) 
                                                            : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['movie__rating']}>
                    <div className={styles['rating__kinopoisk']}>
                        <span className={styles['rating__name']}>Кинопоиск</span>
                        <span className={ratingClass}>{rating}</span>
                    </div>
                    <div className={styles['rating__kinopoisk']}>
                        <span className={styles['rating__name']}>IMDB</span>
                        <span className={imdbRatingClass}>{imdbRating}</span>
                    </div>
                </div>
            </section>
        </div>
        }
        <FavouriteModal 
            isFilled={isFilled} 
            open={open} 
            handleClose={handleClose} 
            handleAgree={handleAgree}
        />
    </>
    )
});

export default MoviePage;