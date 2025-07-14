import { type SyntheticEvent, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styles from './Header.module.scss';

export const Header = () => {
    const navigate = useNavigate();
    
    const handleLogoClick = () => {
        navigate('/');
    }

    const location = useLocation();

    const tabToPath: {[key: number]: string} = { 1: '/', 2: '/favourite' };
    const pathToTab: Record<string, number> = { '/': 1, '/favourite': 2};

    const [value, changeValue] = useState(() => pathToTab[location.pathname] || null);

    useEffect(() => {
        if (value !== pathToTab[location.pathname]) {
            changeValue(pathToTab[location.pathname] || -1);
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    const onChange = (_e: SyntheticEvent, newValue: number) => {
        changeValue(newValue);
        navigate(tabToPath[newValue]);
    }

    return (
        <header className={styles['header']}>
            <h1 className={styles['header__logo']} onClick={handleLogoClick}>ПоисКино</h1>
            <Tabs 
                value={value}
                onChange={onChange} 
                className={styles['header__tabs']}
                sx={{
                    marginLeft: 'auto',
                    '& .MuiTab-root': {
                        color: 'grey.400',
                        fontWeight: '500',
                        transition: 'color 0.3s ease',

                        '&:hover': {
                            color: 'primary.main',
                        },

                        '&.Mui-selected': {
                            color: 'primary.main'
                        }
                    }
                }}
            >
                <Tab value={1} label='Все фильмы' />
                <Tab value={2} label='Избранное' />
            </Tabs>
        </header>
    )
};

export default Header;