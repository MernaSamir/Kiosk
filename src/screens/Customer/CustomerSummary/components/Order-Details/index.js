import React, { Component } from 'react'
// import './order-details.css'
import classes from './style.less'
import Table from './components/table'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { last, find, map } from 'lodash'
import moment from 'moment';
import applyFilters from 'helpers/functions/filters'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class OrderDetails extends Component {

    state = {
        display: 'none',
        page: 1,
        orderId: 1
    }

    getDatas = () => {
        const { CurrentCustomer } = this.props;
        const { orderId } = this.state
        const receipts = applyFilters({
            key: 'ListInside',
            path: 'orders__receipt',
            compare: 'id',
            select: 'customer',
            selectors: {
                orders__main: 'order',
            }
        }, undefined, undefined, { data: CurrentCustomer })
        const orders = applyFilters({
            key: 'picking',
            path: 'orders__main',
            select: 'order',
            then: {
                key: 'Reject',
                params: {
                    invoice: null,
                    canceled_time: null
                }
            }
        }, undefined, undefined, { data: receipts })
        const order = find(orders, { id: orderId }) || last(orders) || {};
        const orderDetails = applyFilters({
            key: 'Filter',
            path: `orders__details`,
            params: {
                order: order.id
            },
            then: {
                key: 'Reject',
                params: {
                    deleted: true
                }
            }
        });
        const mode = applyFilters({
            path: `settings__mode.data.${order.mode}`
        })
        this.datas = {
            mode,
            order,
            orders,
            orderDetails,
            receipts
        }

    }

    onClick = () => {
        if (this.state.display == "none") {
            this.setState({
                display: "block"
            })
        }
        else {
            this.setState({
                display: "none"
            })
        }
    }

    renderDates = () => {
        const { orders } = this.datas
        return map(orders, d => (
            <button type="button" onClick={this.changeOrder.bind(this, d.id)} > {moment(d.created_at).format("DD-MM-YYYY")} </button>
        )).slice(5 * (this.state.page - 1), 5 * this.state.page)
    }

    changeOrder = (orderId) => {
        this.setState({
            orderId
        })
    }

    more = () => {
        const { orders } = this.datas;
        let maxPage = Math.ceil(orders.length / 5)
        if (this.state.page < maxPage) {
            this.setState({
                page: this.state.page + 1
            })
        }
    }

    renderMoreBtn = () => {
        const { orders } = this.datas
        let maxPage = Math.ceil(orders.length / 5)
        // const list = filter()
        if (orders.length > 5 && this.state.page < maxPage) {
            return <button type="button" className="date-btn" onClick={this.more.bind(this)}> More </button>
        }
        else
            return <></>
    }

    renderBackBtn = () => {
        const { orders } = this.datas
        if (orders.length > 5 && this.state.page > 1) {
            return <button type="button" className="date-btn" onClick={this.back.bind(this)}>
                <FontAwesomeIcon icon="arrow-left" />
            </button>
        }
    }

    back = () => {
        if (this.state.page > 1) {
            this.setState({
                page: this.state.page - 1
            })
        }
    }

    render() {
        this.getDatas()
        const { mode = {}, order, orderDetails, CurrentCustomer } = this.datas;
        return (
            <div className={classes.orderDetails}>
                <div className={classes.first}>
                    <p className={classes.title} >{`Order History #${order.num}`}</p>
                </div>
                <div className={classes.second}>
                    <div>
                        <p> {moment(order.created_at).format("DD/MM/YYYY hh:mm")}</p>
                    </div>
                    <div>
                        <p>{mode.name}</p>
                        {/* <p >{`Total: ${lastOrder.item_net_total}`}</p> */}
                    </div>
                </div>
                <Table orderId={this.state.orderId} orderDetails={orderDetails}
                    CurrentCustomer={CurrentCustomer} />
                <div className={classes.orders}>
                    <div className={classes.dates}>
                        {this.renderDates()}
                        {this.renderMoreBtn()}
                    </div>
                    <div className={classes.back}>
                        {this.renderBackBtn()}
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    orders_list: state.orders__main.data,
    receipts: state.orders__receipt.data
})
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetails)
