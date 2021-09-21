import axios from "axios";
import { getCookie } from "../pages/cookieReader";
import { DisconnectionLogout, NoAPIConnection } from "../pages/Logout";

export const BASE_URL = 'https://v955rrksn4.execute-api.ap-southeast-1.amazonaws.com/default/';

export const ORIGIN_URL = 'http://localhost:3000'; 

export const ENDPOINTS = {
    ADDMENU: 'kopeetearia_addMenu',   
    MENUITEM: 'kopeetearia_getAllMenu',
    SINGLEMENUITEM: 'kopeetearia_getMenuById',
    ORDER: 'kopeetearia_getAllOrders',
    SUBMIT: 'kopeetearia_submitOrder',
    UPDATE: 'kopeetearia_updateOrder',
    DELETE: 'kopeetearia_deleteOrder',
    ADDORDER: 'kopeetearia_addOrder',
    AUTHENTICATE: 'kopeetearia_authenticate',
    TRANSACTION: 'kopeetearia_getAllTransaction',
    UPDATEMENU: 'kopeetearia_updateMenu',
    DELETEMENU: 'kopeetearia_deleteMenu',
    PING: 'kopeetearia_pingCon'
}

export const endpointURL = endpoint => {
    return BASE_URL + endpoint;
}

export const createAPIEndpoint = endpoint => { 
    let url = BASE_URL + endpoint;
    let axiosHeaders = {headers: {
                            'Authorization': 'Bearer ' + getCookie("token")
                            }
                        };
                        
    return {
        fetchAll: () => axios.get(url, axiosHeaders),
        fetchById: (id, singleMenuItem) => axios.post(url, singleMenuItem, axiosHeaders),
        create: newItem => axios.post(url, newItem, axiosHeaders),
        update: (id, updateItem) => axios.post(url, updateItem, axiosHeaders),
        delete: (id, deleteItem) => axios.post(url, deleteItem, axiosHeaders),
    }
}