import React, { Component } from "react";
import classes from "./style.less";
import {  get, map ,omit, size ,range ,isEmpty} from "lodash";
import { connect } from "react-redux";
import Edit from "../../assets/images/edit.png";
import mapDispatchToProps from "helpers/actions/main";
import applyFilters from "helpers/functions/filters";
import Collapse from './collapse'
import {array_to_obj} from 'helpers/functions/array_to_object'
import uuid from 'uuid/v4'

class Cart extends Component {

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
      history.push("/home");
      return[]
   }
   UpdateModels(data,success)
    console.log(calc)

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
  const {cart ,history ,setMain }=this.props

  setMain('cart',{data:omit(cart,data.id)})
  setMain('popup',{popup:{}})
  if(size(cart)==1){
    history.push('/order')
  }
}

handelEdit =(data)=>{
  const {cart,setMain,history}=this.props

  setMain('cart',{item:data})
  setMain('cart',{data:omit(cart,data.id)})
  history.push('/details')
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

 
  goBack=()=>{
    const {history}= this.props;
    history.goBack();

  }
  // handelCheckOut =()=>{
  //   const {history} =this.props;
  //   history.push('/payment')
  // }
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
    const {orderTotal} =this.props;
    return (
      <div className={classes.devContainer}>
        <div className={classes.item}> 
          <p className={classes.text}>Sub-total</p>
          <p className={classes.text}>EGP {orderTotal.sub_total}</p>
        </div>
        <div className={classes.item}>
          <p className={classes.text}>Service Charges</p>
          <p className={classes.text}>EGP {orderTotal.service}</p>
        </div>
        <div className={classes.item}>
          <p className={classes.text}>Taxes</p>
          <p className={classes.text}>EGP  {orderTotal.tax}</p>
        </div>
        <div className={classes.item}>
          <p className={classes.textBold}>Grand Total</p>
          <p className={classes.textBold}>EGP {orderTotal.total}</p>
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
  order: get(state.orders__main.data, state.orders__main.active, {}),
  orderDetails: get(state.orders__details, 'data', {}),
  orderTotal:get(state.total_order,'data',{})



});
export default connect(mapStateToProps,mapDispatchToProps)(Cart);
