import React, { Component } from 'react'
import {connect} from 'react-redux'
import classes from './style.less'
import {get, map, isEqual, pick, round, groupBy, sumBy} from 'lodash'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main';
import Items from './items'
import Back from 'components/Back_Button'
import {withTranslation} from 'react-i18next'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import uuid from 'uuid/v4';
import {withRouter} from 'react-router-dom'

class CustomMix extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const compare = ['custom_mix', 'values']
    
    return !isEqual(pick(nextProps, compare), pick(this.props, compare))
}
static onSubmit (props, values){
  const {price, order, setMain, history} = props
    let detail = {id: uuid(), item:price.id, price: 0, quantity: 1, order, is_custom_mix: true}
     const grouped = groupBy(values.items,'custom_mix')
    map(grouped, (d, key)=>{
      const custom_mix = applyFilters({
        path:`items__custom_mix.data.${key}`
      })
      let p = sumBy(d, 'quantity') >= custom_mix.price_variance_qty ? custom_mix.price + custom_mix.price_variance : custom_mix.price
      detail = {...detail, price: detail.price += p }
    })
    let data = map(values.items, d=>{
      if(d.price_variance){
        detail.price += d.price_variance * d.quantity
      }
      return { parent: detail.id, order, quantity:d.quantity, price:0, item:d.item}
    })
    setMain('orders__details',{item:{ data:[detail, ...data],action:"bulkEdit", onSuccess(){
      history.push('/home')
      return []
    } } })
}
    calculateTotal=()=>{
        const { values } = this.props
        let  price= 0
        const grouped = groupBy(values.items,'custom_mix')
        map(grouped, (d, key)=>{
        const custom_mix = applyFilters({
            path:`items__custom_mix.data.${key}`
        })
        let p = sumBy(d, 'quantity') >= custom_mix.price_variance_qty ? custom_mix.price + custom_mix.price_variance : custom_mix.price
        price = price += p 
        })
        map(values.items, d=>{
        if(d.price_variance){
            price += d.price_variance * d.quantity
        }
    })
    return price
    }

  setActive=(id)=>{
    const {setMain, custom_mix} = this.props
    if(custom_mix.id ==id){
      setMain('items__custom_mix', {active: ''})
    }
    else{
      setMain('items__custom_mix', {active: id})
    }
  }
  groups=()=>{
    const {price, custom_mix} = this.props
    const list = applyFilters({
      key:'Filter',
      path:'items__custom_mix',
      params:{
        item_size:price.id
      }
    })
    return map(list, d=>(
    <div  onClick={this.setActive.bind(this, d.id)} className={custom_mix.id== d.id?'alter':''}>
      <p>{d.name}</p>
  <p>$ {round(d.price, 2)}</p>
    </div>
    ))
  }
  

  render() {
    const {custom_mix, price, t} = this.props
    const item = applyFilters({path:`items__sales_items.data.${price.sales_item}`})
    const size = applyFilters({path:`dropdowns__units_of_measure.data.${price.sales_unit}`})
    return (
      
      <div className={classes.container}>
        <div className={classes.header}>
          <Back></Back>
          <p>{item.name} : {size.name}</p>
        </div>
        <div className={classes.price}>
            <p>Total Item Price: {this.calculateTotal()}</p>
        </div>
    <p className={classes.quantity}>{t('Choose Max')} : {item.max_quantity}</p>
      <div className = {classes.btnContainer}>
         {this.groups()}
         </div>

       <Items custom_mix={custom_mix} Render={Render}></Items>
       <div className={classes.ok}>
          <button  type='submit'>ok</button>
      </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
 price: get(state.items__prices.data, state.items__prices.active, ''),
 custom_mix: get(state.items__custom_mix.data, state.items__custom_mix.active, ''),
 order : get(state.orders__main, 'active', '')
})

export default withTranslation()(withRouter( connect(mapStateToProps, mapDispatchToProps)(Form(CustomMix)) ) )