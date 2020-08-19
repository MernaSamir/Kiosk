/* eslint-disable no-invalid-this */
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import Sub from './sub'
import { map, get, isEmpty, filter, omit } from 'lodash'
import { withTranslation } from 'react-i18next'
import { Collapse } from 'antd';
import classes from './menu_style.less'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Edit from "../../../assets/images/edit.png";

// const Panel = Collapse.Panel;

class Content extends Component {
  state = {

    test: {},
    show: {},
    qtn: 1

  }
  handelDelete(d, type) {
    const { setMain } = this.props
    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: '',
        first_msg: `Are you sure you want to delete ${d.quantity} x ${d.name}`,
        pressYes:type=='item'?  this.deleteCart(d):this.deletemodifer(d)
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

    isEmpty(details)&& history.push('/order')


  }
  deletemodifer = (d) => {
    const { setMain, appendPath, details, setAll } = this.props
    setAll([
      { type: 'set_main', app: 'popup', data: { popup: {} } },
      { type: 'set_main', app: 'form_actions', data: { details: omit(details, d.id) } },
      { type: 'set_main', app: 'form_actions', data: { CartStatus: false } }

    ])
    appendPath("form_actions", `details.${[d.id]}`, {});
    this.setState({show: { ...this.state.show, [d]: false }})
  }
  handeltest(v) {
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
  submenuListLoop = () => {
    const { details, data_filter,cart } = this.props
    return <div className={classes.allcon}>
      {map(filter(details, d => d.parent == data_filter), (d, index) => {

        const modif = filter(details, m => m.parent == d.id)
        if (!isEmpty(modif)) {
          return (
            <div className={classes.cart}>
              <div className={classes.items}>
                <div className={classes.name}>

                  <button className={classes.miniBtn} onClick={() => this.handelEdit(d)}>
                    <img src={Edit} className={classes.editImg} />
                  </button>
                  <button type='button' className={classes.miniBtn} onClick={this.handelDelete.bind(this, d, 'item')}>X</button>
                  {/* <Collapse>
              <Panel header={d.name} className={classes.customPanelStyle} > */}
                  <button type='button' className={classes.qtn}>{d.quantity}</button>
                  <p className={classes.item}>{d.name} - {d.size}</p>
                  <button type='button' onClick={this.handeltest.bind(this, index)}
                    className={classes.showMore}>{this.state.test[index] || 'v'}</button>
                </div>
                <p className={classes.et}>{d.price}</p>
                <p >{(d.quantity * d.price)}</p>
               {data_filter==null&& <p className={classes.note}
                  style={{ visibility: this.state.show[index] ? 'visible' : 'hidden' }}>Each haveing</p>}
                {this.state.show[index] &&

                  <Sub index={1}
                    key={index}
                    eSub={d}
                    title={d.name}
                    Child={wrapper}
                    modifs={modif}
                    paddLeft='10%' />}
                {/* </Panel>
            </Collapse> */}
              </div>
            </div>
          )

        }
        else {
          if (!d.removal) {
            return (
              <div className={classes.modfcont}>
                <div className={classes.flex}>
                  <div className={classes.modfir}>
                    <button className={classes.cancel} onClick={this.handelDelete.bind(this, d,'mod')}>x</button>
                   {!get(d,"parent",false)&& <button className={classes.cancel} onClick={() => this.handelEdit(d)}>
                    <img src={Edit} className={classes.editImg} />
                  </button>}
                    <p>{d.quantity} x {d.name}</p>
                  </div>
                  <p className={classes.et}>{d.price}</p>
                  <p > {d.quantity ? d.price * d.quantity : d.price}</p>
                </div>
              </div>
            )
          }
          else
            return (
              <div className={classes.modfcont}>
                <div className={classes.flex}>
                  <div className={classes.modfir}>
                    {<button className={classes.cancel} onClick={this.handelDelete.bind(this, d,'mod')}>x</button>}
                    {<p style={{ marginRight: "1%" }}>NO</p>}

                    <p>{d.name}</p>
                  </div>
                </div>
              </div>
            )

        }


      })}
    </div>
  }
  render() {
    return this.submenuListLoop()


  }
}
const mapStateToProps = (state, props) => ({
  mode: get(state, 'form_actions.mode', {}),
  CartStatus: get(state, 'form_actions.CartStatus', false),
  details: get(state.form_actions, 'details', {}),
  data: state.form_actions,
  data_filter: props.data_filter || null,
  activeDetail: get(state.form_actions.details, state.form_actions.active),

})
const wrapper = withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Content)))
export default wrapper
