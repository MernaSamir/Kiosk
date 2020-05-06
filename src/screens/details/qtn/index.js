import React, { Component } from "react";
import classes from "./style.less";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get,isEmpty } from "lodash";
import applyFilters from "helpers/functions/filters";

class Quantity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dis: false,
    };
    const {setMain,cart}=props;
    if(!isEmpty(cart.item)){

      setMain('cart',{item:{...cart,item:{...cart.item,qtn:cart.item.base_qtn}}})
    }
  }
  handelClick = (action) => {
    const { setMain, cart } = this.props;

    if (action === "-") {
      if(cart.item){
        setMain("cart", { item: { ...cart, qtn: cart.qtn - 1 , item:{...cart.item, qtn:(cart.qtn - 1) * cart.item.base_qtn } } });

      }
      else {
        setMain("cart", { item: { ...cart, qtn: cart.qtn - 1 } });
      }

    }
     else {
       if(cart.item){
         setMain("cart", { item: { ...cart, qtn: cart.qtn + 1,item:{...cart.item, qtn:(cart.qtn+1)*cart.item.base_qtn} } });

       }
       else{
        setMain("cart", { item: { ...cart, qtn: cart.qtn + 1 } });
       }
    }
  };
  setButton = (qtn) => {
    if (qtn === 1) {
      return true;
    }
    return false;
  };
  add_cart = (data) => {
    const { appendPath, setMain, history,cart } = this.props;
    appendPath("cart", `data.${[data.id]}`, data);
    setMain("cart", { item: {} });
    history.push("/order");
  };
  handelEdit =()=>{
    const {history}=this.props
    history.push ('/details')
  }

  goBack=()=>{
    const {history}=this.props;
    history.goBack();
  }

  render() {
    const { cart, item } = this.props;
    const { qtn, price } = cart;
    const unit = applyFilters({
      key: "Find",
      path: "dropdowns__units_of_measure",
      params: {
        id: cart.sales_unit,
      },
    });

    return unit ? (
      <div className={classes.container}>
        <div className={classes.item}>
          {item.name} - {unit.name}
        </div>
        <div className={classes.chargesHeader}>
          <div className={classes.chargesTotal}>
            <p>Total</p>
            <p>EGP</p>
          </div>
          <div className={classes.chargesEach}>
            <p>Each</p>
            <p>EGP</p>
          </div>
        </div>

        <div className={classes.flex}>
          <p className={classes.itemInfo}>
            {qtn} x {item.name} {unit.name}
           
          </p>
          <div className={classes.priceHerder}>
          <p className={classes.each}>{price}</p>
          <p className={classes.total}> {price * qtn}</p>
          </div>
        </div>

       {!isEmpty(cart.item)&& <div className={classes.note}>Each haveing</div>}


        {!isEmpty(cart.item)&&
         <div className={classes.flex}>
         <p className={classes.itemInfo}>
         {cart.item.base_qtn} x {cart.item.name}
          
         </p>
         <div className={classes.priceHerder}>
         <p className={classes.each}>{cart.item.price}</p>
         <p className={classes.total}> {cart.item.qtn?cart.item.price * cart.item.qtn :cart.item.price}</p>
         </div>
       </div>}

        {/* <div className={classes.flexTotal}>
          <p className={classes.itemTotalInfo}>Item total ({qtn})</p>
          <p className={classes.each}>{price +(cart.item?cart.item.price:0)}</p>
          <p className={classes.total}> {price * qtn + (cart.item?(cart.item.price * cart.item.qtn):0)}</p>
        </div> */}
          <div className={classes.flex}>
          <p className={classes.itemTotalInfo}>
          Item total ({qtn})
           
          </p>
          <div className={classes.priceHerder}>
          <p className={classes.eachTotal}>{price +(cart.item?cart.item.price:0)}</p>
          <p className={classes.totalTotal}> {price * qtn + (cart.item?(cart.item.price * cart.item.qtn):0)}</p>
          </div>
        </div>

        <div className={classes.incrementer}>
          <button
            disabled={this.setButton(qtn)}
            className={classes.minus}
            onClick={() => this.handelClick("-")}
          >
            -
          </button>
          <div className={classes.qantity}>{cart.qtn}</div>
          <button
            className={classes.plus}
            onClick={() => this.handelClick("+")}
          >
            +
          </button>
        </div>
        <div className={classes.editDev}>
          <button onClick={this.handelEdit} className={classes.edit}>Edit Item Details</button>
          </div>
        <div className={classes.btnContainer}>
          <button className={classes.back} onClick={this.goBack}>Back</button>
          <button className={classes.next} onClick={() => this.add_cart(cart)}>
            Add to cart
          </button>
        </div>
      </div>
    ) : (
      <></>
    );
  }
}
const mapStateToProps = (state) => ({
  cart: get(state.cart, "item", {}),
  item: get(
    state.items__sales_items.data,
    get(state.items__sales_items, "active", undefined),
    undefined
  ),
});
export default connect(mapStateToProps, mapDispatchToProps)(Quantity);
