import React from 'react';
import {
  List,
  ListItemText,
  Paper,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  ButtonGroup,
  Button,
  Checkbox,
  makeStyles,
} from '@material-ui/core';
import { roundTo2DecimalPoint } from '../../../utils';
import UpdateTwoToneIcon from '@material-ui/icons/UpdateTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { createAPIEndpoint, ENDPOINTS } from '../../../api';
import Tooltip from '@material-ui/core/Tooltip';



const useStyles = makeStyles((theme) => ({
  paperRoot: {
    margin: '15px 0px',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:hover $action_buttons': {
      display: 'block',
    },
  },
  buttonGroup: {
    backgroundColor: '#E3E3E3',
    borderRadius: 8,
    '& .MuiButtonBase-root ': {
      border: 'none',
      minWidth: '25px',
      padding: '1px',
    },
    '& button:nth-child(2)': {
      fontSize: '1.2em',
      color: '#000',
    },
  },
  action_buttons: {
    display: 'none',
    '& .MuiButtonBase-root': {
      color: '#E81719',
    },
  },

  checkbox: {
    fontWeight: 'bolder',
    fontSize: '1.2em',
    margin: '0px 10px',
  },

  totalPerItem: {
    fontWeight: 'bolder',
    fontSize: '1.2em',
    margin: '0px 10px',
  },
}));

export default function OrderedFoodItems(props) {
  const { values, setValues} = props;
  const classes = useStyles();

  let orderedFoodItems = values.orderDetails;

  const removeFoodItem = (index, id) => {
    let x = { ...values };

     if (window.confirm("Are you sure you want to remove this item?")) {
        x.orderDetails = x.orderDetails.filter((item, i) => i !== index);
        setValues({ ...x});
        orderedFoodItems.find((item) => item.id === id);
        let order = { id }
       createAPIEndpoint(ENDPOINTS.DELETE).delete(id, order);
     }
  }

  const updateQuantity = (idx, value) => {
    let x = { ...values };
    let foodItem = x.orderDetails[idx];
    if (foodItem.quantity + value > 0 ) {
      foodItem.quantity += value 
      setValues({ ...x });
    }
  };

   const updateDiscount = (idx, value) => {
     let x = { ...values };
     let foodItem = x.orderDetails[idx];
     foodItem.discounted = !foodItem.discounted;
   };

  const updateOrder = (id) => {
    const updatedItem  = orderedFoodItems.find((item) => item.id === id)
    let order = {
        id,
        menuModel: updatedItem.menuModel,
        discounted: updatedItem.discounted,
        quantity: updatedItem.quantity,
    };
    createAPIEndpoint(ENDPOINTS.UPDATE).update(id, order);
  }

  const handleDiscountChange = () => {
 
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
      ...values,
      discountedTotal: roundTo2DecimalPoint(discountedAmount),
    });
 
  }
  
  const decreaseButton = (count,idx) => {
    if (count <= 1){
      return(
      <Button disabled>&nbsp;</Button>);
    }else{
      return(
      <Button onClick={(e) => updateQuantity(idx, -1)}>
        -
      </Button>);
    }
  }

  return (
    <List>
      {orderedFoodItems.length === 0 ? (
        <ListItem>
          <ListItemText
            primary="Please select food items to continue ... "
            primaryTypographyProps={{
              style: {
                textAlign: "center",
                fontStyle: "italic",
              },
            }}
          />
        </ListItem>
      ) : (
        orderedFoodItems.map((item, idx) => (
          <Paper key={idx} className={classes.paperRoot}>
            <ListItem className="mb-2">
              <ListItemText
                primary={item.orderItemName}
                primaryTypographyProps={{
                  component: "h1",
                  style: {
                    fontWeight: "200",
                    fontSize: "1em",
                  },
                }}
                secondary={
                  <>
                    <ButtonGroup className={classes.buttonGroup} size="small">
                      {decreaseButton(item.quantity,idx)}
                      <Button disabled onChange={(e) => decreaseButton(item.quantity,idx)}>{item.quantity}</Button>
                      <Button onClick={(e) => updateQuantity(idx, 1)}>+</Button>
                    </ButtonGroup>
                    <span className={classes.totalPerItem}>
                      {"$" +
                        roundTo2DecimalPoint(
                          item.quantity * item.orderItemPrice
                        )}
                    </span>
                    <Tooltip 
                           title={<span style={{ fontSize: "12px", color: "white" }}>Is order discounted?</span>}
                           placement = "right"
                           arrow>      
                    <span className={classes.checkbox}>
                        <Checkbox value = {item.discounted} onClick={() => updateDiscount(idx)} onChange={() => handleDiscountChange()} />   
                    </span>
                    </Tooltip>
                  </>
                }
                secondaryTypographyProps={{
                  component: "div",
                }}
              />

              <ListItemSecondaryAction className={classes.action_buttons}>
                <IconButton
                  disableRipple
                  onClick={() => updateOrder(item.id)}
                >
                 <UpdateTwoToneIcon color="primary" /> 
                 </IconButton>

                <IconButton
                  disableRipple
                  onClick={() => removeFoodItem(idx, item.id)}
                >
                    
                <DeleteTwoToneIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))
      )}
    </List>
  );
}
