import React from 'react';
import OrderForm from './components/OrderForm';
import { useForm } from '../../hooks/useForm';
import { Grid, Container } from '@material-ui/core';
import MenuItems from './components/MenuItems';
import OrderedFoodItems from './components/OrderedFoodItems';
import './styles.css';
import { getCookie, parsedJwtReturn } from '../cookieReader';

const generateOrderNumber = () =>
    Math.floor(100000 + Math.random() * 90000).toString();

const getFreshModelObject = () => ({
    orderNumber: generateOrderNumber(),
    clerkId: 0,
    regularTotal: 0,
    discountedTotal: 0,
    deletedOrderItemIds: '',
    orderDetails: [],
});

export default function Order() {    

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetFormControls,
    } = useForm(getFreshModelObject);

    if(getCookie("token") === "" || getCookie("token") === "undefined"){
        alert("Please Sign-in to see Menu and Order");
        window.location.href = '/login';     
    }else{
        return (
        <>
            <Container maxWidth='md' className='Menu-body'>
                <h1>Order</h1>
                <hr />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <MenuItems 
                            {...{ 
                                values,
                                setValues,
                            }} />
                    </Grid>
                   
                    <Grid item xs={6}>
                        <OrderForm 
                            {...{ 
                                values,
                                setValues,
                                errors, 
                                setErrors,
                                handleInputChange,
                                resetFormControls
                                }} />
                   
                        <OrderedFoodItems
                            {...{ 
                                values,
                                setValues
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </>
    );
    }
}
