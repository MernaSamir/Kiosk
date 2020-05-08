import React, { Component } from "react";
import classes from "./style.less";
import {  get, map ,omit, size} from "lodash";
import { connect } from "react-redux";
import Edit from "../../assets/images/edit.png";
import mapDispatchToProps from "helpers/actions/main";
import applyFilters from "helpers/functions/filters";
import Collapse from '../order/cart/collapse'
import {array_to_obj} from 'helpers/functions/array_to_object'

class Cart extends Component {

 
handeltest=()=>{
  if(this.state.test==='^'){
    this.setState({test:'v'})
  }
  else {

    this.setState({test:'^'})
  }
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
  const {setMain,cart,history ,appendPath ,details }=this.props
  setMain('popup',{popup:{}})
  setMain('cart',{data:omit(cart,data.id)})

  const itemDetails = applyFilters({
    key: 'Find',
    path: 'orders__details',
    params: {
      item:data.id
      
    }
  })
  setMain('orders__details',{data:omit(details,itemDetails.id)})
  appendPath("orders__details", `data.${[data.id]}`,{ ...itemDetails,deleted:true});

  if(size(cart)==1){
    history.push('/order')
  }
}
  renderOrders =()=> {
    const { cart } = this.props;
    return (
      <div className={classes.orderContainer}>
        <div className={classes.chargesHeader}>
          <div className={classes.chargesEach}>
            <p>Total</p>
            <p>EGP</p>
          </div>
          <div className={classes.chargesEach}>
            <p>Each</p>
            <p>EGP</p>
          </div>
 
        </div>
        {map(cart, (d, v) => {
          return (
            <div className={classes.cart}>
              <div className={classes.items}>
              <button className={classes.miniBtn} onClick={()=>this.handelEdit(d)}>
                <img src={Edit} className={classes.editImg} />
              </button>
              <button className={classes.miniBtn} onClick={()=>this.handelDelete(d)}>X</button>
              <button className={classes.qtn}>{d.qtn}</button>
              <p>{d.name} - {d.unit}</p>
              {d.item&&<Collapse history={this.props.history} data={d}/>}
              </div>
              <div className={classes.itemPrice}>
          <div className={classes.each}>{d.price + (d.item ? d.item.price :0)}</div>
          <div className={classes.total}>{(d.qtn * d.price) + (d.item?(d.item.qtn * d.item.price):0)}</div>
          </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  handelEdit =(data)=>{
    const {setMain,history,cart,appendPath,details,UpdateModels}=this.props

    const itemDetails = applyFilters({
      key: 'Find',
      path: 'orders__details',
      params: {
        item:data.id
      }
    })
    const itemModifier = applyFilters({
      key: 'Find',
      path: 'orders__details',
      params: {
        parent:itemDetails.id
      }
    })
    let result={}

    if(itemModifier){
       result ={'orders__details':[{
        ...itemDetails,
        deleted:true
       },
       {
         ...itemModifier,
         deleted:true
       }
       ]}
      }
       else {
          result = {'orders__details':[{
          ...itemDetails,
          deleted:true
         }
        ]}
       }
    

     const success=(res)=>{
      const {appendPath,setMain ,history}=this.props

      history.push('/details')
      setMain('orders__details',{data:omit(details, [itemDetails?itemDetails.id:null , 
        itemModifier ? itemModifier.id :null])})

      map(res,(d,v)=>{
        setMain(v,{active:d[0].id})
        d=array_to_obj(d)
        appendPath(v, 'data',d);
      })
      setMain('cart',{item:data})
      setMain('cart',{data:omit(cart,data.id)})
      return[]
   }
     UpdateModels(result,success)



      

      // appendPath("orders__details", `data.${[itemDetails.id]}`,{ ...itemDetails,deleted:true});
      // appendPath("orders__details", `data.${[itemModifier.id]}`,{ ...itemModifier,deleted:true});
      
    
    // this.setItemModifiers(itemDetails.id)


  }

  setItemModifiers=(id)=>{
    const {appendPath ,setMain ,details}=this.props
 
    if(itemModifier){
      
      setMain('orders__details',{data:omit(details,itemModifier.id)})
    }

  }
  goBack=()=>{
    const {history}= this.props;
    history.goBack();

  }
  handelCheckOut =()=>{
    const {history} =this.props;
    history.push('/payment')
  }
  getPrice = ()=>{
    const { cart } = this.props;
    let total=0
    map(cart,(d,v)=>{
      total += (d.price*d.qtn) +(d.item? (d.item.qtn * d.item.price):0)
    })
    return total ;

  }
  getTotalPrice = ()=>{
    return this.getPrice()+0+0; 
  }

  renderCharges() {
    const {receipt} =this.props;
    return (
      <div className={classes.devContainer}>
        <div className={classes.item}> 
          <p className={classes.text}>Sub-total</p>
          <p className={classes.text}>EGP {receipt.sub_total}</p>
        </div>
        <div className={classes.item}>
          <p className={classes.text}>Service Charges</p>
          <p className={classes.text}>EGP {receipt.service}</p>
        </div>
        <div className={classes.item}>
          <p className={classes.text}>Taxes</p>
          <p className={classes.text}>EGP  {receipt.tax}</p>
        </div>
        <div className={classes.item}>
          <p className={classes.textBold}>Grand Total</p>
          <p className={classes.textBold}>EGP {receipt.total}</p>
        </div>
      </div>
    );
  }
  renderButtons() {
    return (
       <div className={classes.btnContainer}>
       <button className={classes.back} onClick={this.goBack}> Back</button>
        <button className={classes.next} onClick={this.handelCheckOut}> Payment</button>
      </div>
    );
  }
  render() {
    const { cart } = this.props;
    console.log(cart);
    return (
      <div className={classes.container}>
        <div className={classes.header}>My cart</div>
       
        {this.renderOrders()}
        {this.renderCharges()}
        {this.renderButtons()}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  cart: get(state.cart, "data", {}),
  shift:get(state.orders__shifts,"active",undefined),
  mode: get(state.settings__mode,"active",undefined),
  station: get(state.licensing__station,"active",undefined),
  orderData: get(state.orders__main, state.orders__main.active, {}),
  details: get(state.orders__details,'data',{}),
  receipt: get(state.orders__receipt.data,
    get(state,"orders__receipt.active",''),{}),

});
export default connect(mapStateToProps,mapDispatchToProps)(Cart);
