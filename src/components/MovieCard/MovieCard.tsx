import { type FC, useState } from 'react';
import { FavouriteModal } from '@components';
import type { movieCardProps } from './types';
import { localStorageWork, checkIfIdInFavourite } from '@shared/localStorageWork';
import { useNavigate } from 'react-router';

import BookMarkIcon from '@assets/bookmark.svg?react';
import styles from './movieCard.module.scss';

export const MovieCard: FC<movieCardProps> = (props) => {
    const {id, title, releaseDate, rating, imgUrl} = {...props.movieCard};

    const bookMarkIconClass = 'card__favourite';
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
        localStorageWork(!isFilled, props);
        setTimeout(() => setFilled(!isFilled), 100); // без таймаута содеражние диалога меняется до его закрытия
    };

    const handleClose = () => {
        setOpen(false);
    };

    const navigate = useNavigate();
    const handleClick = () => {
        if(props.onClick){
            props.onClick();
        }
        navigate(`/movie/${id}`);
    }

    const ratingClass = styles['card__rating'] + ' ' +
                        (rating > 7 ? styles['good']
                        : Number(rating) > 5 ? styles['average']
                        : styles['bad'])

    return (
    <>
        <article className={styles['card']} onClick={handleClick}>
            <section className={styles['card__image-wrapper']}>
                <img className={styles['card__image']} 
                     src={imgUrl} 
                     loading='lazy'
                />
                <div className={ratingClass}>
                    {rating}
                </div>
            </section>
            <section className={styles['card__title-section']}>
                <h4 className={styles['card__title']}>{title}</h4>
                <BookMarkIcon className={iconClass} onClick={handleClickFavourite}/>
            </section>
            <span>{releaseDate.match(/\d+/)}</span>
        </article>
        <FavouriteModal 
            isFilled={isFilled} 
            open={open} 
            handleClose={handleClose} 
            handleAgree={handleAgree}
        />
    </>
    )
};

export default MovieCard;