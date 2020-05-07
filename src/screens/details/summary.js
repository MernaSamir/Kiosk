import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isEmpty, omit } from 'lodash'
import applyFilters from "helpers/functions/filters";
import Edit from "../../assets/images/edit.png";
import { withRouter } from 'react-router'
class Summary extends Component {
  

  getSummary = () => {

    const { cart } = this.props;
    return (
      !isEmpty(cart) && <div className={classes.summary}>
        <div className={classes.stdiv}>
          <div className={classes.devicons}>
            <button className={classes.miniBtn} onClick={this.handelEdit}>
              <img src={Edit} className={classes.editImg} />
            </button>
            <p> {cart.name} - {cart.unit}</p>
          </div>
          <p> {cart.price}</p>
        </div>
        {!isEmpty(cart.item) && <div className={classes.stdiv}>
          <div className={classes.devicons}>
            <button onClick={this.removeModifiers} className={classes.miniBtn}>x </button>
            <button className={classes.miniBtn} style={{margin:0}}>{cart.item.base_qtn}</button>
            <p> {cart.item.name} </p>
          </div>
          <p> {cart.item.price}</p>

        </div>}
      </div>
    )

  }
  handelEdit = () => {
    const { history } = this.props;
    console.log(this.props)
    history.push('/details')
  }
  removeModifiers = () => {
    const { setMain, cart } = this.props
    const data = omit(cart, 'item')
    // setMain ('cart',{item:{...cart,item:{}}})
    setMain('cart', { item: { ...data } })
  }

  render() {
    const { cart , margin } = this.props
    return (
      <div className={classes.devContainer} style={{margin}}>
        <div className={classes.head}>
          Summary
                  {cart && <p>EGP</p>}
        </div>
        {this.getSummary()}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  cart: get(state.cart, 'item', {})


});
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Summary));

