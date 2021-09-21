import React, { useState, useEffect } from 'react';
import Form from '../../../layouts/Form';
import { Grid, InputAdornment, makeStyles, Button as MuiButton, ButtonGroup,} from '@material-ui/core';
import { Input, Button } from '../../../controls';
import ReplayIcon from '@material-ui/icons/Replay';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import ReorderIcon from '@material-ui/icons/Reorder';
import { createAPIEndpoint, ENDPOINTS } from '../../../api';
import { roundTo2DecimalPoint } from '../../../utils';
import { parsedJwtReturn } from '../../cookieReader';
import Popup from '../../../layouts/Popup';
import OrderList from "./OrderList";

const useStyles = makeStyles((theme) => ({
  adornmentText: {
    '& .MuiTypography-root': {
      color: '#f3b33d',
      fontWeight: 'bolder',
      fontSize: '1.5em',
    },
  },
  submitButtonGroup: {
    marginLeft: '50px',
    backgroundColor: '#f3b33d',
    color: '#000',
    margin: theme.spacing(1),
    '& .MuiButton-label': {
      textTransform: 'none',
    },
    '&:hover': {
      backgroundColor: '#f3b33d',
    },
  },
}));

export default function OrderForm(props) {
  const {
    values,
    setValues,
    setErrors,
    resetFormControls,
  } = props;
  const classes = useStyles();
  const [orderListVisibility, setOrderListVisibility] = useState(false);

useEffect(() => {
    let x = { ...values };
    let regularTotal = values.orderDetails.reduce((tempTotal, item) => {
      return tempTotal + item.quantity * item.orderItemPrice;
    }, 0);
 
    let discountedItems = values.orderDetails.filter( (x) => {
      return x.discounted === true
    });
 
    let nonDiscounted = values.orderDetails.filter( (x) => {
      return x.discounted === false
    });
   
    let nonDiscountedTotal = nonDiscounted.reduce((tempTotal, item) => {
      return tempTotal + (item.quantity * item.orderItemPrice);
    }, 0);
   
    let discountTotal = discountedItems.reduce((tempTotal, item) => {
      let totalItemsPrice = item.quantity * item.orderItemPrice;
      return tempTotal + (totalItemsPrice - (totalItemsPrice * .05));
    }, 0);
 
    let discountedAmount = nonDiscountedTotal + discountTotal;
 
    setValues({
      ...x,
      regularTotal: roundTo2DecimalPoint(regularTotal),
      discountedTotal: roundTo2DecimalPoint(discountedAmount) 
    });
  }, [JSON.stringify(values.orderDetails)]);

  const validateForm = () => {
    let temp = {};
    temp.orderDetails =
      values.orderDetails.length !== 0 ? "" : "This field is required.";
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === "");
  };

  const submitOrder = (e) => {
    e.preventDefault();
    let x = { ...values };
    let order = {
      username: parsedJwtReturn().sub,
      orderModel: x.orderDetails,
    };
    if (validateForm()) {
      createAPIEndpoint(ENDPOINTS.SUBMIT)
        .create(order)
        .then((res) => {
          resetFormControls();
          console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };
  const openListOfOrders = () => {
    setOrderListVisibility(true);
  };

  return (
    <>
      <Form onSubmit={submitOrder}>
        <Grid container>
          <Grid item xs={6}>
            <Input
              disabled
              label="Order Number"
              name="orderNumber"
              value={values.orderNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={classes.adornmentText}
                    position="start"
                  >
                    #
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Input
              disabled
              label="Regular Total"
              name="regularTotal"
              value={values.regularTotal}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={classes.adornmentText}
                    position="start"
                  >
                    $
                  </InputAdornment>
                ),
              }}
            />

            <Input
              disabled
              label="Discounted Total"
              name="discountedTotal"
              value={values.discountedTotal}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    className={classes.adornmentText}
                    position="start"
                  >
                    $
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <ButtonGroup className={classes.submitButtonGroup}>
           
            <MuiButton
              size="large"
              endIcon={<RestaurantMenuIcon />}
              type="submit"
            >
              Submit
            </MuiButton>

            <MuiButton size="small" startIcon={<ReplayIcon />} />
          
          </ButtonGroup>

          <Button
            size="large"
            onClick={openListOfOrders}
            startIcon={<ReorderIcon />}
          >
            Orders
          </Button>
        </Grid>
      </Form>

      <Popup
        title="List of Orders"
        openPopup={orderListVisibility}
        setOpenPopup={setOrderListVisibility}
      >
        <OrderList
          {...{
            setOrderListVisibility,
            resetFormControls,
          }}
        />
      </Popup>
    </>
    
  );
}
