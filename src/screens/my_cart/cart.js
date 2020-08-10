import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map,get} from 'lodash'
import { withTranslation } from 'react-i18next'
import mapDispatchToProps from 'helpers/actions/main'
import Nested from './nested_collapse/collapse'


class Content extends Component {
  getCalculations = () => {
    const { details } = this.props;
    let sum_all = 0
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
  pay =()=>{
    const{history}= this.props
    history.push('./payment')
  }
  renderOrders = () => {
    const {history, activeDetail } = this.props;
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
        <Nested cart={true}/>
        {this.getCalculations()}
        <div className={classes.btnCont}>
          <button type='button' onClick={history.goBack.bind(this)}>Back</button>
          <button type='button' onClick={this.pay}>Pay</button>

        </div>
      </div>
    );
  }

  render() {
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
