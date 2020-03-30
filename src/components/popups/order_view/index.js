import React, { Component } from 'react'
import { connect } from 'react-redux'
import { map, get } from 'lodash'
import OrderItem from './item'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import Clock from 'helpers/components/clock'

class OrderView extends Component {
    constructor(props){
        super(props);
        this.fun = {key: 'diff', compare: 'select.fired_time', label: true}
    }
    renderItems = () => {
        const { order, mode, setMain, orderDetails } = this.props
        return map(orderDetails, (item, i) => {
            return <OrderItem setMain={setMain} key={i} {...item} order={order} mode={mode} />
        })
    }

    renderTableHeader() {
        const headers = ["Course", "Item Name", "Notes", "Size", "Qty", "T (Min)"]
        return <tr> {headers.map((d, i) => <th key={i} >{d}</th>)} </tr>
    }


    renderHeader() {
        const { order, mode, orderDetails } = this.props
        const select = get(orderDetails, '[0]', {})
        return <>
            <div key={1} className={`${classes.viewHeader}  ${classes.orderName}`}>
                {`${mode.name} - ${order.num} - ${order.guests_num || 1}`}
            </div>
            <div key={2} className={classes.statusBox} style={{ marginLeft: '40%', marginRight: '40%' }} >
                <Clock format="HH:mm" select={select} fun={this.fun} />
            </div>
        </>
    }

    renderList() {
        return <table className={classes.table}>
            <thead>{this.renderTableHeader()}</thead>
            <tbody>{this.renderItems()}</tbody>
        </table>
    }

    serveAllClick = () => {
        const { orderDetails, setMain } = this.props
        // const res = map(filter(orderDetail, { parent: null, deleted: null, status: 'ready' }), d => {
        //     return { ...d, status: 'served' }
        // })
        const res = map(orderDetails, d => {
            return { ...d, status: 'served', serve_time: new Date() }
        })
        setMain("orders__details", {
            item: {
                data: res, action: 'bulkEdit', onSuccess: () => {
                    return [
                        { type: 'set_main_popup', data: { popup: { popup: {} } } },
                    ]
                }
            }
        })
    }

    done = () => {
        const { setMain } = this.props
        setMain('popup', { popup: {} })
    }

    render() {
        return (
            <div className={classes.container} >
                {this.renderHeader()}
                {this.renderList()}
                <div className={classes.btns}>
                    <button type="button" onClick={this.serveAllClick.bind()}>Serve All</button>
                    <button type="button" onClick={this.done.bind()}>Done</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    order: get(state.orders__main.data, props.activePacking, {}),
    get mode() { return get(state.settings__mode.data, this.order.mode, {}) },
    get table() {return get(state.dinin__tables.data, this.order.table)}
})
export default connect(mapStateToProps, mapDispatchToProps)(OrderView)
