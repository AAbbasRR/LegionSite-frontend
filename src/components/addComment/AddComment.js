import React, { useState } from 'react';

import classes from './styles/addcomment.module.scss';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Loading from "../loader/Loading";
import SnackBarMessage from '../snackbarMessage/SnackBarMessage';

import { SendComment } from '../../api/GameComments';
import CallApi from "../../functions/CallApi";


const AddComment = ({ isOpen, closeHandler }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [snackeMessageOpen, setSnackMessageOpen] = useState(false);
    let [formData, setFormData] = useState({
        name: "",
        opinion: "",
        rate: 2.5
    });

    const openSnackeMessageHandler = () => {
        setSnackMessageOpen(true);
    };

    const closeSnackeMessageHandler = () => {
        setSnackMessageOpen(false);
    };

    const formTextFieldChangeHandler = (event, inputName) => {
        let newData = { ...formData };
        if (inputName === 'rate') {
            newData[inputName] = Number(event.target.value);
        } else {
            newData[inputName] = event.target.value;
        }
        setFormData(newData);
    };

    const sendCommentHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            await CallApi(SendComment(formData.name, formData.opinion, formData.rate));
            openSnackeMessageHandler();
            closeHandler();
        } catch (error) {
            console.log(error);
        };
        setIsLoading(false);
    };

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const rtltheme = createTheme({
        direction: 'rtl', // Both here and <body dir="rtl">
    });
    // Create rtl cache
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });

    return (
        <>
            {isLoading && <Loading isLoading={true} />}
            <SnackBarMessage isOpen={snackeMessageOpen} closeHandler={closeSnackeMessageHandler} message="?????????? ???? ?????? ???????? ???? ???????????? ?????????? ????" />
            <Dialog
                fullScreen={fullScreen}
                open={isOpen}
                onClose={closeHandler}
            >
                <DialogTitle className={classes.dialogTitle}>
                    {"?????? ?????? ???? ???? ???????? ???????? ?????????? ?????????? ????????"}
                </DialogTitle>
                <form autoComplete="off">
                    <DialogContent className={classes.dialogContent}>
                        <CacheProvider value={cacheRtl}>
                            <ThemeProvider theme={rtltheme}>
                                <div dir="rtl">
                                    <TextField onChange={(e) => formTextFieldChangeHandler(e, 'name')} className={classes.TextField} value={formData.name} label="?????? ?? ?????? ????????????????" fullWidth />
                                    <TextField onChange={(e) => formTextFieldChangeHandler(e, 'opinion')} className={classes.TextField} value={formData.opinion} multiline rows={3} label="??????" fullWidth />
                                    <div className={classes.ratingBox}>
                                        <span className={classes.ratingTitle}>???????? ??????: </span>
                                        <Rating onChange={(e) => formTextFieldChangeHandler(e, 'rate')} defaultValue={2.5} precision={0.5} />
                                    </div>
                                </div>
                            </ThemeProvider>
                        </CacheProvider>
                    </DialogContent>
                    <DialogActions className={classes.dialogActions}>
                        <Button disabled={isLoading} className={classes.dialogButton} onClick={closeHandler}>
                            ????????
                        </Button>
                        <Button disabled={isLoading} className={classes.dialogButton} onClick={sendCommentHandler}>
                            ??????
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddComment