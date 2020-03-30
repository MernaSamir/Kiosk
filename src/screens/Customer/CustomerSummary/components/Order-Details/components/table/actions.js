import applyFilters from 'helpers/functions/filters';
import { message } from 'antd';
import moment from 'moment'
import { map, get, filter, pick, find } from 'lodash'
import uuid from 'uuid/v4';
export const TW = (values ,props)=>{
    const { setMain, setAll, order, business_day, CurrentCustomer } = props
    if (order.customer != CurrentCustomer) {
        message.warning('Please Close Order First')
    }
    if (order.customer == CurrentCustomer) {
        setAll(addDetails(props, values, order))
    }
    else {
        if (moment().diff(moment(business_day.created_at), 'day') == 0) {
            const order = {
                ...applyFilters({
                    key: 'mapSelect',
                    select: {
                        serve: 'main.current.id',
                        mode: 'settings__mode.active',
                        shift: 'orders__shifts.active',
                        station: 'licensing__station.active'
                    }
                }),
                customer: CurrentCustomer
            }
            setMain("orders__main", {
                item: {
                    ...order,
                    action: 'add',
                    onSuccess: addDetails.bind(this, props, values)
                }
            })
        }
    }
}
 export const DI = TW
 export const CC = (values ,props)=>{
    const { setMain, CurrentCustomer, orderDetails , prices } = props

    setMain('parties__customer', { active: CurrentCustomer })
    setMain('popup', {
        popup: {
            type: 'OrderType', visable: true, width: "50%",
            childProps:{
                orderDetails,
                prices,
                values,

            }
            
            
        }
    }) }
export const addDetails=(props, values, order)=>{
    const { orderDetails, prices, history } = props

    const selected = map(filter(values, { check: true }), (d, i) => i)
    const details = map(pick(orderDetails, selected), (d, i) => ({
        id: uuid(),
        quantity: 1,
        order: order.id,
        item: d.item,
        main_id: d.id,
        price: get(prices, `${d.item}.price`)
    }))
    const modifiers = map(filter(orderDetails, (d) => (selected.includes(d.parent))), d => ({
        id: uuid(),
        item: d.item,
        quantity: d.quantity,
        price: get(prices, `${d.item}.price`),
        parent: find(details, { main_id: d.parent }).id
    }));
    return [{
        type: 'set_main_orders__details',
        data: {
            item: {
                data: [...details, ...modifiers],
                action: 'bulkEdit',
                onSuccess() {
                    history.push("/home")
                    return []
                }
            }
        }
    }]
}

