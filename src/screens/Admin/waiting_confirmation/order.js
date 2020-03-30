import React, { Component } from 'react'
import Table from './table'
import { map, get, find } from "lodash"
import classes from "./style.less"
import { connect } from 'react-redux';



class Order extends Component {
    tabs = [
        { key: "nc", name: 'Confirm' },
        { key: "stl", Component: 'Send' },
    ]
    constructor(props) {
        super(props);
        this.fun = { key: 'diff', compare: 'select.created_at', label: true }
    }
    renderRowData = (row) => {
        const status = find(this.tabs, { key: row.status })
        return map(Table(row, get(status,'name',''), this.fun), (d, index) => {
            return <td key={index} className={d.class}>{get(row, d.view, d.Component)}</td>
        })
    }


    render() {
        const { order } = this.props
        if (order.status != 'nc') {
            return <></>
        }
        return (
            <tr className={classes.trs}>{this.renderRowData(order)}</tr>
        )
    }
}


const mapStateToProps = (state, props) => ({
    order: get(state.orders__main.data, props.d.id, {})
})

export default connect(mapStateToProps)(Order)