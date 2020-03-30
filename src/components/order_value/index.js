import React from 'react'
import applyFilters from "helpers/functions/filters";
export const  Cal_Order =(props) => {
    const {order} = props
    const calc = applyFilters({
        key: "Filter",
        path: 'orders__details',
        params: {
            order: order.id
        },
        then: {
            key: "Reject",
            params: {
                deleted: true
            },
            then: {
                key: 'calculateOrderReceipt',
            }
        }
    }, undefined, undefined, {
            seatsNum: [],
            order: order.id
        })

    return <p style={{margin:'0%'}}>
        {calc.net_total}
    </p>
}

