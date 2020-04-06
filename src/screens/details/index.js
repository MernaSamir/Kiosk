import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get, min } from "lodash";
import applyFilters from "helpers/functions/filters";
import Table from "../../assets/images/2924_27020938.png";
import classes from "./style.less";
import Summary from './summary';
import uuid from 'uuid/v4'
class Details extends Component {


  // handelClick =(item_price)=>{
  //   const {station,mode,shift,UpdateModels}=this.props
  //   const main_id=uuid()
  //   const details_id=uuid()
  //     const data= {'orders__main':[{
  //             id:main_id,
  //             station:station,
  //             mode:mode,
  //             start_time: new Date(),
  //             shift:shift
  //     }],
  //     'orders__details':[{
  //         id:details_id,
  //         order:main_id,
  //         item:item_price.id,
  //         price:item_price.price,
  //         quantity:1
  //     }]
  //    }
  //    const success=(res)=>{
  //       const {history,setMain}=this.props
        
  //        console.log(res)
  //       return[]
  //    }
  //    UpdateModels(data,success)
  // }
  handelClick=(item)=>{
    const {appendPath,setMain}=this.props;
    // appendPath('cart', `item.${item.id}`, item)
    setMain('cart',{data:{...item,qtn:1}})
  }
  nextClick=()=>{
    const{history,match}=this.props;
    history.push(`${match.url}/qtn`)

  }

  renderPrices(item) {
    const list = applyFilters({
      key: "List",
      path: "items__prices",
      select: {
        sales_item: item.id
      },
      then: {
        key: "Reject",
        params: {
          active: false
        }
      }
    });

    return list.map(d => {
      let unit = applyFilters({
        key: "Find",
        path: "dropdowns__units_of_measure",
        params: {
          id: d.sales_unit
        }
      });
      return (
        <div className={classes.priceContainer} onClick={()=>this.handelClick(d)}>
          <div className={classes.size}>{unit.name}</div>
          <div className={classes.price}>EGP {d.price}</div>
        </div>
      );
    });
  }
  render() {
    const { item } = this.props;
    return item ? (
      <div>
        <div className={classes.container}>
          <div className={classes.title}>{item.name}</div>
          <img src={Table} className={classes.image} />
          <div className={classes.description}>
            Item description from data base
          </div>
          <div className={classes.select}>Select Size</div>
          <div className={classes.prices} >{this.renderPrices(item)}</div>
        </div>
        
        <Summary name={item.name}/>
        <div className={classes.btnContainer}>
                  <button className={classes.back}>Back</button>
                  <button className={classes.next} onClick={this.nextClick}>Next - Extras</button>
                </div>
      </div>
    ) : (
      <></>
    );
  }
}
const mapStateToProps = state => ({
  item: get(
    state.items__sales_items.data,
    get(state.items__sales_items, "active", undefined),
    undefined
  ),
  shift:get(state.orders__shifts,"active",undefined),
  mode: get(state.settings__mode,"active",undefined),
  station: get(state.licensing__station,"active",undefined),


});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
