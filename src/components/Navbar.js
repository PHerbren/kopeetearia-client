import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import './style.css';
import { getCookie, parsedJwtReturn } from '../pages/cookieReader';
import { DisconnectionLogout, UserLogout } from '../pages/Logout';
import { ORIGIN_URL } from '../api';

export const useStyles = makeStyles(theme => ({
    addButton: {        
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    }
}))

const Navbar = () => {
    const classes = useStyles();
    const location = useLocation();
    function setLoginUsername(){
        let cToken = getCookie("token");
    
        if (cToken === "" || cToken === "undefined"){
            if (window.location.href == (ORIGIN_URL + 'login')){
                return(
                    ""
                );
            }else{
                return (                                   
                    <MuiButton
                        onClick = {(e) => window.location.href='/login'}
                        variant = 'outlined'
                        className = {classes.addButton}>
                            Login
                    </MuiButton>                
                );   
            }         
        }else{
            DisconnectionLogout();
            
            let appender = "";
            switch(parsedJwtReturn().roles){
                case "[ROLE_ADMIN]":
                    appender = "[ADMIN]";
                    break;
                case "[ROLE_CASHIER]":
                    appender = "[CASHIER]";
                    break;
                default:
                    appender = "";
                    break;
            }
            return(
                <>
                    <div >
                        <h4 className='navbar-text'>{appender} {parsedJwtReturn().sub} &nbsp;&nbsp;</h4>
                        <MuiButton
                            onClick = {(e) => UserLogout()}
                            variant = 'outlined'
                            className = {classes.addButton}>
                                Logout
                        </MuiButton>
                        
                    </div>
                </>
                );
        }
    }

    return (
        <nav
            className='navbar fixed-top navbar-custom'
            style={location.pathname === '/' ? { background: 'none' } : {}}
        >
            <div className='container'>
                <Link
                    to=''
                    className='navbar-brand navbar-text icon'
                    href='/'
                    style={
                        location.pathname === '/' ? { color: '#fff' } : {}
                    }
                >
                    Kopeetearia
                </Link>
                {setLoginUsername()}
            </div>
        </nav>
    );
};

export default Navbar;
