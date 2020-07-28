import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map, filter, omit, get, toArray, sumBy } from 'lodash'
import { withTranslation } from 'react-i18next'
import applyFilters from 'helpers/functions/filters';
import details from '../../helpers/components/table/details';
import Edit from "../../assets/images/edit.png";
import Collapse from './collapse'
import mapDispatchToProps from 'helpers/actions/main'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setMain } from '../../helpers/actions/main';

class Content extends Component {
  state = {
    test: 'v',
    show: false,
    qtn: 1

  }
  handelClick = (action) => {
    const { setMain, cart } = this.props;
    const { qtn } = this.state
    if (action === "-") {
      this.setState({
        qtn: this.state.qtn - 1
      })
      //   appendPath( 'form_actions',`details.${[activeDetail.id]}`,{quantity:qtn})

      // setMain("cart", { item: { ...cart, item: { ...cart.item, base_qtn: cart.item.base_qtn - 1 } } })

    }
    else {
      this.setState({
        qtn: this.state.qtn + 1
      })
      //   appendPath( 'form_actions',`details.${[activeDetail.id]}`,{quantity:qtn})

      // setMain("cart", { item: { ...cart, item: { ...cart.item, base_qtn: cart.item.base_qtn + 1 } } })
    }
  }
  setButton = (qtn) => {
    if (qtn === 1) {
      return true;
    }
    return false;
  }
  handelDelete(d) {
    console.log("hnaaaaaaa", "ddddddddd")
    const { setMain } = this.props
    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: '',
        first_msg: `Are you sure you want to delete ${d.quantity} x ${d.item_name}`,
        pressYes: () => this.deleteCart(d)
      }
    }
    setMain('popup', { popup })
  }
  deleteCart = (d) => {
    const modifiers = filter(details, v => v.parent == d.id)
    console.log(modifiers, "moddddiiii", d)
    const { cart, history, setMain, details, setAll, appendPath } = this.props
    setAll([
      { type: 'set_main', app: 'popup', data: { popup: {} } },
      { type: 'set_main', app: 'form_actions', data: { details: { [d.id]: {} } } },
      {
        type: 'set_main', app: 'form_actions', data: {
          details:
            map(details, n => { n.parent ? [n.id] : {} })
        }
      },
      { type: 'set_main', app: 'form_actions', data: { CartStatus: false } }
    ])
    history.push('/order')

  }
  handelEdit = (d) => {
    const { history, details, setAll } = this.props
    setAll([
      { type: 'set_main', app: 'form_actions', data: { details: { [d.id]: {} } } },
      {
        type: 'set_main', app: 'form_actions', data: {
          details:
            map(details, n => { n.parent ? [n.id] : {} })
        }
      },
      { type: 'set_main', app: 'form_actions', data: { CartStatus: false } }
    ])
    history.push('/details')
  }
  handeltest = () => {
    if (this.state.test === '^') {
      this.setState({ test: 'v', show: false })
    }
    else {
      this.setState({ test: '^' })
      this.setState({ show: true })
    }
  }
  getItemTotal() {
    const { details } = this.props;
    let sum_all = 0
    map(details, (d) => {
      // console.log(p( sum_all + (d.quantity * d.price)),"hhhhhytyutyu")
      if (!d.removal)
        sum_all += (parseInt(d.quantity) * parseInt(d.price))
    })
    const each = sumBy(toArray(details), 'price')
    return <div className={classes.itemTo}>
      <p>Item total</p>
      <p>{each}</p>
      <p>{sum_all}</p>

    </div>
  }
  goToCart = () => {
    console.log(" hnhnhn")
    const { history, appendPath, activeDetail } = this.props
    const { qtn } = this.state
    history.push('/cart')
    appendPath('form_actions', `details.${[activeDetail.id]}`, { quantity: qtn })

  }
  renderOrders = () => {
    const { details, history , activeDetail} = this.props;
    const { qtn } = this.state
    // console.log(Object.keys(details)[0])
    return (
      <div className={classes.allcon}>
        <div className={classes.above}>
          {/* <button onClick={history.goBack.bind(this)}>
            <FontAwesomeIcon icon="arrow-left" className={classes.icon} />
          </button> */}
          <p className={classes.header}>{activeDetail.item_name}-{activeDetail.size}</p>
        </div>
        <div className={classes.itemTo}>
          <p ></p>
          <p>Each</p>
          <p>Total</p>
        </div>
        {map(details, (d, v) => {

          if (d.id) {
            return (
              <div className={classes.cart}>

                <div className={classes.items}>
                  {!d.parent &&
                    <>
                      <div className={classes.name}>

                        <button className={classes.miniBtn} onClick={() => this.handelEdit(d)}>
                          <img src={Edit} className={classes.editImg} />
                        </button>
                        <button type='button' className={classes.miniBtn} onClick={this.handelDelete.bind(this, d)}>X</button>
                        <button type='button' className={classes.qtn}>{d.quantity}</button>
                        <p>{d.item_name} - {d.size}</p>
                        <button type='button' onClick={this.handeltest} className={classes.showMore}>{this.state.test}</button>
                      </div>
                      <p className={classes.et}>{d.price}</p>
                      <p >{(d.quantity * d.price)}</p>
                      <p className={classes.note} style={{ visibility: this.state.show ? 'visible' : 'hidden' }}>Each haveing</p>

                    </>}

                  {d.parent && <Collapse history={this.props.history} d={d} show={this.state.show} />}

                </div>
              </div>
            );
          }
          else
            return <></>
        })}
        {this.getItemTotal()}
        <p className={classes.header}>Edit Item Details</p>
        <div className={classes.incrementer}>
          <button
            disabled={this.setButton(qtn)}
            className={classes.minus}
            onClick={() => this.handelClick("-")}
          >-</button>
          <div className={classes.qantity}>{qtn}</div>
          <button
            className={classes.plus}
            onClick={() => this.handelClick("+")}
          >+</button>
        </div>
        <div className={classes.btnCont}>
          <button type='button' onClick={history.goBack.bind(this)}>Back</button>
          <button type='button' onClick={this.goToCart}>Add to Cart</button>

        </div>
      </div>
    );
  }
  render() {
    const { details } = this.props
    return (
      <div>
        {this.renderOrders()}
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  mode: get(state, 'form_actions.mode', {}),
  CartStatus: get(state, 'form_actions.CartStatus', false),
  details: get(state.form_actions, 'details', {}),
  data: state.form_actions,
  activeDetail: get(state.form_actions.details, state.form_actions.active),

})
const wrapper = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Content))

export default withRouter(wrapper)
