import React, { Component } from 'react'
import Sales from './sales'
import DataRender from './data_render'
import Menus from './menus'
import Footer from './footer'

const other_mode = {
    title:'Order Modes',
    fileds: {
        Receipts: {
            key: "Receipts",
            value: 'totals.lengths.receipts'
        },
        Sales: {
            key: "Grand Sales",
            value: 'totals.orders.totals.grant'
        }
    },
    data_path: 'data.childs',
    reduxName: 'settings__mode'
}

const payment_detail = {
    title:'Payment Details',
    fileds: {
        Total: {
            key: "Total",
            value: 'totals.orders.totals.paid'
        }
    },
    data_path: 'data.totals.orders.totals.paid',
    reduxName: 'payment__types'
}

export default class Details extends Component {
    render() {
        const { data } = this.props
        return (
            <>
                <Sales />
                <DataRender settings={payment_detail} />
                <DataRender settings={other_mode} />
                {/* <Menus menus={this.state.data.menues}/> */}
                {/* <Footer /> */}
            </>
        )
    }
}
