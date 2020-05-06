import React, { Component } from "react";
import classes from "./style.less";
import { range, get, map ,omit} from "lodash";
import { connect } from "react-redux";
import Edit from "../../assets/images/edit.png";
import uuid from 'uuid/v4'
import mapDispatchToProps from "helpers/actions/main";
import {array_to_obj} from 'helpers/functions/array_to_object'
import applyFilters from "helpers/functions/filters";

class Cart extends Component {
  state={
    test :'v'
  }

  handelCheckOut = () => {
    const {station,mode,shift,UpdateModels,order,details}=this.props
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
        // history.push("/cart");
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
    console.log(orderDetails)
    console.log(orderData)
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
      history.push("/payment");
      return[]
   }
   UpdateModels(data,success)
    console.log(calc)

  }

handeltest=()=>{
  if(this.state.test==='^'){
    this.setState({test:'v'})
  }
  else {

    this.setState({test:'^'})
  }
}
  renderOrders =()=> {
    const { cart } = this.props;
    console.log(cart);
    return (
      <div>
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
              <button className={classes.miniBtn} onClick={()=>this.handelEdit(d)}>
                <img src={Edit} className={classes.editImg} />
              </button>
              <button className={classes.miniBtn}>X</button>
              <button className={classes.qtn}>{d.qtn}</button>
              {d.name} - {d.unit}
              <button onClick={this.handeltest} className={classes.showMore}>{this.state.test}</button>
              
              <div className={classes.chargesEach}>
          <div className={classes.each}>{d.price + (d.item ? d.item.price :0)}</div>
          <div className={classes.total}>{(d.qtn * d.price) + (d.item?(d.item.qtn * d.item.price):0)}</div>
          </div>
            </div>
          );
        })}
        {this.renderCharges()}
      </div>
    );
  }
  handelEdit =(data)=>{
    const {setMain,history,cart}=this.props
    setMain('cart',{item:data})
    setMain('cart',{data:omit(cart,data.id)})
    history.push('/details')
    console.log(data)

  }
  goBack=()=>{
    const {history}= this.props;
    history.goBack();

  }

  renderCharges() {
    return (
      <div className={classes.footer}>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Sub-total</div>
          <div className={classes.subCharges}>EGP Sub</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Service Charges</div>
          <div className={classes.subCharges}>EGP Service</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.subHeaders}>Taxes</div>
          <div className={classes.subCharges}>EGP Taxes</div>
        </div>
        <div className={classes.chargesContainer}>
          <div className={classes.totalHeader}>Grand Total</div>
          <div className={classes.totalCharge}>EGP Total</div>
        </div>
      </div>
    );
  }
  renderButtons() {
    return (
      <div className={classes.btnContainer}>
        <button className={classes.back} onClick={this.goBack}>Back</button>
        <button className={classes.next} onClick={() => this.handelCheckOut()}>
          Payment
        </button>
      </div>
    );
  }
  render() {
    const { cart } = this.props;
    console.log(cart);
    return (
      <div>
        <div className={classes.header}>My cart</div>
        {/* <div className={classes.empty}>
          {isEmpty(cart) && "Your cart is empty"}
        </div> */}
        {this.renderOrders()}
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

});
export default connect(mapStateToProps,mapDispatchToProps)(Cart);
