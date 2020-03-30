import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import {get, map, pick, isEqual, range}  from 'lodash'
import applyFilters from 'helpers/functions/filters';

class Alternative extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['price','list','active']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare)) ||!isEqual(pick(this.state, compare), pick(nextState, compare))
      }
   state={
     active: false
   }
    getAlters = (alters)=>{
        const { setChoosen} = this.props
        
        const prices = applyFilters({
            key:'picking',
            reduxName:'items__prices',
            select:  'alter_item'
        }, alters)

        const salesItems = applyFilters({
            key:'picking',
            reduxName:'items__sales_items',
            select:  'sales_item'
        }, map(prices,d=>(d)) )

       
        return map(alters,(d,index)=>{
          const price = get (prices, d.alter_item, '')
          const item = get(salesItems, price.sales_item,'')
          return <button type="button" key={index} className={this.renderClass(d)}
          onClick={setChoosen.bind(this,d)}>{item.name}</button>
         } )
    }
    quantityAlters=(comboItem, alters)=>{
      
      return map(range(comboItem.quantity), d=>{
        const name = applyFilters({
          key: 'chain',
          selectors: {
              "items__prices": "item",
              "items__sales_items": "sales_item",
          }
        }, comboItem)
        return <button onClick={this.setActive}key={d}>{name.name}</button>
      })
      
    }
    setActive=()=>{
      console.log('iam here')
      this.setState({active:true})
    }
    renderBody =()=>{
      const {price, setChoosen, salesItem} = this.props
      const{active} =  this.state
        const comboItem = applyFilters({
          key:'Find',
          path:'items__combo',
          params:{
              item: price.id
          }
      })
    
        const alters = applyFilters({
            key:'Filter',
            path:'items__combo_alters',
            params:{
                combo_item: get(comboItem, 'id','')
            }
        })
        if(alters.length&&comboItem.quantity<=1){
          return <div className={classes.container}>
          <p>Alternatives</p>
          <div className={classes.alters}>
            {price&&<button type="button" className={this.renderClass(comboItem)} onClick={setChoosen.bind(this,comboItem)}>{get(salesItem,'name','')}</button>}
           { this.getAlters(alters)}
           </div>
          </div>
        }
        else if(alters.length){
          return <div className={classes.container}>
          <p>Alternatives</p>
          <div className={classes.alterQuantity}>
            {this.quantityAlters(comboItem, alters)}
          </div>
        <div>{active&&this.alters(alters)}</div>
          </div>
        }
        else{
          return <></>
        }
    }
    alters=(alters)=>{
    const {setAlter, price} = this.props
    const comboItem = applyFilters({
      key:'Find',
      path:'items__combo',
      params:{
          item: price.id
      }
  })
  const comboItemName = applyFilters({
    key: 'chain',
    selectors: {
        "items__prices": "item",
        "items__sales_items": "sales_item",
    }
  }, comboItem)
    return <div className= {classes.alterQuantity}>
    <button type="button">{get(comboItemName,'name','')}</button>
      {map(alters,(d,index)=>{
        const name = applyFilters({
          key: 'chain',
          selectors: {
              "items__prices": "alter_item",
              "items__sales_items": "sales_item",
          }
        }, d)
        return <button type="button" key={index} 
        onClick={setAlter.bind(this,d)}>{name.name}</button>
       } )}
       </div>
    }
    renderClass =(item)=>{
      const {list} = this.props
      const ids = map(list,d=>(d.id))
      if(ids.includes( get(item, 'alter_item', '') ) || ids.includes( get(item, 'item', '') )){
        return classes.active
      }
      else
       return''
    }
  render() {
    
    return (
       this.renderBody()
        
    )
  }
}




const mapStateToProps = (state) => ({
  price: get(state.items__prices.data, state.items__combo.active, ''),
  get salesItem(){return get(state.items__sales_items.data, this.price.sales_item,'')}

})


export default connect(mapStateToProps, mapDispatchToProps)(Alternative)
