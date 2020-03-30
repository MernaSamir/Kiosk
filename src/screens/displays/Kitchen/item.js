import React, { Component } from 'react'
import { get, map, round } from 'lodash'
import { connect } from 'react-redux'
import classes from './style.less'
import applyFilters from 'helpers/functions/filters';
import Clock from 'helpers/components/clock';
const fun = {key: 'diff', compare: 'select.fired_time'}


class PackItem extends Component {
    constructor(props){
        super(props);
    }

    renderGuestsNum = () => {
        const { order, mode } = this.props
        if (mode.name == "Take Away") { return "1" }
        else if (mode.name == "Dine In") { return order.guests_num }
    }

    served = () => {
        const { setMain, orderDetail } = this.props
        setMain('orders__details', { item: { action: "update", id: orderDetail.id, status: 'ready', finish_time: new Date() } })
    }

    renderModifiersList = (modifierslist) => {
        const { prices, items } = this.props
        return map(modifierslist, (d) => {
            const price = get(prices, d.item, {})
            const item = get(items, price.sales_item, {})
            return ` ${item.name} `
        })
    }
    renderTR = () => {
        const { orderDetail } = this.props
        return <tr onClick={this.served.bind(this)}
            className={`${this.renderItemStatus(orderDetail)}`}>
            {this.renderTD()}
        </tr>
    }

    renderItemStatus = (item) => {
        const cls = applyFilters({key: 'packItemStatus', time: this.props.time, to: item.fired_time, late: item.prep_time || 10}, item, undefined);
        if(cls!='late' && this.voided){
            return get(classes, 'voided')
        }
        return get(classes, cls)
    }

    renderModifiersList = (modifierslist) => {
        const { prices, items } = this.props
        return map(modifierslist, (d) => {
            const price = get(prices, d.item, {})
            const item = get(items, price.sales_item, {})
            return item.name
        }).join(', ')
    }

    renderItemContent = () => {
        const { orderDetail, doneness } = this.props
        const modifierslist = applyFilters({
            key: 'Filter', 
            path: "orders__details", 
            params: {
                parent: orderDetail.id
            },
            then: {
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        })
        let str = ' '
        if (modifierslist.length > 0) {
            str += `(${this.renderModifiersList(modifierslist)})`
        }
        if (doneness) {
            str += ` (${doneness.name})`
        }
        return str
    }

    renderNewQty = (orderDetail) => {
        if (this.voided) {
            return round(orderDetail.quantity-this.voided.quantity, 2)
        }
        return round(orderDetail.quantity, 2)
    }

    renderOrderNum = () => {
        const { order, mode } = this.props
        return `${mode.key} ${order.num}`
    }
    removals=()=>{
        const {orderDetail} = this.props
        const removals = applyFilters({
            key:'Filter',
            path: 'orders__recipe_removals',
            params:{
                detail: orderDetail.id,
                _type: 'rm'
            }
            
        })
       
       return map(applyFilters({
        key:'picking',
        reduxName:'stock__items',
        select:'stock_item'
       }, removals), d=>(d.name) ).join(' , ')
    }
    replacements=()=>{
        const {orderDetail} = this.props
        const removals = applyFilters({
            key:'Filter',
            path: 'orders__recipe_removals',
            params:{
                detail: orderDetail.id,
                _type: 'rc'
            }
            
        })
       
       return map(removals, d=>{
           return <>
           -{[applyFilters({path:`stock__items.data.${d.stock_item}`}).name,
           applyFilters({path:`stock__items.data.${d.replaced}`}).name  ].join(' by ')}
           <br></br>
           </>
           
       })
    }

    renderTD = () => {
        const { index, unit, table, _item, course = {}, orderDetail } = this.props
        const { notes = "" } = orderDetail
        return <>
            <td>{index}</td>
            <td>{this.renderOrderNum()}</td>
            <td>{table}</td>
            <td>{course}</td>
            <td>
                {_item.name} {this.renderItemContent()}
            </td>
            <td>
               {this.removals()}
            </td>
            <td>
                {this.replacements()}
            </td>
            <td>{notes && notes}</td>
            <td>{unit.name}</td>
            <td>{this.renderNewQty(orderDetail)}</td>
            <td>{get(this.voided, 'quantity')}</td>
            <td>
                <Clock format="HH:mm" select={orderDetail} fun={fun} />
            </td>
        </>
    }

    render() {
        const {orderDetail} = this.props
        this.voided = applyFilters({key: "Find", path: 'orders__details', params: {void: orderDetail.id}})
        return (
            this.renderTR()
        )
    }
}

const mapStateToProps = (state, props) => ({
    orderDetail: get(state.orders__details.data, props.item_id, {}),
    get order(){ return get(state.orders__main.data, this.orderDetail.order)},
    get table() { return get(state.dinin__tables.data, `${this.order.table}.name`, 'Tw')},
    get mode(){ return get(state.settings__mode.data, this.order.mode)},
    get course() { return get(state.dropdowns__courses.data, `${this.orderDetail.course}.name`, "") },
    get price() { return get(state.items__prices.data, this.orderDetail.item, {}) },
    prices: get(state.items__prices, 'data', {}),
    items: state.items__sales_items.data,
    get _item() { return get(this.items, this.price.sales_item, {}) },
    get unit(){ return get(state.dropdowns__units_of_measure.data, this.price.sales_unit, {})},
    get doneness() { return get(state.dropdowns__doneness.data, this.orderDetail.doneness) },
    time: state.main.time
});

export default connect(mapStateToProps)(PackItem)
