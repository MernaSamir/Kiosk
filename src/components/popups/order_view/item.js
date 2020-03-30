import React, { Component } from 'react'
import { get, round, map } from 'lodash'
import applyFilters from 'helpers/functions/filters'
import { connect } from 'react-redux'
import Clock from 'helpers/components/clock'
import classes from './style.less';
class PackItem extends Component {
    constructor(props){
        super(props);
        this.fun = {
            key: 'diff',
            compare: 'select.fired_time',
            label: false
        }
    }
    renderGuestsNum = () => {
        const { order } = this.props
        return order.guests_num || "1"
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
        let str = ''
        if (modifierslist.length > 0) {
            str += `(${this.renderModifiersList(modifierslist)})`
        }
        if (doneness) {
            str += ` (${doneness.name})`
        }
        return str
    }
    renderItemModDone = (item) => {
        return `${item.name} ${this.renderItemContent()}`
    }
    serveItem = ()=>{
        const {orderDetail, setMain} = this.props;
        setMain("orders__details", {
            item: {
                id: orderDetail.id,
                status: 'served',
                serve_time: new Date(),
                action: 'update'
            }
        })
    }
    renderItemStatus = (item) => {
        const cls = applyFilters({key: 'packItemStatus', time: this.props.time, to: item.fired_time, late: 10, voided: this.voided}, item, undefined);
        return get(classes, cls)
    }

    render() {
        const { quantity, unit, course = {}, item = {}, orderDetail } = this.props
        const { notes } = orderDetail
        if(orderDetail.status!='served'){
            this.voided = applyFilters({
                path: 'orders__details',
                key: 'Filter',
                params:{
                    void: orderDetail.id
                },
                then: {
                    key: 'SumBy',
                    col: "quantity"
                }
            })
            return (
                <tr onClick={this.serveItem} className={this.renderItemStatus(orderDetail)}>
                    {/* <td>{this.renderGuestsNum()}</td> */}
                    <td>{get(course, "name", '')}</td>
                    <td>{this.renderItemModDone(item)}</td>
                    <td>{notes ? notes : ""}</td>
                    <td>{get(unit, 'name')}</td>
                    <td>{`${round(quantity, 1)}${this.voided ? `(V${this.voided})`:''}`}</td>
                    <td><Clock fun={this.fun} select={orderDetail} /></td>
                </tr>
            )
        }
        return <></>
    }
}

const mapStateToProps = (state, props) => ({
    orderDetail: get(state.orders__details.data, props.id),
    prices: state.items__prices.data,
    items: state.items__sales_items.data,
    get price() { return get(state.items__prices.data, this.orderDetail.item) },
    get item() { return get(state.items__sales_items.data, this.price.sales_item) },
    get unit() { return get(state.dropdowns__units_of_measure.data, this.price.sales_unit) },
    doneness: get(state.dropdowns__doneness.data, props.doneness),
    course: get(state.dropdowns__courses.data, props.course),
    time: state.main.time
})

export default connect(mapStateToProps)(PackItem)