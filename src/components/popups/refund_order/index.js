import React,{Component} from 'react'
import classes from './style.less';
import { get, omit , map} from 'lodash';
import {caluclateRefundQty}  from 'helpers'
import {connect} from 'react-redux';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import {withTranslation} from 'react-i18next'
class RefundOrder extends Component {
   
    static onSubmit(props, values) {
        const { setMain,receipt, user, shift } = props
        setMain ('orders__receipt',
         {item:{...omit(receipt,'id','number'),parent:receipt.id, _type:'R', action: 'add',cashir: user.id, shift,
         reason:values.reason, onSuccess:this.addPayments.bind(this,props)}})
        
    }
    static addPayments =(props, refReceipt) =>{
        const {payments} = props
        const data = map(payments,(d, id)=>{
            return {payment_type:id, paid:d, receipt: refReceipt.id, value: d}
        })
        return [{
            type: 'set_main_orders__payment',
            data: {
                item:{
                    data, 
                    action:'bulkAdd', 
                    onSuccess: this.afterAdd.bind(this, props, refReceipt)
                }
            }
        }]
    }
    static afterAdd (props,refReceipt){
        const { onCancel, receipt } = props
        let list = get(props, 'listItems', false)
        if(!list){
            const refunded = applyFilters({
                key: 'Filter',
                path: "orders__receipt",
                params: {
                    parent: receipt.id,
                },
            })
    
            const refundedItems = applyFilters({
                key: 'Includes',
                path: "orders__receipt_items",
                select: 'receipt',
            }, undefined, undefined, {data: refunded.map(d=>d.id)})

            const receiptItems = applyFilters({
                key: 'Filter',
                path: "orders__receipt_items",
                params: {
                    receipt: receipt.id,
                },
            })
           
            list = caluclateRefundQty(receiptItems, refundedItems).list.filter(d=>d.quantity)
        }
        const data = map(list,d=>({...omit(d,'id'), quantity:d.quantity * -1, receipt:refReceipt.id}))
        return [{
            type: 'set_main_orders__receipt_items',
            data: {
                item:{
                    data, 
                    action:'bulkAdd', 
                    onSuccess(){
                        onCancel()
                        return []
                    }
                }
            }
        }]
    }

    renderRows = () => {
        const list = applyFilters({
            key:'Filter',
            path:'dropdowns__reasons',
            params:{
                active: true,
                _type:'Re'
            }
        })
        return Render([{
            name: "reasons",
            type: 'selectButtons',
            className: classes.btnsContanier,
            options: list

        }])
    }

    renderField = () => {
        // const{} = this.props

        return Render([{
            type: "TextBox",
            name: 'note',
            label: 'Notes:',
            className: classes.inputField,


        }])
    }
  
    render() {
        const { onCancel, t } = this.props
        return (
            <div className={classes.pop_search_container}>
                <p>{t('Refund Order')}</p>
                <p>{t('Reasons')}</p>
                {this.renderRows()}
                <div className={classes.inputs}>
                    {this.renderField()}
                </div>

                <div className={classes.saveBtns}>
                    <button onClick={onCancel.bind(this)}>{t('Cancel')}</button>
                    <button type='submit'>{t('Ok')}</button>
                </div>
            </div>
        )
    }
}





const mapStateToProps = (state) =>({
    receipt: get(state.orders__receipt, `data.${state.orders__receipt.active}`,{}),
    item:state.item,
    user: get(state.main, 'current', ''),
    shift: get(state.orders__shift, 'active', '')
})
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps) ( Form(RefundOrder) ) )
