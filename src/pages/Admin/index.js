import { useEffect } from 'react';
import { useState } from 'react';
import { createAPIEndpoint, ENDPOINTS } from '../../api';
import { Container, Button as MuiButton, makeStyles, InputAdornment, } from '@material-ui/core';
import { Input } from "../../controls";
import Form from  "../../layouts/Form";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './styles.css';
import AddIcon from '@material-ui/icons/Add';
import Popup from '../../layouts/Popup';
import EditPopup from '../../layouts/EditPopup';
import AddMenu from './AddMenu';
import { getCookie, parsedJwtReturn } from '../cookieReader';
import ListAlt from '@material-ui/icons/ListAlt'

const useStyles = makeStyles(theme => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#f3b33d',
            fontWeight: 'bolder',
            fontSize: '1.5em'
        }
    },
    addButton: {
        marginLeft: '400px',
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    },
    otherButtons: {
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

function refreshPage() {
    window.location.reload();
};

export default function Admin(props) {
    const [menuItems, setMenuItems] = useState([]);
    const [openPopup, setOpenPopup] = useState(false);
    const [openEditPopup, setEditOpenPopup] = useState(false);
    const [tempMenuName, setTempMenuName] = useState("");
    const [tempMenuPrice, setTempMenuPrice] = useState(0);
    const [tempMenuID, setTempMenuID] = useState(0);
    const classes = useStyles();

    const prePopulateEditingRow = (menuModel) =>{
        setEditOpenPopup(true);
        createAPIEndpoint(ENDPOINTS.SINGLEMENUITEM).fetchById(menuModel.id, menuModel)
        .then(res=>{
            setTempMenuID(res.data.id)
            setTempMenuName(res.data.menuName);
            setTempMenuPrice(res.data.price);
        }).catch((error) => console.log(error))
    }

    function addName(e) {
        setTempMenuName(e.target.value)
    }

    function addPrice(e) {
        setTempMenuPrice(e.target.value)
    }

    const updateMenuItems = (id) => {
        let updatedMenuModel ={
            id: tempMenuID,
            menuName: tempMenuName,
            price: tempMenuPrice
        }
        createAPIEndpoint(ENDPOINTS.UPDATEMENU).update(id, updatedMenuModel)
        refreshPage();
    }

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.MENUITEM)
            .fetchAll()
            .then((result) => {
                setMenuItems(result.data);
            })
            .catch((error) => console.log(error));
    }, []);
    
    if (getCookie("token") === "" || getCookie("token") === "undefined"){
        alert("Please Sign-in as Admin");
        window.location.href = '/login';
    }else if(parsedJwtReturn().roles !== "[ROLE_ADMIN]"){
        alert("Access Denied: Only Admins allowed");
        window.location.href = '/';       
    }else{
        return (
        <Container maxWidth='md' className='admin'>
            <h1>Admin</h1>
            <hr />
            <section className='admin__menu mt-4'>
                <h4 className='mb-3'>Menu 
                    <MuiButton
                        onClick = {() => setOpenPopup(true)}
                        variant = 'outlined'
                        className = {classes.addButton}
                        startIcon = {<AddIcon/>}> Add Menu
                        </MuiButton>
                </h4>
                <TableContainer component={Paper}>
                    <Table aria-label='simple table'>
                        <TableHead>
                            <TableRow>
                          
                                <TableCell align='center'>Menu Name</TableCell>
                                <TableCell align='center'>Price</TableCell>
                                <TableCell align='center'>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menuItems.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell align='center'>
                                        {item.menuName}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {item.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell align='center'>
                                        <MuiButton 
                                        className = {classes.otherButtons}
                                        onClick = {()=> prePopulateEditingRow(item)}>Edit</MuiButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </section>
            <Popup
            title = "Add Menu"
            openPopup = {openPopup}
            setOpenPopup = {setOpenPopup}>
                <AddMenu
                />
            </Popup>
            <EditPopup
            title = "Edit Menu"
            openPopup = {openEditPopup}
            setOpenPopup = {setEditOpenPopup}
            >
                <Input
                variant = 'outlined'
                type = "text"
                label = "New Menu Name"
                name = "menuName" 
                value = {tempMenuName}
                onChange = {addName}
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
            label = "New Price"
            name = "price"
            value = {tempMenuPrice}
            onChange = {addPrice}
            InputProps = {{
                startAdornment : <InputAdornment
                className={classes.adornmentText}
                position = "start">$</InputAdornment>
            }}
            />
            <MuiButton
            className = {classes.otherButtons}
            size = "large"
            onClick={() => updateMenuItems(tempMenuID)}
            >Save</MuiButton>
            <MuiButton 
            className = {classes.otherButtons}
            size = "large"
            onClick = {()=> setEditOpenPopup(false)}
            >Cancel</MuiButton>
            </EditPopup> 

        </Container>
       
    );
    }
};

