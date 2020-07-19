import React, { Component } from "react";
import { Collapse } from 'antd';
import classes from "./style.less";
import Edit from "../../../../assets/images/edit.png";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import {get ,omit} from 'lodash'
class Collapsee extends Component {
  state={
    test:'v',
    show:false
  }
  editModifiers =(data)=>{
    const {setMain,history,carts}=this.props
    setMain('cart',{item:data})
    setMain('cart',{data:omit(carts,data.id)})
    history.push('/modifier')
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
    this.setState({show:false})
  
  
  }
  handeltest=()=>{
    if(this.state.test==='^'){
      this.setState({test:'v' , show :false})
    }
    else {
      this.setState({test:'^'})
      this.setState({show:true})  
    }
  }
  rendermodifiers =(d)=>{
    return (
      <div className={classes.modifiersContainer}>
      <button className={classes.miniBtn} onClick={()=>this.editModifiers(d)}>
      <img src={Edit} className={classes.editImg} />
       </button>
       <button className={classes.miniBtn} onClick={()=>this.deleteModifiers(d)}>X</button>
        <button className={classes.qtn}>{d.item.qtn}</button>
        {d.item.name}
        {d.item.price}
        </div>
    )
    
  }
  render (){
    const { Panel } = Collapse;
    
    const text = (
      <p style={{ paddingLeft: 24 }}>
        A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found
        as a welcome guest in many households across the world.
      </p>
    );
    
    return(
    <div>  
      <button onClick={this.handeltest} className={classes.showMore}>{this.state.test}</button>
      {this.state.show&&this.rendermodifiers(this.props.data)}
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
export default connect(mapStateToProps, mapDispatchToProps)(Collapsee);
