import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import { get, filter, sumBy } from 'lodash';
import mapDispatchToProps from 'helpers/actions/main'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'


class QtyRefund extends Component {

    
    static onSubmit(props, values) {

        const {onClick, onCancel} = props
        onClick(values.qty)
        onCancel()
    }

    renderPad = () => {
        return Render([{
            type: "Calc",
            name: 'amount_calc',
            target: "qty",
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "D"],
            clear: ['C'],
            remove: ['D'],
            className: "",

        }])
    }
    renderQty = () => {
        const {validateQty } = this.props
        const qty = validateQty
        return Render([{
            type: "TextBox",
            name: 'qty',
            label: 'Qty',
            className: classes.note,
            validates: { required: true, maxNumber: qty }
        }])
    }
    renderButtons = () => {
        const { onCancel } = this.props
        return <div className={classes.buttonsDiv}>
            <button onClick={onCancel}>cancel</button>
            <button type='submit'>ok</button>
        </div>
    }
    render() {
        const {salesItem} = this.props
        return (
            <div className={classes.tablePopupDiv} >
                <div className={classes.popupTitle}>
                    <p >Refund item:{ salesItem.name}</p>
                    <p >Refund Value: </p>
                </div>
                {this.renderQty()}
              
                <br />
                <div className={classes.popupCalculator} >
                    {this.renderPad()}
                </div>
                {this.renderButtons()}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        receiptItem : get(state.orders__receipt_items.data, state.orders__receipt_items.active,{}),
        get orderDetail() {return get(state.orders__details.data, this.receiptItem.details, {})},
        get price (){return get(state.items__prices.data,this.orderDetail.item,{})},
        get salesItem (){return  get(state.items__sales_items.data, this.price.sales_item,{}) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Form(QtyRefund))
