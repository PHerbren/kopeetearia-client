import React, { useState } from 'react';
import { ENDPOINTS, endpointURL } from '../../api';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import { parsedJwtReturn } from '../cookieReader';
import './styles.css';
import { DisconnectionLogout, UserLogout } from '../Logout';

const useStyles = makeStyles(theme => ({
    addButton: {        
        backgroundColor: '#f3b33d',
        color: '#31251F',
        font: 'inherit',
        fontWeight: 600,
        width: '40px',
        height: '30px',        
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    }
}))

const Login = () => {
    const classes = useStyles();

    const [usernameIO, setUsername] = useState("");
    const [passwordIO, setPassword] = useState("");

    async function userAuthenticate(){            
            localStorage.getItem('token');
            DisconnectionLogout();

            let userCreds = {username: usernameIO, password: passwordIO};

            let result = await fetch(endpointURL(ENDPOINTS.AUTHENTICATE),{
                method:'POST',
                headers:{
                    "Content-Type": "application/json",
                    "Accept": 'application/json',
                },
                body:JSON.stringify(userCreds)
            });

            result = await result.json();
            try {
                var jwtToken = result.body.jwt;
            } catch (error) {
                alert("User was not authenticated properly.");
                UserLogout();
                throw new Error("Endpoint for authentication is unreachable");
            }
            

            localStorage.setItem('token', jwtToken);

            document.cookie = "token=" + localStorage.getItem('token') + ";";            
            
            if (localStorage.getItem('token') === "undefined"){
                alert("Incorrect Credentials");
                window.location.href = '/login';   
            }
            else{
                switch(parsedJwtReturn().roles){
                    case "[ROLE_ADMIN]":
                        window.location.href = '/admin';
                        break;
                    default:
                        window.location.href = '/menu';
                        break;
                }                
            }            
            
    }

    return(
        <>
            <main className='Login'>                
                <div maxwidth='md' className='overlay' align='center'>
                    <section className='Login-body' align='center'>
                        <div  className='Login-title' align='center'>Kopeetearia Sign-In</div>                        
                        <br/>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder='Username'/>
                        <br/><br/>
                        <input onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Password'/>
                        <br/><br/>
                        <MuiButton
                            onClick = {(e) => userAuthenticate()}
                            variant = 'outlined'
                            className = {classes.addButton}>
                                Login
                        </MuiButton>  
                        <br/>                                                                            
                    </section>
                </div>
            </main>
        </>
    )
    
}

export default Login;