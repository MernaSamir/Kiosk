import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isEqual, pick, isArray } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import Header from './header'
import Alters from './alters'
import Footer from './footer'

class Combo extends Component {
  state = {

  }
  constructor(props) {
    super(props)
    const list = this.getComboItems()
    this.state.choosen = list
    props.setAll([{
      type: 'set_main_items__combo', data: {active: ''}
    }])
  }

  activeItem = (id) => {
    const { setMain } = this.props
    setMain('items__combo', { active: id })
  }
  shouldComponentUpdate(nextProps, nextState) {
    const compare = ['price', 'active', 'detail']
    const su =!isEqual(pick(this.props, compare), pick(nextProps, compare)) || !isEqual(this.state.choosen, nextState.choosen)
    if(!isEqual(this.props.detail, nextProps.detail)){
      const list = this.getComboItems()
      this.state.choosen = list
    }
    return su
  }
  getComboItems = () => {
    const { price, detail } = this.props
    let list
    if (detail && detail.is_combo) {
      const items = applyFilters({
        key: 'Filter',
        path: 'orders__details',
        params: {
          parent: detail.id
        }
      })
      list = items.map(d => {
        if (d.is_alter) {
          const alter = applyFilters({
            key: 'Find',
            path: 'items__combo_alters',
            params: {
              // combo_size: detail.item,
              alter_item: d.item
            }
          })
          const comboItem = applyFilters({
            path: `items__combo.data.${alter.combo_item}`,
          })

          return { main: comboItem.item, id: d.item, price: d.price, old: d.item }
        }
        else {
          return { main: d.item, id: d.item, old: d.item }
        }
      })
    }
    else {
      const comboItems = applyFilters({
        key: 'Filter',
        path: 'items__combo',
        params: {
          combo_size: price.id
        }
      })

      list = map(comboItems, d => {
        return { main: d.item, id: d.item }
      })
    }
    list = list.reduce((o, d) => ({ ...o, [d.main]: d }), {})
    return list

  }
  viewComboItems = () => {
    const { active, price : mainPrice } = this.props
    const prices = applyFilters({
      key: 'picking',
      reduxName: 'items__prices',
      select: 'id'
    }, this.state.choosen)
   
    const selesItems = applyFilters({
      key: 'picking',
      reduxName: 'items__sales_items',
      select: 'sales_item'
    }, prices)
    return <> {
      map(this.state.choosen, (d, index) => {
        const comboItem = applyFilters({
          key: 'Find',
          path: 'items__combo',
          params: {
            item: d.main,
            combo_size: mainPrice.id
          }
        })
        const price = get(prices, d.id, '')
        const item = get(selesItems, price.sales_item, '')
        if (!comboItem.has_alter)
          return <button type='button' onClick={this.activeItem.bind(this, '')} key={index} className={classes.disabled}>{item.name} </button>
      })} {map(this.state.choosen, (d, index) => {
        const comboItem = applyFilters({
          key: 'Find',
          path: 'items__combo',
          params: {
            item: d.main,
            combo_size: mainPrice.id
          }
        })
        const price = get(prices, d.id, '')
        const item = get(selesItems, price.sales_item, '')
        if (comboItem.has_alter)
          return <button type="button" key={index} className={d.main == active ? classes.active : d.main != d.id ? classes.alter : ''}
            onClick={this.activeItem.bind(this, d.main)}>{item.name}</button>
      })}
    </>

  }
  setChoosen = (alter) => {
    let list = { ...this.state.choosen }
    if (!get(alter, 'item', false)) {
      const comboItem = applyFilters({
        path: `items__combo.data.${alter.combo_item}`,
      })
      list[comboItem.item] = { ...this.state.choosen[comboItem.item], id: alter.alter_item, price: alter.price_variance }

      this.setState({ choosen: list }, () => {
      })
    }
    else {
      list[alter.item] = { ...this.state.choosen[alter.item], id: alter.item, price: 0 }
      this.setState({ choosen: list })
    }
  }
  setAlter=(alter)=>{
    let list = { ...this.state.choosen }
    const comboItem = applyFilters({
      path: `items__combo.data.${alter.combo_item}`,
    })
    // console.log('list', list)
    if(isArray(list[comboItem.item].id) &&list[comboItem.item].id.length < comboItem.quantity ){
      // console.log('iam in right condition', [...list[comboItem.item].id, {id:alter.alter_item,price: alter.price_variance}])
      list[comboItem.item] = { ...this.state.choosen[comboItem.item],
         id:  [...list[comboItem.item].id, {id:alter.alter_item,price: alter.price_variance}] }
    }
    else if(!isArray(list[comboItem.item].id) ){
      console.log('in first')
      list[comboItem.item] = { ...this.state.choosen[comboItem.item],
        id: [{id:alter.alter_item,price: alter.price_variance }] }
    }
    this.setState({ choosen: list }, () => {
      console.log('state===>',this.state.choosen)
    })
  }
  render() {
    const { handleChange, back } = this.props
   
    return (
      <div className={classes.container}>
        <div className={classes.comboContaimer}>
          <Header back={back}></Header>
          <div className={classes.combo}>{this.viewComboItems()}</div>
      <Alters setChoosen={this.setChoosen} list={this.state.choosen} setAlter={this.setAlter}></Alters>
        </div>
        <Footer list={this.state.choosen} handleChange={handleChange} back={back} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  price: get(state.items__prices.data, state.items__prices.active, ''),
  active: get(state.items__combo, 'active', ''),
  detail: get(state.orders__details.data, state.orders__details.active, false),
})

export default connect(mapStateToProps, mapDispatchToProps)(Combo)