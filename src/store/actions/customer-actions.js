import {CUSTOMER_ACTION} from './types'
export const getCustomer = (customers)=>{
    return function (dispatch){
        dispatch({
            type: CUSTOMER_ACTION,
            payload: customers
        })
    }

}
