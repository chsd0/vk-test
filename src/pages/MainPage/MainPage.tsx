import { MovieCard, Header, Filters, EmptyFavourite } from '@components';
import CircularProgress from '@mui/material/CircularProgress';
import type { movieCard } from '@components/MovieCard/types';
import { useEffect, useRef, useCallback, useMemo } from 'react';
import { getFavouriteFimls } from '@shared/localStorageWork';
import { useLocation, useNavigationType, useSearchParams } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { moviesStore } from "@store/MoviesStore";
import styles from './MainPage.module.scss';

export const MainPage = observer(() => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const atFavourite = location.pathname === '/favourite';
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const navigationType = useNavigationType();

    const currentFilters = useMemo(() => ({
        genres: searchParams.get('genres') ?? undefined,
        year: searchParams.get('year') ?? undefined,
        rating: searchParams.get('rating') ?? undefined
    }), [searchParams]);

    useEffect(() => {
        if (atFavourite) {
            return;
        }

        if(navigationType !== 'POP') {
            moviesStore.fetchMovies(1, currentFilters).then(() => {
                setTimeout(() => {
                    moviesStore.restoreScrollPosition(currentFilters);
                }, 0);
            });
        }

        return () => {
            moviesStore.saveScrollPosition(currentFilters);
        };
    //eslint-disable-next-line
    }, [atFavourite, currentFilters]);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && moviesStore.hasMore && !moviesStore.loading) {
            moviesStore.loadNextPage();
        }
    }, []);

    useEffect(() => {
        if (!atFavourite && loaderRef.current) {
            const option = { root: null, rootMargin: "1000px", threshold: 0 };
            const observer = new window.IntersectionObserver(handleObserver, option);
            observer.observe(loaderRef.current);
            return () => observer.disconnect();
        }
    }, [handleObserver, atFavourite]);

    return (
        <>
        <Header />
        <Filters atFavourite={atFavourite}/>
        {!atFavourite ?
            <div className={styles['wrapper']}>
                {moviesStore.movies.map((val: movieCard) => (
                    <MovieCard 
                        key={val.id} 
                        movieCard={val}
                        onClick={() => {
                            moviesStore.saveScrollPosition(currentFilters);
                        }}
                    />
                ))}
                {moviesStore.loading && 
                    <div className={styles['spinner-wrapper']}>
                        <CircularProgress />
                        <span>Загрузка...</span>
                    </div>
                }
                <div ref={loaderRef} />
                {!moviesStore.hasMore && <div>Больше фильмов нет</div>}
                {moviesStore.error && <div>Ошибка при загрузке фильмов. Возможно превышен лимит запросов API-ключа.</div>}
            </div>
            :
            <div className={styles['wrapper']}>
                {getFavouriteFimls().length ? 
                    getFavouriteFimls().map((val, idx) => (
                        <MovieCard key={idx} movieCard={val} />
                    ))
                    :
                    <EmptyFavourite />
                }
            </div>
        }
        </>
    )
});

export default MainPage;