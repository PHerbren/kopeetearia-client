import React, { useState } from 'react'
import { makeStyles, InputAdornment,  Button as MuiButton } from '@material-ui/core';
import ListAlt from '@material-ui/icons/ListAlt'
import { Input } from "../../controls";
import Form from  "../../layouts/Form";
import { createAPIEndpoint, ENDPOINTS } from '../../api';

const useStyles = makeStyles(theme => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#f3b33d',
            fontWeight: 'bolder',
            fontSize: '1.5em'
        }
    },

    addButtonGroup: {
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

const AddMenu = () => { 
    const classes = useStyles();
    const [values, setValues] = useState({
        menuName: null,
        price: null,
    })

    const [errors, setErrors] = useState({});

    function addName(e) {
        setValues({...values, menuName: e.target.value});
    }

    function addPrice(e) {
        setValues({...values, price: e.target.value});
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        if (validateForm()) {
            createAPIEndpoint(ENDPOINTS.ADDMENU).create(values)
            .then(() =>{
                refreshPage()
            })
            .catch(err => {
                alert("Menu already exists!")
            })
        }
    }

     function refreshPage() {
         
         window.location.reload(false);
     };

    const validateForm = () => {
        let temp = {};
        temp.menuName = values.menuName.length !== 0 ? "" : "This field is required.";
        temp.price = values.price.length !== 0 ? "" : "This field is required.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    return (
        <Form onSubmit = {handleSubmit}>
            <Input
                variant = 'outlined'
                type = "text"
                label = "Menu Name"
                name = "menuName" 
                value = {values.menuName}
                onChange = {addName}
                error = {errors.menuName}
                InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ListAlt />
                      </InputAdornment>
                    ),
                  }}
            />
            <Input
                variant = 'outlined'
                type = "number"
                label = "Price"
                name = "price"
                value = {values.price}
                onChange = {addPrice}
                error = {errors.price}
                InputProps = {{
                    startAdornment : <InputAdornment
                    className={classes.adornmentText}
                    position = "start">$</InputAdornment>
                }}
            />
            <MuiButton className = {classes.addButtonGroup}
                type = "submit"
                size = "large"
                >Submit</MuiButton>
        </Form>
    )
}

export default AddMenu;