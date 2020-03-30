import React, { Component } from 'react'
import {connect} from 'react-redux'
import classes from './style.less'
import {get, map, groupBy, sumBy} from 'lodash'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main'
// import Form from 'helpers/wrap/form'
// import Render from 'helpers/functions/field_mapper/renderfields'
import uuid from 'uuid/v4';
import Footer from './footer'
import {withRouter} from 'react-router-dom'
class Items extends Component {
    // static onSubmit (props, values){
    //   const {price, order, setMain, history} = props
    //     let detail = {id: uuid(), item:price.id, price: 0, quantity: 1, order, is_custom_mix: true}
    //      const grouped = groupBy(values.items,'custom_mix')
    //     map(grouped, (d, key)=>{
    //       const custom_mix = applyFilters({
    //         path:`items__custom_mix.data.${key}`
    //       })
    //       let p = sumBy(d, 'quantity') >= custom_mix.price_variance_qty ? custom_mix.price + custom_mix.price_variance : custom_mix.price
    //       detail = {...detail, price: detail.price += p }
    //     })
    //     let data = map(values.items, d=>{
    //       if(d.price_variance){
    //         detail.price += d.price_variance
    //       }
    //       return { parent: detail.id, order, quantity:d.quantity, price:0, item:d.item}
    //     })
    //     // data.push(detail)
    //     setMain('orders__details',{item:{ data:[detail, ...data],action:"bulkEdit", onSuccess(){
    //       history.push('/home')
    //       return []
    //     } } })
    // }
  
  
  items=()=>{
    const {custom_mix, price, Render} = this.props
    const items = applyFilters({
      key:'Filter',
      path:'items__custom_mix_group',
      params:{
        custom_mix: custom_mix.id
      }
    })
    const list = map(items, (d, key)=>{
      const item = applyFilters({
        key: 'chainMulti',
        selectors: {
            items__prices: 'item',
            items__sales_items: 'sales_item',
        }
    }, d)
    return {...d, name:item.items__sales_items.name}
    })
    const sales_item = applyFilters({path:`items__sales_items.data.${price.sales_item}`})
    return Render([{
        name: "items",
        type: 'SelectQuantity',
        max:sales_item.max_quantity,
        // className: classes.btnsContanier,
        options: list,
        // initValue: map(removals, i=>({stock_item:i.stock_item, id:i.id}))

    }])
  }

  render() {
    const {custom_mix} = this.props
    return (
      <div className={classes.items}>
       <div>
       { custom_mix&&<p className={classes.quantity}>Choose Max : {custom_mix.quantity}</p>}
       {this.items()}
       </div>
      {/* <div className={classes.ok}>
          <button  type='submit'>ok</button>
      </div> */}
      </div>
      
    )
  }
}

const mapStateToProps = (state) => ({
  price: get(state.items__prices.data, state.items__prices.active, ''),
  order : get(state.orders__main, 'active', '')
})

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(Items) )