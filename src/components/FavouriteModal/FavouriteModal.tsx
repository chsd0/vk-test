import type { favouriteModalProps } from './types';
import type { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const FavouriteModal: FC<favouriteModalProps> = ({open, handleClose, handleAgree, isFilled}) => {
    return (
        <Dialog
            aria-hidden='false'
            disableScrollLock
            open={open}
            onClose={handleClose}
            sx={{
                '& .MuiPaper-root': {
                    backgroundColor: '#1e1e1e',
                    color: '#ffffff',
                },
                '& .MuiDialogContentText-root': {
                    color: '#ffffff',
                },
                '& .MuiDialogContent-root': {
                    padding: '15px 24px 15px 24px !important',
                },
                '& .MuiDialogActions-root': {
                    padding: '0 24px 10px 24px',
                },
                '& .MuiDialogTitle-root': {
                    fontWeight: '700',
                    padding: '20px 24px 0px 24px'
                }
            }}
        >
            <DialogTitle>
                {isFilled ?
                    'Убрать из избранного' 
                    :
                    'Добавить в избранное'
                }
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {isFilled ?
                        'Вы точно хотите убрать фильм из избарнного?'
                        :
                        'Вы точно хотите добавить фильм в избарнное?'
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>
                Отмена
            </Button>
            <Button onClick={handleAgree} autoFocus>
                {isFilled ?
                    'Убрать'
                    :
                    'Добавить'
                }
            </Button>
            </DialogActions>
        </Dialog>
    )
};

export default FavouriteModal;