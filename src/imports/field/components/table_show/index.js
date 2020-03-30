import React, { Component } from 'react'
import Delete from 'components/recycle_bin'
import { map, get, set, omit, reject, omitBy } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import classes from './style.less'
import OrderRow from './order_row';


var Table = (item) => ([
    { head: 'Qty', class: classes.note, view: 'quantity', },
    // { head: 'Type', class: classes.name, view:''},
    { head: 'Item', class: classes.name, select: item.name },
    { head: 'Price', class: classes.note, view: "price" },
    { head: '', class: classes.note, view: "price" },
])

class table extends Component {
    onChange = (d, c) => {
        const { field: { value, onChange, name } } = this.props
        if (d.data) {
            if (d.all) {
                onChange({ target: { name, value: d.data } })
            } else {
                onChange({ target: { name, value: { ...(value || {}), ...d.data } } })
            }
            return d.data
        }
    }


    renderBillItems = () => {
        const { field } = this.props
        return map(reject(field.value, d => (d.parent)), (detail, index) => {
            return <OrderRow key={index} orderItem={detail}
                detail={detail.id} field={field} 
                onChange={this.onChange}
            />
        })
    }
    renderHeaders = () => {
        return map(Table({}), (d, idx) => {
            return <th key={idx} className={d.class}>{d.head}</th>
        })

    }
    render() {
        return (
            <table className={classes.table}>
                <thead>
                    <tr> {this.renderHeaders()}</tr>
                </thead>
                <tbody>
                    {this.renderBillItems()}
                </tbody>
            </table>
        )
    }
}
export default table