import React, { Component } from "react";
import classes from "./style.less";
import { isEmpty, get, isEqual, map ,omit} from "lodash";
import { connect } from "react-redux";
import Edit from "../../../assets/images/edit.png";
import mapDispatchToProps from "helpers/actions/main";
import Collapse from './collapse'
import cons from "gun";

class Cart extends Component {

  handelEdit =(data)=>{
    const {setMain,history,carts}=this.props
    setMain('cart',{item:data})
    setMain('cart',{data:omit(carts,data.id)})
    history.push('/details')
  }
  editModifiers =(data)=>{
    const {setMain,history,carts}=this.props
    setMain('cart',{item:data})
    setMain('cart',{data:omit(carts,data.id)})
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
  const {setMain,appendPath,carts}=this.props
  setMain('popup',{popup:{}})
  setMain('cart',{data:omit(carts,data.id)})
  
 appendPath("cart", `data.${[data.id]}`,{ ...data,item:{}});


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
            {/* <button className={classes.showMore}>V</button> */}
            {/* {!isEmpty(d.item)&&<Collapse>
              <button className={classes.miniBtn} onClick={()=>this.editModifiers(d)}>
              <img src={Edit} className={classes.editImg} />
               </button>
               <button className={classes.miniBtn} onClick={()=>this.deleteModifiers(d)}>X</button>
                <button className={classes.qtn}>{d.item.qtn}</button>
                {d.item.name}
            </Collapse>} */}
            {!isEmpty(d.item)&&<Collapse history={this.props.history} data={d}/>}
            <div className={classes.price}>EGP{d.qtn * d.price}</div>
          </div>
        );
      });
    }
  };
  handelCheckOut = () => {
    
        const {history,}=this.props
        history.push("/cart");
  }
  handelCancel =()=>{
    const {setMain}= this.props
    setMain('cart',{data:{}})
  }
  
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
            <button className={classes.cancel} onClick={this.handelCancel}>Cancel</button>
            <button onClick={this.handelCheckOut} className={classes.checkOut}>
              Checkout
            </button>
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
  details: get(state.orders__details.data,
      get(state,"orders__details.active",''),{}),
  carts: get(state.cart, "data", {}),
  currentMode: get(
    state.settings__mode.data,
    get(state, "settings__mode.active", ""),
    ""
  ).name,
});
export default connect(mapStateToProps, mapDispatchToProps)(Cart);
