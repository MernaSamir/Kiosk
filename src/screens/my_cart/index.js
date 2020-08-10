import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';;
import { map, get, isEmpty, filter, omit, toArray } from 'lodash'
import { withTranslation } from 'react-i18next'
import classes from './style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Edit from "../../../assets/images/edit.png";
import Quantity from './nested_collapse/collapse'
import Cart from './cart'
 class Index extends Component {
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
    
        // history.push('/order')
    
        0
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
      DeleteMod(d) {
        const { setMain } = this.props
        const popup = {
          type: 'CancelCustomer', visable: true, width: "50%",
          childProps: {
            Title: '',
            first_msg: `Are you sure you want to delete ${d.quantity} x ${d.name}`,
            pressYes: () => this.deletemodifer(d)
          }
        }
        setMain('popup', { popup })
      }
    
      deletemodifer = (d) => {
        const { setMain, appendPath, details, setAll } = this.props
        setAll([
          { type: 'set_main', app: 'popup', data: { popup: {} } },
          { type: 'set_main', app: 'form_actions', data: { details: omit(details, d.id) } },
          { type: 'set_main', app: 'form_actions', data: { CartStatus: false } }
    
        ])
        appendPath("form_actions", `details.${[d.id]}`, {});
        this.setState({ show: false })
      }
      handeltest(v) {
        console.log(this.state, "stttt")
        const { test, show } = this.state
    
        if (show[v]) {
          this.setState({ test: { ...this.state.test, [v]: 'v' }, show: { ...this.state.show, [v]: false } })
        }
        else {
          this.setState({ test: { ...this.state.test, [v]: '^' }, show: { ...this.state.show, [v]: true } })
    
          // this.setState({ test: '^' })
          // this.setState({ show: true })
        }
      }
    render() {
        const { history } = this.props
      return  <div className={classes.allcon}>
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
        {history.location.pathname.includes('quantity')? <Quantity/>:<Cart/>}
       </div>
        )
    }
}
export default withRouter(Index)