import React, { Component } from 'react'
import classes from './style.less';
import { map, get, filter, pick, find } from 'lodash'
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import form from "helpers/wrap/form"
// import applyFilters from 'helpers/functions/filters';
import AddOrder from './add_order'
import uuid from 'uuid/v4';
import { withRouter } from 'react-router-dom'
import * as Actions from './actions'
// import moment from 'moment'
// import { message } from 'antd';



var Table = (data, index) => (
    [
        { head: '', class: classes.check, Component: Render([{ name: `[${index}].check`, type: 'CheckBoxHighlight', className: classes.check }]) },
        { head: 'Qty', view: 'quantity' },
        { head: 'Item', view: 'salesitem.name' },
        { head: 'Size', view: 'unit.name' },
        { head: 'Price', view: 'price' },


    ])
class table extends Component {

    getDatas = () => {

    }

    static onSubmit(props, values) {
        const {mode} = props
        get(Actions, mode.key,()=>{} )(values , props)
     

    }

    renderHeader = () => {
        return map(Table({}), (d) => {
            return <th className={d.class}>{d.head}</th>
        })
    }
    renderBody = (rowData, index) => {

        const { prices, salesItem, salesUnit } = this.props
        const price = get(prices, rowData.item, {})
        const salesitem = get(salesItem, price.sales_item, {})
        const unit = get(salesUnit, price.sales_unit, {})
        const data = { ...rowData, salesitem, unit }
        return map(Table(data, index), (d, i) => {
            return <td className={d.class}>{get(data, d.view, d.Component)}</td>
        })
    }
    render() {
        const { orderDetails } = this.props
        const lastDetails = filter(orderDetails, d => (!d.parent))
        return (
            <div className={classes.tableCo}>
                <div className={classes.tableDiv}>
                    <table >
                        <thead>
                            <tr>
                                {this.renderHeader()}
                            </tr>
                        </thead>
                        <tbody>
                            {map(lastDetails, (d, key) => (
                                <tr key={key}>{this.renderBody(d, key)}</tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <AddOrder />
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    get prices() { return state.items__prices.data },
    get salesItem() { return state.items__sales_items.data },
    get salesUnit() { return state.dropdowns__units_of_measure.data },
    CurrentCustomer: state.parties__customer.active,
    order: get(state.orders__main.data, state.orders__main.active),
    business_day: get(state.orders__business_days.data, state.orders__business_days.active, {}),
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(form(table)))
