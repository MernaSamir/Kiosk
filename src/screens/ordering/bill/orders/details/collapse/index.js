import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import mapDispatchToProps from 'helpers/actions/main'
import { get, pickBy, find} from 'lodash'
import $ from "jquery"
import classes from './style.less';
import {applyPermissions} from 'helpers/permissions'
import  {withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters';
import golbalClasses from 'screens/ordering/bill/style.less'
import {seat} from 'components/seat_name'

class Collapse extends Component {
  state = {
    display: 'none',
    transform: "rotate(180deg)",
    transitionDuration: ".4s",
    clickedClass: ""
  }
 
  handleCollapseClick = () => {
    const { seat_num, setMain, history } = this.props
    if(history.location.pathname == '/home')
      setMain('orders__details', { item: { seat_num }, active: '', orderPopup: '' })
    if (this.state.display == 'none') {
      this.setState({
        display: 'block',
        transform: "rotate(0deg)",

      })
    }
    else {
      this.setState({
        display: 'none',
        transform: "rotate(180deg)",
      })
    }
  }
  seatOptions = (seat_num) => {
    const { setMain, active, orderPopup, activeDetail, history } = this.props
    if (orderPopup && seat_num == active && !activeDetail) {
      setMain('orders__details', { orderPopup: '', active: "" })
    }
    else if(history.location.pathname == '/home'){

      let collapseDiv2 = $(`.${golbalClasses.bill}`).offset()
      setMain('orders__details', { orderPopup: {show:'show', top:collapseDiv2.top+20}, item: { seat_num }, active: "" })
    }



  }
  getName=()=>{
    const { receipt, seat_num, order } = this.props
    if(seat_num==0){
      return this.props.name
    }
    const name = seat(seat_num, order, 'Seat')
      return `${name}  ${get(receipt,'invoice') || ''}`
    
  }

  render() {
    const { name, id, active, seat_num, receipts, receipt } = this.props
    const avail = applyPermissions({seat_num}, {'not_included_list':{key:'seat_num',list:"receipts"}},{receipts})

    return (
      <section className={classes.collapseContainer}>

        <section className={active == seat_num ?`${classes.collapseRowClicked} `: `${classes.collapseRow} ` + id}>

          <section className={classes.flex} onClick={this.handleCollapseClick.bind(this)}>
            <p className={classes.collapse_name}>{this.getName()}</p>
            <section className={classes.icon}>
            {receipt && <FontAwesomeIcon className={classes.dollarIcon} icon="print" />}
            {get(receipt,'invoice', false) && <FontAwesomeIcon className={classes.dollarIcon} icon="dollar-sign"/>}
            
            <FontAwesomeIcon
              style={{
                transform: this.state.transform,
                transitionDuration: this.state.transitionDuration
              }}
              className={classes.collapse_icon} icon="caret-down"
            />
            </section>
          </section>
          <button className={classes.button_icon}>
          {name != 'Shared Order'&& avail&&
                <FontAwesomeIcon icon={"bars"} className={classes.tableIcon}   onClick={this.seatOptions.bind(this, seat_num)}/>
            }
          </button>
        </section>
        <section style={{ display: this.state.display }}>
          {this.props.children}
        </section>
      </section>

    )
  }
}

const mapStateToProps = (state, props) => ({
  active: get(state.orders__details, 'item.seat_num', {}),
  orderPopup: get(state.orders__details, 'orderPopup', {}),
  activeDetail: get(state.orders__details, 'active', {}),
  get receipts () {return pickBy(state.orders__receipt.data, {order:props.order}) },
  get receipt(){return find(this.receipts,d=>d.seats.includes(props.seat_num))}
})


export default connect(mapStateToProps, mapDispatchToProps)( withRouter(Collapse) )
