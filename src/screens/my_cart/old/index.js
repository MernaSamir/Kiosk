import React, { Component } from "react";
import { Collapse } from 'antd';
import classes from "./style.less";
// import Edit from "../../../../assets/images/edit.png";
import Edit from "../../../assets/images/edit.png"
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get, omit, filter, map } from 'lodash'
class Collapsee extends Component {

  editModifiers = (data) => {
    // const {setMain,history,carts}=this.props
    // setMain('cart',{item:data})
    // setMain('cart',{data:omit(carts,data.id)})
    // history.push('/modifier')
  }
  DeleteMod(d) {
    const { setMain } = this.props
    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: '',
        first_msg: `Are you sure you want to delete ${d.quantity} x ${d.modifier_name}`,
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

  rendermodifiers = (d) => {
    const{cart, modifs} =this.props
    console.log("modddddd",modifs)
    // return map(modifs,(n)=>{
    if (!d.removal) {
      return (
        <div className={classes.modfcont}>
          <div className={classes.flex}>
            <div className={classes.modfir}>
              {!cart&&<button className={classes.cancel} onClick={this.DeleteMod.bind(this, d)}>x</button>}
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
          {!cart&&<button className={classes.cancel} onClick={this.DeleteMod.bind(this, d)}>x</button>}
          {cart&&<p style={{marginRight:"1%"}}>NO</p>}

            <p>{d.name}</p>
          </div>
        </div>
      </div>
    )
 // })

  }
  render() {
    const { show ,d} = this.props
    return (
      <>
        {show && this.rendermodifiers(d)}
      </>

    );
  }

}
const mapStateToProps = (state) => ({
  details: state.form_actions.details,
  // get(state,"orders__details.active",''),{}),

});
export default connect(mapStateToProps, mapDispatchToProps)(Collapsee);