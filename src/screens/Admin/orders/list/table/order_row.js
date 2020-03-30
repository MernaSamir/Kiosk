import React, { Component } from 'react'
import ReceiptsComp from './receiptsComp'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, head, sumBy, isEqual, pick, find } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.less';
import applyFilters from 'helpers/functions/filters';
import RefundIcon from 'assets/images/greyRefund.svg'

class order_row extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ["activeItem",'order']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
      }
      grossSales = () =>{
          const {order} = this.props
          const payments = applyFilters({
              key:'Filter',
              path:'orders__payment',
              params:{
                  order:order.id
              }
          })
         
         let currency
        if(get(head(payments),'currency', false)){
            currency= applyFilters({path:`dropdowns__currencies.data.${head(payments).currency}`})
         }
         else{
            currency = applyFilters({
                key:"Find",
                path:"dropdowns__currencies",
                params:{
                    is_base_currency:true
                }
            })
         }

        return `${get(currency,'symbol','')} ${sumBy(payments, 'value')}`
        
       

      }
    selectOrder = (selectedOrder) => {
        const { setMain } = this.props
        const orderReceipts = applyFilters({
            key: 'Filter',
            path: "orders__receipt",
            params: {
                order: selectedOrder.id
            }
        })
        setMain('orders__main', { active: selectedOrder.id })
        setMain('orders__receipt_items', { item: {} })
        if(orderReceipts.length){
            const id = get(head(orderReceipts), 'id','')
            setMain('orders__receipt',{active: id})
        }
        else{
            setMain('orders__receipt',{active: ''})
    }
        
        
}
    renderRefund =()=>{
        const {order} = this.props
        const orderReceipts = applyFilters({
            key: 'Filter',
            path: "orders__receipt",
            params: {
                order: order.id
            }
        })
        if(find(orderReceipts,{_type:'R'})){
            return <img src={RefundIcon}/>
        }
        return <></>
    }
    renderClass=()=>{
        const {order, activeItem} = this.props
        const orderReceipts = applyFilters({
            key: 'Filter',
            path: "orders__receipt",
            params: {
                order: order.id
            }
        })
        
        if(find(orderReceipts,{_type:'R'})){
            return classes.refund
        }
        else if(order.id == activeItem.id){
            return classes.marked
        }
        else{
            return classes.unMarked
        }
    }
        

    render() {
        const { order ={}, idx, activeItem } = this.props
        return (
            <tr key={idx} className={this.renderClass()}>

                <td  onClick={() => this.selectOrder(order)} ><FontAwesomeIcon className={classes.icon} icon={activeItem.id ==order.id?'chevron-left':"chevron-right"}/></td>
                <td >{this.renderRefund()}</td>
                <td  ><FontAwesomeIcon icon='hashtag'/>{order.num}</td>
                <ReceiptsComp order={order} activeItem={activeItem}/>
                <td >{this.grossSales()}</td>

            </tr>
        )
    }
}


const mapStateToProps = (state, props) => ({
    activeItem: get(state.orders__main.data, state.orders__main.active, {}),

})



export default connect(mapStateToProps, mapDispatchToProps)(order_row)
