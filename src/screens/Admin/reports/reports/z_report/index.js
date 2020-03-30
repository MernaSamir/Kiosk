import React, { Component } from 'react'
import Container from './../../components/container'
import { get } from 'lodash'
import {connect} from 'react-redux'
import models from '../models'
const group_by = {
    "model": "orders__main",
    "fun": "analysisRevenuOrders",
    levels: [
        {
            col: 'mode_id',
            type: 'main'
        },
    ]
}

const settings = {
    name: 'Z-Report',
    levels:['modes'],
    businessDay: true,
    option: true,
    salesDetails: true,
    details: {
        other_mode: {
            title: 'Order Modes',
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
        },
     payment_detail: {
            title: 'Payment Details',
            fileds: {
                Total: {
                    key: "Total",
                    value: 'totals.orders.totals.paid'
                }
            },
            data_path: 'data.totals.orders.totals.paid',
            reduxName: 'payment__types'
        }
    }
}

export class Report extends Component {
    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <Container group_by={group_by} models_={models(this.props.station)} settings={settings} />
        )
    }
}

export default connect(state=>({
    station: get(state.licensing__station.data, state.licensing__station.active, '')
}))(Report)