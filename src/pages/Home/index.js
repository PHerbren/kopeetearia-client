import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import './styles.css';

const useStyles = makeStyles(theme => ({
    addButton: {        
        backgroundColor: '#f3b33d',
        color: '#31251F',
        font: 'inherit',
        fontWeight: 600,
        fontSize: '25px',
        width: '170px',
        height: '50px',        
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    }
}))

const Home = () => {    
    const classes = useStyles();

    return (
        <main className='home'>
            <header className='home__header d-flex justify-content-end align-items-center text-white'>
                <div className='overlay'></div>
                <div className='home__headercontent w-50 mb-5'>
                    <h1 className='home__title mb-4'>Coffee {'&'} Tea.</h1>
                    <p className='home__par mb-5'>
                        "Planning some time alone? 
                        Then grab your favorite book, order your favorite 
                        coffee from us and look forward to a me-time like no other."
                    </p>
                    <div className='home__buttons d-flex'>
                        <MuiButton
                                onClick = {(e) => window.location.href='/menu'}
                                variant = 'outlined'
                                className = {classes.addButton}>
                            Our Menu
                        </MuiButton> 
                    </div>
                </div>
            </header>
        </main>
    );
};

export default Home;
