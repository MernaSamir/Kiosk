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

const Panel = Collapse.Panel;

class Content extends Component {
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
  submenuListLoop = () => {
    const { details, t, modifs } = this.props
    return map(details, (d, index) => {
      const modif = filter(details, m => m.parent == d.id)
      if (!isEmpty(modif)) {

        return (
          <>
            <button className={classes.miniBtn} onClick={() => this.handelEdit(d)}>
              <img src={Edit} className={classes.editImg} />
            </button>
            <button type='button' className={classes.miniBtn} onClick={this.handelDelete.bind(this, d)}>X</button>
            <Collapse>
              <Panel header={d.name} className={classes.customPanelStyle} >

                <Sub index={1}
                  key={index}
                  eSub={d}
                  title={d.name}
                  Child={wrapper}
                  modifs={modifs}
                  paddLeft='10%' />
              </Panel>
            </Collapse>
          </>
        )

      }
      else {
        if (!d.removal) {
          return (
            <div className={classes.modfcont}>
              <div className={classes.flex}>
                <div className={classes.modfir}>
                  {<button className={classes.cancel} onClick={this.DeleteMod.bind(this, d)}>x</button>}
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
                  {<button className={classes.cancel} onClick={this.DeleteMod.bind(this, d)}>x</button>}
                  {<p style={{ marginRight: "1%" }}>NO</p>}

                  <p>{d.name}</p>
                </div>
              </div>
            </div>
          )

      }


    })
  }


  // renderExtra = (d, k) => {
  //   if (!d.removal) {
  //     return (
  //       <div className={classes.modfcont}>
  //         <div className={classes.flex}>
  //           <div className={classes.modfir}>
  //             {<button className={classes.cancel} onClick={this.DeleteMod.bind(this, d)}>x</button>}
  //             <p>{d.quantity} x {d.name}</p>
  //           </div>
  //           <p className={classes.et}>{d.price}</p>
  //           <p > {d.quantity ? d.price * d.quantity : d.price}</p>
  //         </div>
  //       </div>
  //     )
  //   }
  //   else
  //   return (
  //     <div className={classes.modfcont}>
  //       <div className={classes.flex}>
  //         <div className={classes.modfir}>
  //         {<button className={classes.cancel} onClick={this.DeleteMod.bind(this, d)}>x</button>}
  //         {<p style={{marginRight:"1%"}}>NO</p>}

  //           <p>{d.name}</p>
  //         </div>
  //       </div>
  //     </div>
  //   )

  // }
  render() {
    return this.submenuListLoop()


  }
}
const mapStateToProps = (state) => ({
  mode: get(state, 'form_actions.mode', {}),
  CartStatus: get(state, 'form_actions.CartStatus', false),
  details: get(state.form_actions, 'details', {}),
  data: state.form_actions
})
const wrapper = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Content))
export default withRouter(wrapper)
