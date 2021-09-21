import { ENDPOINTS, endpointURL } from '../api';
import axios from 'axios';

export function UserLogout(){
    let cookieName = "token";

    localStorage.clear();
    document.cookie = cookieName + "=; expires=Thu, 18 Dec 1970 12:00:00 UTC";
    window.location.href = '/login';
}    

export const DisconnectionLogout = () =>{
    const checkOnlineStatus = async () => {
        try {
            const online = await axios.get(endpointURL(ENDPOINTS.PING));
            return online.status >= 200 && online.status < 300;
        } catch (err) {
            alert("Connection to API lost"); 
            UserLogout();
            throw new Error("Connection Lost");                      
        }
    };

    checkOnlineStatus();
    
    setInterval(async () => {
        const result = await checkOnlineStatus();
      }, 60000);

}

