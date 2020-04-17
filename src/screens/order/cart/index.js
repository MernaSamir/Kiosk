import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, isEqual, map ,omit} from "lodash";
import { connect } from "react-redux";
import Edit from "../../../assets/images/edit.png";
import mapDispatchToProps from "helpers/actions/main";
import uuid from 'uuid/v4'
import {array_to_obj} from 'helpers/functions/array_to_object'
import cons from "gun";
import quantity_button from "../../../imports/field/components/event_menu/components/bill/orders/details/order_row/quantity_button";

class Cart extends Component {

  handelEdit =(data)=>{
    const {setMain,history,carts}=this.props
    setMain('cart',{item:data})
    setMain('cart',{data:omit(carts,data.id)})
    history.push('/details')
    console.log(data)

  }
  handelDelete =(data)=>{
    const { setMain } = this.props
    const popup = {
        type: 'CancelCustomer', visable: true, width: "50%",
        childProps: {
            Title: '',
            first_msg : `Are you sure you want to delete ${data.qtn} x ${data.name}` ,
            pressYes : ()=>this.deleteCart(data)
          }
    }
  setMain('popup', { popup })
}
deleteCart=(data)=>{
  const {setMain,carts}=this.props
  setMain('popup',{popup:{}})
  setMain('cart',{data:omit(carts,data.id)})
}
  renderOrders = () => {
    const { carts } = this.props;
    if (isEmpty(carts)) {
      return <div className={classes.empty}>Your cart is empty</div>;
    } else {
      return map(carts, (d, v) => {
        return (
          <div className={classes.cart}>
            <button className={classes.miniBtn} onClick={()=>this.handelEdit(d)}>
              <img src={Edit} className={classes.editImg} />
            </button>
            <button className={classes.miniBtn} onClick={()=>this.handelDelete(d)}>X</button>
            <button className={classes.qtn}>{d.qtn}</button>
            {d.name} - {d.unit}
            <button className={classes.showMore}>V</button>
            <div className={classes.price}>EGP{d.qtn * d.price}</div>
          </div>
        );
      });
    }
  };
  handelCheckOut = () => {
    const {station,mode,shift,UpdateModels,}=this.props
    const main_id=uuid()
    

      const data= {'orders__main':[{
              id:main_id,
              station:station,
              mode:mode,
              start_time: new Date(),
              shift:shift
      }],
      'orders__details':this.getOrderDetails(main_id)
     }
     const success=(res)=>{
        const {history,appendPath,setMain}=this.props
        map(res,(d,v)=>{
          setMain(v,{active:d[0].id})
          d=array_to_obj(d)
          // console.log(d)
          appendPath(v, 'data',d);
        })
        history.push("/cart");
        return[]
     }
     UpdateModels(data,success)
  };
  getOrderDetails=(order)=>{
    const {carts}=this.props;
    let details=[]
    map(carts,(d,v)=>{
      const detailsID =uuid()
      if(d.item){
        details.push({
          id:uuid(),
          parent:detailsID,
          order:order,
          item:d.item.item,
          price:d.item.price,
          quantity:d.item.qtn
        })
      }
       details.push({
        id:detailsID,
        order:order,
        item:d.id,
        price:d.price,
        quantity:d.qtn
      })
    })
    console.log(details)
    return details;
  };
  render() {
    const { carts, currentMode } = this.props;
    console.log("current mode", currentMode);
    return (
      <div className={classes.container}>
        <div className={classes.header}>
          My cart - {isEqual(currentMode, "Dine In") ? "Eat in" : currentMode}
        </div>
        <div>{this.renderOrders()}</div>
        {!isEmpty(carts) && (
          <div className={classes.btns}>
            <button onClick={this.handelCheckOut} className={classes.checkOut}>
              Checkout
            </button>
            <button className={classes.cancel}>Cancel</button>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  shift:get(state.orders__shifts,"active",undefined),
  mode: get(state.settings__mode,"active",undefined),
  station: get(state.licensing__station,"active",undefined),
  carts: get(state.cart, "data", {}),
  currentMode: get(
    state.settings__mode.data,
    get(state, "settings__mode.active", ""),
    ""
  ).name,
});
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
