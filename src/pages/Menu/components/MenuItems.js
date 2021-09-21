import React, { useState, useEffect } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../../../api';
import { IconButton, InputBase, ListItemText, Paper, List, ListItem, makeStyles, ListItemSecondaryAction,} from '@material-ui/core';
import SearchTwoToneIcon from '@material-ui/icons/SearchTwoTone';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const useStyles = makeStyles((theme) => ({
  searchPaper: {
    width: '95%',
    padding: '4px 4px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    "& > *": {
      width: theme.spacing(10),
    },
  },
  searchInput: {
    width: '95%',
    marginLeft: theme.spacing(1.5),
    flex: 1,
  },
  listRoot: {
    width: '95%',
    marginTop: theme.spacing(1),
    maxHeight: 450,
    overflow: 'auto',
    '& li:hover': {
      cursor: 'pointer',
      backgroundColor: '#E3E3E3',
    },
    '& li:hover .MuiButtonBase-root': {
      display: 'block',
      color: '#000',
    },
    '& .MuiButtonBase-root': {
      display: 'none',
    },
    '& .MuiButtonBase-root:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

export default function MenuItems(props) {
  const { values, setValues } = props;
  const [menuItems, setMenuItems] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  const classes = useStyles();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.MENUITEM)
      .fetchAll()
      .then((result) => {
        setMenuItems(result.data);
        setSearchList(result.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    let x = [...menuItems];
    x = x.filter((y) => {
      return y.menuName.toLowerCase().includes(searchKey.toLocaleLowerCase());
    });
    setSearchList(x);
  }, [searchKey, menuItems]);

  const addOrderItem = (menuModel) => {
    let orderModel = {
      menuModel: menuModel,
      quantity: 1, //SAVED IN THE DATABASE
      discounted: false,
      orderItemId: menuModel.id,
      orderItemPrice: menuModel.price,
      orderItemName: menuModel.menuName,
    };

    createAPIEndpoint(ENDPOINTS.ADDORDER)
      .create(orderModel)
      .then((data) => {
        orderModel.id = data.data.id;
        setValues({
          ...orderModel,
          orderDetails: [...values.orderDetails, orderModel],
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Paper className={classes.searchPaper}>
        <InputBase
          className={classes.searchInput}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="Search food items"
        />
        <IconButton>
          <SearchTwoToneIcon />
        </IconButton>
      </Paper>

      <List className={classes.listRoot}>
        {searchList.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              onClick={() => addOrderItem(item)}
              primary={item.menuName}
              secondary={"$" + item.price}
            />

            <ListItemSecondaryAction>
              <IconButton onClick={() => addOrderItem(item)}>
                <PlusOneIcon />
                <ArrowForwardIosIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
}
