import React, { Component } from 'react'
import { connect } from 'react-redux'
import applyFilters from 'helpers/functions/filters'
import Back_Button from 'components/Back_Button'
import Types from './types'
import classes from './style.less'
import Ok from './ok'
import { get } from 'lodash';
import DiscoutOrders from './discount_order'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import {seat} from 'components/seat_name'
class Discount extends Component {

    state = {
        GroupMember: '',
        MemberId: '',
        ModalVisible: false,
        Negative: 'Negative Discount',
        Positive: 'Positive Discount',
        discountType: ''
    }

    handleOk = () => {
        const { setDiscoutType, history, setMain } = this.props
        setDiscoutType(this.state.discountType)
        // setMain("orders__details", { discountItem: false })
        history.push('/home')
    }

    back = () => {
        const { setMain, history } = this.props
        setMain('discount__main', { active: '' })
        // setMain("orders__details", { discountItem: false })
        history.push('/home')

    }

    renderTitle = () => {
        return <div className={classes.titles}>
            {this.checkItem()}
            {/* <p>Order# {order.num}</p> */}
        </div>
    }

    checkItem = () => {
        const { discount_type, detail, table, order, seat_num } = this.props
        const item = applyFilters({
            key: 'chain',
            selectors: {
                "items__prices": "item",
                "items__sales_items": "sales_item",
            },
        }, detail)
        if (discount_type =='item') {
            return <>
                <p>Discount Item</p>
                <p>{item.name}</p>
            </>
        }
        else if(discount_type =='seat') {
            return <>
                <p>Discount Seat</p>
        <p>T:{table.name} / {seat(seat_num, order.id, 'Seat')}</p>
            </>
        }
        return <p>Discount Order</p>
    }

    render() {
        const { order = {} } = this.props
        return (
            <div className={classes.DiscountMain}>
                <div className={classes.DicountFrame}>
                    <div className={classes.FlexDiv}>
                        <Back_Button onClick={this.back} />
                        <div className={classes.DicountTitle}>
                            {this.renderTitle()}

                        </div>
                    </div>
                    <DiscoutOrders></DiscoutOrders>
                    {/* <label className={classes.DiscountLabel}>Choose One</label> */}
                    <Types />
                    <hr className={classes.Line} />
                    <div className={classes.FlexDiv}>
                        <Ok />
                    </div>
                </div>
            </div>
        )
    }
}



const mapStateToProps = (state) => ({
    order: get(state.orders__main, `data.${state.orders__main.active}`, {}),
    // discountItem: get(state.orders__details, 'discountItem', false),
    detail: get(state.orders__details.data, state.orders__details.active, {}),
    discount_type: get(state.orders__orders_discount, 'type', ''),
    table: get(state.dinin__tables.data, state.dinin__tables.active, ''),
    seat_num: get(state.orders__details, 'item.seat_num', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Discount))
