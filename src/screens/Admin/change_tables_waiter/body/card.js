import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters';
import { map, pickBy, get, find, isEqual, filter } from 'lodash';
import classes from './../style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Card extends Component {

  state = {
    activecurrent: [],
    page: 1
  }

  notfreetables = applyFilters({
    key: 'Reject',
    path: "dinin__tables",
    params: {
      active: null,
    }
  })

  orders = applyFilters({
    key: 'Filter',
    path: "orders__main",
    params: {
      is_reserved: false,
      end_time: null
    }
  })

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.order, this.props.order)) {
      this.getOrdersWithTableWaiters()
      // this.setState({
      //   activecurrent: []
      // })
      // this.props.assignTables('')
    }
  }

  renderThead = () => {
    const {t} =  this.props
    return <tr>
      <th>{t('Table Name')}</th>
      <th>{t('Status')}</th>
    </tr>
  }

  renderWaiterHeader = () => {
    const { waiter } = this.props
    const { page } = this.state
    const maxPage = Math.ceil(Object.keys(this.getOrdersWithTableWaiters()).length / 5)
    return <div className={classes.header}>
      <p>{`${waiter.first_name} ${waiter.last_name}`}</p>
      {this.startPage(maxPage, page) > 0 && maxPage > 1 && <div className={classes.move_div}>
        {this.renderPagBtns("left", -1)}
        {`${this.startPage(maxPage, page)} of ${maxPage}`}
        {this.renderPagBtns("right", 1)}
      </div>
      }
    </div>
  }

  handelClick = (value) => {
    const { page } = this.state
    const maxPage = Math.ceil(Object.keys(this.getOrdersWithTableWaiters()).length / 5)
    if (!(page <= 1 && value == -1) && !(page >= maxPage && value == 1)) {
      this.setState({
        page: page + value
      })
    }
  }

  renderPagBtns = (type, op) => {
    return <button type="button" onClick={this.handelClick.bind(this, op)} >
      <FontAwesomeIcon icon={`chevron-${type}`} className={classes.icon} />
    </button>
  }

  startPage = (maxPage, page) => {
    if (maxPage == 0) {
      return 0
    }
    return page
  }

  activerow = (element) => {
    const { assignTables } = this.props
    const tmp = [...this.state.activecurrent]
    if (tmp.includes(element.id)) {
      tmp.pop(element.id)
    }
    else {
      tmp.push(element.id)
    }
    this.setState({
      activecurrent: tmp,
    })
    assignTables(element.id)
  }

  getOrdersWithTableWaiters = () => {
    const { waiter } = this.props
    const ordersWaiter = applyFilters({
      key: 'Filter',
      path: "orders__main",
      params: {
        serve: waiter.id,
        end_time: null
      }
    })
    const tableswaiter = pickBy(this.notfreetables, d => map(ordersWaiter, i => i.id).includes(d.active))
    return tableswaiter
  }

  renderWaitersTables = () => {
    const { page } = this.state
    return <>
      {this.renderAssignTr()}
      {map(this.getOrdersWithTableWaiters(), (d) => (
        <tr className={this.renderClassName(d)}
          onClick={this.enableCheck.bind(this, d)}>
          <td>{d.name}</td>
          <td>Open</td>
        </tr>
      )).slice(5 * (page - 1), page * 5)}
    </>
  }

  enableCheck = (element) => {
    const { enableclick, setMain } = this.props
    const table = find(this.notfreetables, { id: element.id })
    const order = find(this.orders, { id: table.active })
    setMain('auths__user', { active: order.serve })
    if (enableclick) {
      return this.activerow(element)
    }
  }

  renderAssignTr = () => {
    const { enableclick, waiter, active_user } = this.props
    return enableclick && active_user &&
      active_user != waiter.id &&
      <tr className={classes.assigntr}
        onClick={this.addTable.bind()}> Assign to this Waiter </tr>
  }

  addTable = () => {
    const { assigntables, waiter, setMain } = this.props
    setMain('auths__user', { active: waiter.id })
    const data = assigntables.map(d => {
      const table = find(this.notfreetables, { id: d })
      const order = find(this.orders, { id: table.active })
      return { ...order, serve: waiter.id }
    })
    setMain('orders__main', {
      item: {
        action: 'bulkEdit', data, onSuccess: this.afterAdd
      }
    })
  }

  afterAdd = (data) => {
    const { waiter } = this.props
    this.setState({
      activecurrent: []
    })
    return data.map(d => (
      {type: 'set_main_orders__main', path: `data.${d.id}.serve`, data: waiter.id}
    ))
  }

  renderClassName = (element) => {
    const { assigntables, enableclick } = this.props
    const bool = assigntables.find(d => d == element.id)
    if (bool && enableclick) {
      return get(classes, 'activetr', '')
    }
  }

  assignAll = () => {
    const { setMain, waiters, waiter } = this.props
    const wOrders = filter(this.orders, { serve: waiter.id })
    setMain('popup', {
      popup: {
        type: 'AssignAllTables', visable: true, width: '50vw',
        border: '1.5px solid #13488b', childProps: {
          waiters, wOrders
        }
      }
    })
  }

  renderTable = () => {
    return <div className={classes.table}>
      <table>
        <thead>{this.renderThead()}</thead>
        <tbody>{this.renderWaitersTables()}</tbody>
      </table>
    </div>
  }

  render() {
    const {t} = this.props

    return (
      <div className={classes.card_container}>
        {this.renderWaiterHeader()}
        {this.renderTable()}
        <div className={classes.assign_btn}>
          <button type="button" onClick={this.assignAll.bind()} >{t('Assign All To')}</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  active_user: get(state.auths__user, 'active', ''),
  waiters: pickBy(get(state.auths__user, 'data', {}), { is_waiter: true })
})

export default connect(mapStateToProps, mapDispatchToProps)(Card);