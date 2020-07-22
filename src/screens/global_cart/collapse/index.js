import React, { Component } from "react";
import { Collapse } from 'antd';
import classes from "./style.less";
// import Edit from "../../../../assets/images/edit.png";
import Edit from "../../../assets/images/edit.png"
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import {get ,omit} from 'lodash'
class Collapsee extends Component {
 
  editModifiers =(data)=>{
    // const {setMain,history,carts}=this.props
    // setMain('cart',{item:data})
    // setMain('cart',{data:omit(carts,data.id)})
    // history.push('/modifier')
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
    // const {setMain,appendPath,carts}=this.props
    // setMain('popup',{popup:{}})
    // setMain('cart',{data:omit(carts,data.id)})
    // appendPath("cart", `data.${[data.id]}`,{ ...data,item:{}});
    // this.setState({show:false})
  
  
  }
 
  rendermodifiers =(d)=>{
    return (
      <div className ={classes.contanier}>
      <p className={classes.note}>Each haveing</p>
       <div className={classes.flex} style={{marginLeft:'3%'}}>
       <p className={classes.itemInfo}>{d.quantity} x {d.modifier_name}</p>
       {/* <div className={classes.priceHerder}> */}
       <p className={classes.each}>{d.price}</p>
       <p className={classes.total}> {d.quantity? d.price * d.quantity :d.price}</p>
       {/* </div> */}
     </div>
     </div>
    )
    
  }
  render (){
    const {show}= this.props
    return(
    <>  
      {show&&this.rendermodifiers(this.props.d)}
      </>

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
export default connect(mapStateToProps, mapDispatchToProps)(Collapsee);
