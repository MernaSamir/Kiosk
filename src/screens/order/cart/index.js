import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, isEqual, map ,omit ,range,filter} from "lodash";
import { connect } from "react-redux";
import Edit from "../../../assets/images/edit.png";
import mapDispatchToProps from "helpers/actions/main";
import Collapse from './collapse'
import uuid from 'uuid/v4'
import {array_to_obj} from 'helpers/functions/array_to_object'
import applyFilters from "helpers/functions/filters";
class Cart extends Component {

  handelEdit =(data)=>{
    const {setMain,history,cart,appendPath,details}=this.props
    setMain('cart',{item:data})
    setMain('cart',{data:omit(cart,data.id)})
    history.push('/details')
  }
  editModifiers =(data)=>{
    const {setMain,history,cart}=this.props
    setMain('cart',{item:data})
    setMain('cart',{data:omit(cart,data.id)})
    history.push('/modifier')
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

deleteModifiers =(data)=>{
  const { setMain } = this.props
  const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
          Title: '',
          first_msg : `Are you sure you want to delete ${data.item.qtn} x ${data.item.name}` ,
          pressYes : ()=>this.deletemodifer(data)
        }
  }
setMain('popup', { popup })
}

deletemodifer=(data)=>{
  const {setMain,appendPath,cart}=this.props
  setMain('popup',{popup:{}})
  setMain('cart',{data:omit(cart,data.id)})
 appendPath("cart", `data.${[data.id]}`,{ ...data,item:{}});
}

deleteCart=(data)=>{
  const {setMain,cart}=this.props
  setMain('popup',{popup:{}})
  setMain('cart',{data:omit(cart,data.id)})
}
renderToalPrice=()=>{
  const { cart } = this.props;
  let total=0
  map(cart,(d,v)=>{
    total += (d.price*d.qtn) +(d.item? (d.item.qtn * d.item.price):0)
  })
  return total ;

}
  renderOrders = () => {
    const { cart } = this.props;
    if (isEmpty(cart)) {
      return <div className={classes.empty}>Your cart is empty</div>;
    } else {
      return map(cart, (d, v) => {
        return (
          <div className={classes.cart}>
            <div className={classes.contanierItems}>
            <button className={classes.miniBtn} onClick={()=>this.handelEdit(d)}>
              <img src={Edit} className={classes.editImg} />
            </button>
            <button className={classes.miniBtn} onClick={()=>this.handelDelete(d)}>X</button>
            <button className={classes.qtn}>{d.qtn}</button>
            {d.name} - {d.unit}
            {!isEmpty(d.item)&&<Collapse history={this.props.history} data={d}/>}
            </div>
            <div className={classes.price}>EGP{(d.qtn * d.price) + (d.item?(d.item.qtn * d.item.price):0)}</div>
          </div>
         
        );
      });
    }
  };

  

  renderCalculations = () => {
    const { history, setMain ,station ,shift ,mode} = this.props;
    const order_id=uuid()
    const sub_mod = applyFilters({
      key: 'Find',
      path: 'settings__sub_mode',
      params: {
        mode:mode
      }
    })
    console.log(sub_mod)
 
    const calc = applyFilters({
        key: 'calculateOrderReceipt',
        order:{id:order_id,
               station:station, 
               shift:shift,
               mode:mode,
               sub_mode:sub_mod.id,
               _type: "loc",
               start_time: "2020-05-12T02:03:27.139000Z",
        }
    }, this.handelDetails(order_id))
    // return this.calc;
    setMain('total_order',{data:calc})
    history.push('/cart')

    console.log(calc)
}
handelDetails =(order)=>{
  const {cart} =this.props;
  let data=[]
  map(cart,(d,v)=>{
    const id=uuid()
     data.push({id:id, price : d.price ,quantity:d.qtn ,order:order ,item:d.id ,item_tax:0.0})
    if(d.item){
      const m_id=uuid()
      data.push ({id:m_id, price :d.item.price ,quantity:d.item.qtn ,order:order,item:d.item.id,item_tax:0.0})
    }
  })
  console.log(data)
  return data;
}
 
  handelCancel =()=>{
    const {setMain}= this.props
    setMain('cart',{data:{}})
  }
  
  render() {
    const { cart, currentMode } = this.props;
    console.log("current mode", currentMode);
    return (
      <div className={classes.container}>
        <div style={{height:'70%'}}>
        <div className={classes.header}>
          {isEqual(currentMode, "Dine In") ? "Eat in" : currentMode}
        </div>
        <div className={classes.cartContanier}>{this.renderOrders()}</div>
        {!isEmpty(cart)&&<div className={classes.subTotal}>
            <div className={classes.totaltext}>Cart Sub-total</div>
            <div className={classes.priceText}> {this.renderToalPrice()} </div>
         </div>}
         </div>
        {!isEmpty(cart) && (
          <div className={classes.btnContainer}>
            <button className={classes.back} onClick={this.handelCancel}> Cancel</button>
            <button className={classes.next} onClick={this.renderCalculations}>Checkout</button>
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
  order: get(state.orders__main.data,
    get(state,"orders__main.active",''),{}),
  orderData: get(state.orders__main, state.orders__main.active, {}),

  details: get(state.orders__details,'data',{}),
  cart: get(state.cart, "data", {}),
  currentMode: get(
    state.settings__mode.data,
    get(state, "settings__mode.active", ""),
    ""
  ).name,
});
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
