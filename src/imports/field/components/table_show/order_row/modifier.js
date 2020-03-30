import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router'
import { map, max , get} from 'lodash'
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters';
import classes from './style.less';
class Modifier extends Component {

  deletModifier = (id) => {
    const { setMain, pathname, active } = this.props
    if (pathname == '/Home/modifires') {
      setMain('orders__details',
        {
          item: {
            deleted: true,
            action: "update",
            id: id,
            onSuccess() {
              return [
                {type: 'set_main_orders__details', data: {active}}
              ]
            }
          }
        })
    }
  }

  timesAppearance = () => {
    const { pathname } = this.props
    return pathname.includes('modifires')
      && <div className={classes.modifierIcon}>
        <FontAwesomeIcon icon="times"  className={classes.icon}/>
        </div>
  }

  changeQuantity = (id, modifier) => {
    const { setMain, orderItem, pathname } = this.props
    pathname.includes('modifires') &&
      setMain('orders__details',
        {
          item: {
            action: "update",
            id: id,
            quantity: max([modifier.quantity - 1, 1]),
            onSuccess() {
              return [
                {type: 'set_main_orders__details', data: {active: orderItem.id}}
              ]
            }
          }
        })
  }

  minusAppearence = () => {
    const { history } = this.props
    if(history.location.pathname.includes('modifires'))
      return <div className={classes.modifierIcon}>
         <FontAwesomeIcon icon="minus"  className={classes.icon}/>
      </div>
    else return '(M)'

  }
  // eslint-disable-next-line class-methods-use-this
  getWithPath(path, show) {
    return applyFilters({
      key: 'GetDataSelector',
      path,
      show
    })
  }
  getItemDatas(orderItem) {
    const size = this.getWithPath('items__prices', orderItem.item);
    return {
      price: size,
      item: this.getWithPath("items__sales_items", size.sales_item),
    }
  }
  getModifiers(){
    const { orderItem, field } = this.props;
    this.modifiers = applyFilters({
      key: "Filter",
      params: {
        parent: orderItem.id
      }
    }, field.value)
    return this.modifiers
  }
  renderModifiers = () => {
    const modifiers = this.getModifiers()
    const {orderItem, modeKey} = this.props
    return map(modifiers, (modifier, key) => {
      let {item } = this.getItemDatas(modifier)
      return <tr key={key} id={key} className={classes.modifier}>
        <td
          onClick={this.changeQuantity.bind(this, modifier.id, modifier)}>
         {this.minusAppearence()}
        </td>
        <td>{ `${orderItem.quantity} x ${modifier.quantity} \xa0 \xa0 ${item.name}`} </td>
        <td></td>
        <td>{modeKey=='TW'&&modifier.price}</td>
        <td>{modifier.price * modifier.quantity * orderItem.quantity}</td>
        <td
          onClick={this.deletModifier.bind(this, modifier.id)}>
          {this.timesAppearance()} 
        </td>
      </tr>
    })
  }

  render() {
    return (
      this.renderModifiers()
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    pathname: props.history.location.pathname,
    modeKey: get(get(state.settings__mode.data, state.settings__mode.active,'') , 'key', ''),
  }
}

const wrapper = connect(mapStateToProps, mapDispatchToProps)(Modifier)

export default withRouter(wrapper)
