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
            col: 'created_at',
            type: 'main',
            format: '%H'
        }
    ]
}

const settings = {
    name: 'Hourly Revenu',
    levels:['modes'],
    raw_data: true,
    businessDay: true,
    option: true,
    salesDetails: false,
    details: {
        revenu: {
            title: '',
            show: 'h',
            data_path: 'raw_data',
            fileds: {
                NetSales: {
                    key: "Net Sales",
                    value: 'orders.totals.net.val'
                },
                Receipts: {
                    key: "Rcpts",
                    value: 'lengths.receipts'
                },
                Guestes: {
                    key: "Guests",
                    value: 'lengths.guests'
                },
                Grant: {
                    key: "Avg/G",
                    value: 'orders.totals.grant'
                },
            }
        }
    }
}

export class Report extends Component {
    render() {
        const {station} = this.props
        return (
            <Container group_by={group_by} models_={models(station)} settings={settings} />
        )
    }
}

export default connect(state=>({
    station: get(state.licensing__station.data, state.licensing__station.active, '')
}))(Report)