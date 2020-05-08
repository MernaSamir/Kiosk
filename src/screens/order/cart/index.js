import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, isEqual, map ,omit ,range,} from "lodash";
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


  handelCheckOut = () => {
    const {station,mode,shift,UpdateModels,order}=this.props

    let main_id= !isEmpty(order) ? order.id : uuid()

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
        const {appendPath,setMain}=this.props
        map(res,(d,v)=>{
          setMain(v,{active:d[0].id})
          d=array_to_obj(d)
          appendPath(v, 'data',d);
        })
        this.goPay()
        return[]
     }
     UpdateModels(data,success)
  };

  getOrderDetails=(order_id)=>{
    const {cart}=this.props;
    let list=[]

    map(cart,(d,v)=>{
      let detailsID =uuid()
      if(d.item){
  
      let modifierID =uuid()

        list.push({
          id:modifierID,
          parent:detailsID,
          order:order_id,
          item:d.item.item,
          price:d.item.price,
          quantity:d.item.qtn
        })
      }
       list.push({
        id:detailsID,
        order:order_id,
        item:d.id,
        price:d.price,
        quantity:d.qtn
      })
    })
    return list;
  };
  goPay() {
    const {orderData,UpdateModels}=this.props
    const orderDetails = applyFilters({
      key: 'Filter',
      path: 'orders__details',
      params: {
        deleted:false
      }
    })
    const calc = applyFilters({
      key: 'calculateReceipts',
      path: 'orders__receipt',
    }, orderDetails, undefined, {seatsNum: range(0, (get(orderData, 'guests_num', 0) + 1))}
    )
    const data={'orders__receipt':calc,'orders__receipt_items':calc[0].items}
    const success=(res)=>{
      console.log(res)
      const {history,appendPath,setMain}=this.props
      map(res,(d,v)=>{
        setMain(v,{active:d[0].id})
        d=array_to_obj(d)
        console.log(d)
        appendPath(v, 'data',d);
      })
      history.push("/cart");
      return[]
   }
   UpdateModels(data,success)
    console.log(calc)

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
          My cart - {isEqual(currentMode, "Dine In") ? "Eat in" : currentMode}
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
            <button className={classes.next} onClick={this.handelCheckOut}>Checkout</button>
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
