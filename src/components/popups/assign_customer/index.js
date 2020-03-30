import React, { Component } from 'react'
import { get, map, keys} from 'lodash'
import { connect } from 'react-redux'
import classes from './style.less'
import { withRouter } from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import Paging from 'components/paging'
import {withTranslation} from 'react-i18next'

class Customers extends Component {
  state={
    page: 1
  }
  constructor(props){
    super(props);
    this.customers = this.getCustomer()
  }
  getCustomer=()=>{
    return applyFilters({
      path:'parties__customer.data',
    })    
  }
 assign=(customer)=>{
   const{ onClick, onCancel} = this.props
   onClick(customer.id)
   onCancel()
 }
  renderTables() {
    const {page} = this.state
    return map((this.customers), (customer, key) => (
      <button key={key} onClick={this.assign.bind(this, customer)}>{customer.name}</button>
    )).slice(8 * (page - 1), 8 * page) 

  }
  handelPageClick = (op) => {
    const { page } = this.state
    let pageMax = Math.ceil((keys(this.customers) || []).length / 8)
    if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
        this.setState({ page: page + op })
    }
  }
  render() {

    const {page}=  this.state
    const {t} = this.props
    let pageMax = Math.ceil((keys(this.customers) || []).length / 8)
    return (
      <div className={classes.moveSeatContiner}>
        <p className={classes.seatTitle}>{t("choose customer")}</p>
        <div className={classes.header}>
            <Paging {...{page, pageMax}} handelPageClick={this.handelPageClick}/>
        </div>
        <div className={classes.btnsContainer}>
          {this.renderTables()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  table: get(state.dinin__tables.data, state.dinin__tables.active, {}),
})


export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withRouter(Customers)))
