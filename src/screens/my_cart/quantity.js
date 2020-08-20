import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map, get, toArray, sumBy, isEmpty, filter } from 'lodash'
import { withTranslation } from 'react-i18next'
// import Collapse from './collapse'
import mapDispatchToProps from 'helpers/actions/main'
import Nested from './nested_collapse/collapse'

class Content extends Component {
  state = {

    test: {},
    show: {},
    qtn: 1

  }
  handelClick = (action) => {
    if (action === "-") {
      this.setState({
        qtn: this.state.qtn - 1
      })
    }
    else {
      this.setState({
        qtn: this.state.qtn + 1
      })

    }
  }
  setButton = (qtn) => {
    if (qtn === 1) {
      return true;
    }
    return false;
  }
  getItemTotal() {
    const { details } = this.props;
    let sum_all = 0
    map(details, (d) => {
      console.log(details,"hhhhhytyutyu")
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
    const { history, appendPath, activeDetail, details } = this.props
    const { qtn } = this.state
    history.push('/order')
    appendPath('form_actions', `details.${[activeDetail.id]}`, { quantity: qtn ,add:true})
     map(filter(details,d=>d.parent==activeDetail.id),detail=>{
      appendPath('form_actions', `details.${[detail.id]}`, {add:true})

     })


  }
  renderOrders = () => {
    const { details, history, activeDetail } = this.props;
    const { qtn } = this.state
    return (
      <div className={classes.allcon}>
        <div className={classes.above}>
          {/* <button onClick={history.goBack.bind(this)}>
            <FontAwesomeIcon icon="arrow-left" className={classes.icon} />
          </button> */}
          <p className={classes.header}>{activeDetail.name}-{activeDetail.size}</p>
        </div>
        <div className={classes.itemTo}>
          <p ></p>
          <p>Each</p>
          <p>Total</p>
        </div>
        <Nested/>
        {this.getItemTotal()}
        <p className={classes.header}>Edit Item Details</p>
        <div className={classes.incrementer}>
          <button
            disabled={this.setButton(qtn)}
            className={classes.minus}
            onClick={() => this.handelClick("-")}
          >-</button>
          <div className={classes.qantity}>{ activeDetail.quantity}</div>
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
    if (!isEmpty(details)) {
      return (
        <div>
          {this.renderOrders()}
        </div>
      )
    }
    else
      return <p>No Details</p>
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
