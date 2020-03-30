import React, { Component } from 'react'
// import Red_Square_Button from 'components/Red_Square_Button'
import classes from './style.less'
import {connect} from 'react-redux'
import { get , sumBy} from 'lodash';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters';
import {withTranslation} from 'react-i18next'

class Void extends Component {
    static onSubmit(props, values) {
        const{onClick} = props
        onClick(values.qty)
        // this.details = this.getDetails();
    }
    state = {
        quantity: '0',
    }
    renderPad = () => {
        return Render([{
            type: "Calc",
            name: 'amount_calc',
            target: "qty",
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "D"],
            clear: ['C'],
            remove: ['D'],
            className:classes.numPad,

        }])
    }
    getDetails(){
        const {detail} = this.props;
        return applyFilters({
            key: "Filter",
            path: 'orders__details',
            params: {
                void: detail.id
            },
            then: {
                key: "Reject",
                params: {
                    deleted: true
                }
            }
        })
    }
    renderQty =()=>{
        const {detail} = this.props;
        const details = applyFilters({
            key: "Filter",
            path: 'orders__details',
            params: {
                void: detail.id
            },
            then: {
                key: "Reject",
                params: {
                    deleted: true
                }
            }
        })
        let qty = detail.quantity - sumBy(details, 'quantity')
        return Render([{
            type: "TextBox",
            name: 'qty',
            label: 'Quantity',
            validates: { required: true , maxNumber: qty}
        }])
    }
    renderButtons=()=>{
        const{onCancel} = this.props
        return <div className={classes.saveBtns}>
                    <button onClick={onCancel}>cancel</button>
                    <button type='submit'>ok</button>
                </div>
    }
  render() {
      const {t} = this.props
    return (
        <div className={classes.tablePopupDiv} >
        <div className={classes.popupTitle}>
            <span >{t('Void Item')}
            </span>
        </div>
        <div className={classes.quantity}>
        {this.renderQty()}
        </div>
              <div className={classes.popupCalculator} >
             {this.renderPad()}
        </div>
        {this.renderButtons()}
    </div>
    )
  }
}
const mapStateToProps = (state) =>({
    get detail (){return get(state.orders__details, `data.${state.orders__details.active}`, {})},
})

export default withTranslation() ( connect (mapStateToProps)(Form(Void)) )
