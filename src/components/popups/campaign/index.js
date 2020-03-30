import React,{Component} from 'react'
import {get, map, reject, find, includes, filter} from 'lodash'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import {connect} from 'react-redux'
import applyFilters from 'helpers/functions/filters';
import { message } from 'antd';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ShareItem extends Component {
 
  static onSubmit (props, values){
    const {promo, order, seat_num , setMain} = props
     if(values.items.length < promo.gift_items_quantity){
        message.warning(`you have to choose exactly ${promo.gift_items_quantity}`)
     }
     else{
       const details = applyFilters({
        key:'Filter',
        path:'orders__details',
        params:{
          order,
          gift: true
        },
        then:{
          key:'Reject', 
            params:{
              deleted:true
            }
          
        }
       })
       const list = filter(values.items, d=> !includes(details.map(v=>(v.item)), d.id))
       const data = map(list, d=>{
        const price = applyFilters({
          path:`items__prices.data.${d.id}`
        })
         return{item:d.id, quantity:d.quantity, order, seat_num, price:price.price, gift:true}
       })
       setMain('orders__details', {item:{data:data, action:'bulkAdd', onSuccess:this.cancel.bind(this, props)
      
       }})
     }
    }
    static cancel(props, data){
      const {onCancel} = props
      // setData ('orders__details',data)
      onCancel()
      return []
    }
    buttonField() {
      const {data, promo, order} = this.props
      const prices = applyFilters({
        key:'picking',
        reduxName:'items__prices',
        select:'item',
      }, data)
      const salesItems = applyFilters({
        key:'picking',
        reduxName:'items__sales_items',
        select:'sales_item',
      }, prices)
      const options = map(prices, d=>{
        const item = get(salesItems, d.sales_item, '')
        return {...d, name:item.name}
      })
      const details = applyFilters({
        key:'Filter',
        path:'orders__details',
        params:{
          order,
          gift: true
        },
        then:{
          key:'Reject', 
            params:{
              deleted:true
            }
          
        }
      })
     
        return Render([{
            name: "items",
            type: 'MultiSelectQuantity',
            className: classes.btnsContanier,
            options: options,
            max: promo.gift_items_quantity,
            initValue: details.map(d=>({id:d.item, quantity: d.quantity}) )

        }])
    }
    remove=(id)=>{
      const{handleChange, values, order} = this.props
      const details = applyFilters({
        key:'Filter',
        path:'orders__details',
        params:{
          order,
          gift: true
        },
        then:{
          key:'Reject', 
          params:{
            deleted:true
          }
        }
      })
      const found = find(details, {item:id, gift:true})
      if(found){
        message.warning(`you have to remove it from the order`)
      }
      else{

        handleChange({
          target: {
              name: 'items',
              value: reject(values.items,d=>(d.id == id))
          }
      })
      }
    }
      selected = () =>{
        const {values} = this.props
        return map (values.items, d=>{
          const price = applyFilters({
            path:`items__prices.data.${d.id}`
          })

          const item = applyFilters({path:`items__sales_items.data.${price.sales_item}`})
          return<div className={classes.selected} onClick={this.remove.bind(this, d.id)} key={d.id}>
            <p>{item.name}</p>
              <div className={classes.quantity}>{d.quantity}</div>
            <FontAwesomeIcon icon="times" className={classes.icon} />
          </div>
        })
      } 
     
      render() {
        const {promo, order} = this.props
        const details = applyFilters({
          key:'Filter',
          path:'orders__details',
          params:{
            order,
            gift: true
          },
          then:{
            key:'Reject', 
            params:{
              deleted:true
            }
          }
        })
        return (
          <div className={classes.moveSeatContiner}>
            <p className={classes.title}>choose gift</p>
            <p>choose { promo.gift_items_quantity - details.length}</p>
            {this.buttonField()}
            <div className={classes.values}>
            {this.selected()}
            </div>
          <button type='submit'>Ok</button>
          </div>
        )
      }
    }



const mapStateToProps = (state) =>({
    order: get(state.orders__main, 'active', ''),
    seat_num: get (state.orders__details, 'item.seat_num',0 ),
   
})

export default connect(mapStateToProps,mapDispatchToProps) (Form(ShareItem))
