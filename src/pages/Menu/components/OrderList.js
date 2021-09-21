import React, { useState, useEffect } from 'react'
import { createAPIEndpoint, ENDPOINTS } from '../../../api'
import { Checkbox } from '@material-ui/core';


export default function OrderList(props) {
    
    const [orderList, setOrderList] = useState([]);
    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.TRANSACTION).fetchAll()
        .then(res => {
            setOrderList(res.data.sort((a, b) => a.timeM > b.timeM ? 1:-1))  
                })
                .catch(err => console.log(err))
        }, [])

    return (
        <>
            <table class="table table-striped"> 
                <thead>
                <tr>
                        <td>Transaction ID</td>
                        <td>OrderName</td>
                        <td>Price</td>
                        <td>Discounted</td>
                        <td>Quantity</td>
                </tr>
                </thead>

                <tbody>
                    {orderList.map((item) => (
                        <>
                        {item.orderModel.map(orderModel =>(
                        <tr key={item.id}>
                            <td>
                                {item.id}
                            </td>
                
                            <td>
                            {orderModel.menuModel.menuName}
                            </td>
            
                            <td>
                                {orderModel.menuModel.price}
                            </td>
                            <td>
                                <Checkbox checked={orderModel.discounted} disabled></Checkbox>
                            </td>
                            <td>
                                {orderModel.quantity}<br/>
                            </td>
                            </tr>
                        ))}
                        </>
                    ))}
                </tbody>
            </table>
        </>
    )
}
