import CrossedBookmarkIcon from '@assets/bookmarkCrossed.svg?react';
import { Link } from 'react-router';
import styles from './EmptyFavourite.module.scss';


const EmptyFavourite = () => {
    return (
        <section className={styles['empty__wrapper']}>
            <CrossedBookmarkIcon className={styles['empty__icon']} />
            <span className={styles['empty__text']}>Cейчас в избранном пусто</span>
            <Link to='/' className={styles['empty__link']}>Перейти на главную</Link>
        </section>
    )
};

export default EmptyFavourite;