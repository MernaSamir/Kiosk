import React, { Component } from 'react'
import DineInHeader from './headers/dinein'
import DineInOrderDetails from './headers/dinein/details';
import BillCalculations from './calculations'
import { Dinin } from './orders/details';
import classes from './style.less'


class DineInBill extends Component {
    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <div>
                <div className={`${classes.bill} ${classes.myContainer}`}>
                    <DineInHeader />
                    <DineInOrderDetails />
                    <div className={`${classes.dineIn_order} ${classes.popup}`}>
                        <div className={`${classes.collapse_div} ${classes.hidescroll}`}>
                            <Dinin />
                        </div>
                        <BillCalculations />
                    </div>

                </div>
            </div>
        )
    }
}


export default DineInBill
