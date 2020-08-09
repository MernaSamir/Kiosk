import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map, filter, isEmpty } from 'lodash'
import { withTranslation } from 'react-i18next'
import applyFilters from 'helpers/functions/filters';
import details from '../../helpers/components/table/details';
import Edit from "../../assets/images/edit.png";
import Collapse from './collapse'
import { array_to_obj } from 'helpers/functions/array_to_object'
import mapDispatchToProps from 'helpers/actions/main'
class Content extends Component {
  state = {
    test: 'v',
    show: false
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
  goBack = () => {
    s
    const { history } = this.props;
    history.goBack();

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
  // getItemPrice(id){
  //   const modifiers = applyFilters({
  //     key: 'Filter',
  //     path: 'form_actions',
  //     params: {
  //       parent: id
  //     }
  //   })
  // }
  getCalculations = () => {
    const { details } = this.props;

    let sum_all = 0
    if (!isEmpty(details)) {
      map(details, (d) => {
        if (!d.removal)
          sum_all += (parseInt(d.quantity) * parseInt(d.price))
      })
      return <div className={classes.calcu}>
        <p>{`Sub-total  ${sum_all}`}</p>
        <p>Service Charges</p>
        <p>VAT</p>
        <p>Grand Total {' '}</p>

      </div>
    }
  }
  renderOrders = () => {
    const { details } = this.props;
    console.log(details, "deeeee")
    return (
      <div className={classes.orderContainer}>
        <div className={classes.eacht}> <p>Each</p>
          <p>Total</p>
        </div>
        {map(details, (d, v) => {
          if (d && d.id) {
            return (
              <div className={classes.cart}>

                <div className={classes.items}>
                  {!d.parent &&
                    <>
                      <button className={classes.miniBtn} onClick={() => this.handelEdit(d)}>
                        <img src={Edit} className={classes.editImg} />
                      </button>
                      <button type='button' className={classes.miniBtn} onClick={this.handelDelete.bind(this, d)}>X</button>
                      <button type='button' className={classes.qtn}>{d.quantity}</button>
                      <p>{d.item_name} - {d.size}</p>
                      <button type='button' onClick={this.handeltest} className={classes.showMore}>{this.state.test}</button>
                      <p className={classes.et}>{d.price}</p>
                      <p className={classes.et}>{(d.quantity * d.price)}</p>
                      <p className={classes.note} style={{ visibility: this.state.show ? 'visible' : 'hidden' }}>Each haveing</p>

                    </>}

                  {d.parent && <Collapse history={this.props.history} d={d} show={this.state.show} />}

                </div>

                {/* <div className={classes.eacht}> */}
                {/* {(this.getItemPrice())} */}

                {/* </div> */}
              </div>
            );
          }
          else
            return <></>
        })}
        {this.getCalculations()}

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


const wrapper = connect(null, mapDispatchToProps, null)(withTranslation()(Content))

export default withRouter(wrapper)
