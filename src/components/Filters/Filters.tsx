import { useState, useEffect, type FC, type MouseEvent } from 'react';
import { genresOriginal, genres } from '@shared/constants';
import { useSearchParams } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Slider from '@mui/material/Slider';
import FiltersIcon from '@assets/filter.svg?react';
import styles from './Filters.module.scss';
import { Button } from '@mui/material';

export const Filters: FC<{atFavourite: boolean}> = ({atFavourite}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [selectedGenresIdxs, setSelectedIdxs] = useState<number[]>([]);
    const [yearValue, setYearValue] = useState<number[]>([1990, 2025]);
    const [ratingValue, setRatingValue] = useState<number[]>([0, 10]);
    const [filtersApplied, setFiltersApplied] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const [localSelectedGenresIdxs, setLocalSelectedIdxs] = useState<number[]>([]);
    const [localYearValue, setLocalYearValue] = useState<number[]>([1990, 2025]);
    const [localRatingValue, setLocalRatingValue] = useState<number[]>([0, 10]);

    useEffect(() => {
        const genresFromUrl = searchParams.get('genres');
        if (genresFromUrl) {
            const idxs = genresFromUrl
                .split(',')
                .map(val => genres.findIndex(genre => genre === val))
                .filter(idx => idx !== -1);
            setSelectedIdxs(idxs);
        } else {
            setSelectedIdxs([]);
        }

        const yearFromUrl = searchParams.get('year');
        if (yearFromUrl) {
            const [min, max] = yearFromUrl.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)){ 
                setYearValue([min, max]);
            }
        } else {
            setYearValue([1990, 2025]);
        }

        const ratingFromUrl = searchParams.get('rating');
        if (ratingFromUrl) {
            const [min, max] = ratingFromUrl.split('-').map(Number);
            if (!isNaN(min) && !isNaN(max)) {
                setRatingValue([min, max]);
            }
        } else {
            setRatingValue([0, 10]);
        }

        setFiltersApplied(
            !!(genresFromUrl || yearFromUrl || ratingFromUrl)
        );
    }, [searchParams]);

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);

        setLocalSelectedIdxs(selectedGenresIdxs);
        setLocalYearValue(yearValue);
        setLocalRatingValue(ratingValue);
    };

    const handleClose = () => {
        setAnchorEl(null);

        setSearchParams(prev => {
            const params = new URLSearchParams(prev);

            if (localSelectedGenresIdxs.length) {
                params.set('genres', localSelectedGenresIdxs.map(val => genres[val]).join(','));
            } else {
                params.delete('genres');
            }
            if (localYearValue[0] !== 1990 || localYearValue[1] !== 2025) {
                params.set('year', localYearValue.join('-'));
            } else {
                params.delete('year');
            }
            if (localRatingValue[0] !== 0 || localRatingValue[1] !== 10) {
                params.set('rating', localRatingValue.join('-'));
            } else {
                params.delete('rating');
            }
            return params;
        });
    };

    const handleGenreClick = (genreIdx: number) => {
        setLocalSelectedIdxs(prev =>
            prev.includes(genreIdx)
                ? prev.filter(g => g !== genreIdx)
                : [...prev, genreIdx]
        );
    };
    const handleYearChange = (_e: Event, newValue: number[]) => {
        setLocalYearValue(newValue);
    };
    const handleRatingChange = (_e: Event, newValue: number[]) => {
        setLocalRatingValue(newValue);
    };

    return (
        <section className={styles['filters__wrapper']}>
            <h2 className={styles['filters__current-state']}>
                {atFavourite
                    ? 'Избранные фильмы'
                    : 'Все фильмы' + (filtersApplied ? ' (с фильтрами)' : '')
                }
            </h2>
            {!atFavourite ? (
                <div className={styles['filters__tab']} onClick={handleClick}>
                    <span className={styles['filters__title']}>Фильтры</span>
                    <FiltersIcon className={styles['filters__icon']} />
                </div>
            ) : null}
            <Menu
                aria-hidden="false"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                disableScrollLock
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: '#1d1d1d',
                        cursor: 'default',
                        color: '#fff',
                        padding: '0 10px'
                    }
                }}
            >
                <MenuItem disableRipple>
                    <div className={styles['filter__genres']}>
                        <h4 className={styles['genres__title']}>Жанры</h4>
                        <div className={styles['genres__list']}>
                            {genresOriginal.map((val, idx) => {
                                const includes = localSelectedGenresIdxs.includes(idx);
                                return (
                                    <Chip
                                        key={idx}
                                        label={val}
                                        variant={includes ? "filled" : "outlined"}
                                        color={includes ? "primary" : "default"}
                                        onClick={() => handleGenreClick(idx)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </MenuItem>
                <div className={styles['divider']} />
                <MenuItem disableRipple>
                    <div className={styles['filter__years']}>
                        <span className={styles['years__titles']}>
                            <h4 className={styles['years__title']}>Год выпуска</h4>
                            <h4 className={styles['years__value']}>{localYearValue[0] + '-' + localYearValue[1]}</h4>
                        </span>
                        <div className={styles['years__range']}>
                            <Slider
                                sx={{
                                    width: 250,
                                    '& .MuiSlider-valueLabel': {
                                        backgroundColor: '#555555',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        padding: '2px 4px',
                                        top: '-6px',
                                        '&:before': {
                                            display: 'none',
                                        },
                                    },
                                }}
                                value={localYearValue}
                                onChange={handleYearChange}
                                valueLabelDisplay="auto"
                                min={1990}
                                max={2025}
                                defaultValue={[1990, 2025]}
                            />
                        </div>
                    </div>
                </MenuItem>
                <div className={styles['divider']} />
                <MenuItem disableRipple>
                    <div className={styles['filter__rating']}>
                        <span className={styles['years__titles']}>
                            <h4 className={styles['years__title']}>Рейтинг</h4>
                            <h4 className={styles['years__value']}>{localRatingValue[0] + '-' + localRatingValue[1]}</h4>
                        </span>
                        <div className={styles['rating__range']}>
                            <Slider
                                sx={{
                                    width: 250,
                                    '& .MuiSlider-valueLabel': {
                                        backgroundColor: '#555555',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        padding: '2px 4px',
                                        top: '-6px',
                                        '&:before': {
                                            display: 'none',
                                        },
                                    },
                                }}
                                value={localRatingValue}
                                onChange={handleRatingChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={10}
                                step={0.1}
                            />
                        </div>
                    </div>
                </MenuItem>
                <MenuItem disableRipple>
                    <Button 
                        onClick={() => { 
                            setSearchParams(new URLSearchParams());
                            setLocalSelectedIdxs([]);
                            setLocalYearValue([1990, 2025]);
                            setLocalRatingValue([0, 10]);
                        }}
                        sx={{
                            '&.Mui-disabled': {
                                color: 'rgba(255, 255, 255, 0.25)'
                            }
                        }}
                        disabled={!filtersApplied}
                    >
                        Сбросить фильтры
                    </Button>
                </MenuItem>
            </Menu>
        </section>
    );
};

export default Filters;