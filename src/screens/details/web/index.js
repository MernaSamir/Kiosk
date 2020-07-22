import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { pick, filter } from "lodash";
import applyFilters from "helpers/functions/filters";
import Table from "../../../assets/images/2924_27020938.png";
import classes from "./style.less";
import Summary from '../summary';
import DetailsWrap from "helpers/wrap/screens_wraps/details"
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form.js'
import Footer from './footer'
import Cart from 'screens/global_cart'
class Details extends Component {


  componentDidMount() {
    this.props.setValues(this.props.initialValues)


  }
  static onSubmit(props, values) {
    props.onSubmit(values)
    // console.log(" on submit object", values)
    // if (values) {

    //     const {  formValues, setMain } = props
    //     const detail = {...values, modifiers:filter(values.modifiers, {parent:values.size}) }
    //     setMain('form_actions',{details:{...formValues, [detail.id]:detail}})
    // }
  }
  // emptyModifiers = () => {
  //   const { handleChange } = this.props

  //   handleChange({
  //     target: {
  //       name: 'modifiers',
  //       values: []
  //     }
  //   })
  // }
  // handelClick = (item, name, unit) => {
  //   const { appendPath, setMain } = this.props;
  //   // appendPath('cart', `item.${item.id}`, item)
  //   setMain('cart', { item: { ...item, qtn: 1, name: name, unit: unit } })
  // }
  // const list = applyFilters({
  //   key: "List",
  //   path: "items__prices",
  //   select: {
  //     sales_item: item.id,
  //   },
  //   then: {
  //     key: "Reject",
  //     params: {
  //       active: false,
  //     },
  //   },
  // });
  // let unit = applyFilters({
  //   key: "Find",
  //   path: "dropdowns__units_of_measure",
  //   params: {
  //     id: d.sales_unit,
  //   },
  // });
  renderPrices = (item) => {
    const { getPrices } = this.props

    const priceList = getPrices()

    return <div className={classes.selects}>
      {
        Render([{
          type: 'SelectOne',
          t: 'Size',
          title: '',
          name: 'price_id',
          options: priceList,
          className: classes.prices,
          redux: 'items__prices',
        }])
      }
      {/* <SelectOne title='Size' options={priceList} redux='items__prices' /> */}
    </div>
  }

  // renderPrices(item) {
  //   const { handelClick, getPrices, getUnit } = this.props

  //   const prices = getPrices()

  //   return map(prices, (d) => {
  //     let unit = getUnit(d)
  //     return (
  //       <button className={classes.priceContainer} onClick={() => handelClick(d, item.name, unit.name)}>
  //         <div className={classes.flexContainer}>
  //           <p className={classes.size}>{unit.name}</p>
  //           <p className={classes.price}> (£ {d.price})</p>
  //         </div>
  //       </button>
  //     );
  //   });
  // }
  // renderDonenss() {
  //   const { handelClickDoneness, getDonenss, getUnit } = this.props

  //   const doneness = getDonenss()

  //   return map(doneness, (d) => {
  //     return (
  //       <button className={classes.priceContainer} onClick={() => handelClickDoneness(d, item.name, unit.name)}>
  //         <div className={classes.flexContainer}>
  //           <p className={classes.size}>{d.name}</p>
  //         </div>
  //       </button>
  //     );
  //   });
  // }
  renderDoneness = () => {
    const { item, getDonenss } = this.props
    const doneness = getDonenss()
    return <div className={classes.selects}>
      {
        Render([{
          type: 'SelectOne',
          t: 'Doneness',
          title: 'Select Doneness',
          name: 'doneness',
          options: doneness,
          className: classes.options,
          redux: 'dropdowns__doneness'
        }])
      }
      {/* <SelectOne title='Doneness' options={doneness} redux='dropdowns__doneness' /> */}
    </div>
  }

  // render(){
  //   return <Normal/>
  // }
  render() {
    const { item, nextClick, goBack, activePrice, values } = this.props;
    return item ? (
      <div className={classes.above}>
        <div className={classes.allContainer}>
          {/* <div className={classes.stContainer}> */}
          <p className={classes.title}>{item.name}</p>
          <div className={classes.picDes}>
            <img src={Table} className={classes.image} />
            <p className={classes.description}>
              Item description from data base
          </p>
          </div>
          <div className={classes.sizeDoneCont}>
            <div className={classes.sizeContainer}>
              <p className={classes.p}>Select Size</p>
              <div className={classes.prices} >
                {this.renderPrices(item)}
              </div>
            </div>
            {item.has_doneness &&
              <div className={classes.sizeContainer}>
                <p className={classes.p}>Select Doneness</p>
                <div className={classes.prices} >
                  {this.renderDoneness()}
                </div>
              </div>}
            {/* </div> */}
          </div>
          <Footer activePrice={activePrice} values={values}  {...this.props}
            {...{ ...pick(this.props, ['handleChange', 'handleSubmit', 'values']) }}
          />

          {/* <div>
          <div >
            <button
              //  disabled={this.setButton(cart.item.base_qtn)} 
              className={classes.minus}
            // onClick={() => this.handelClick("-")}
            >
              -</button>
            <div className={classes.qantity}>{cart.qnt}</div>
            <button className={classes.plus}
            //  onClick={() => this.handelClick("+", max)}
            >+</button>
          </div>
        </div> */}
          {/* <Summary margin='0' /> */}
          {/* <div className={classes.btnContainer}>
          <button className={classes.back} onClick={goBack}> Back</button>
          <button className={classes.next} onClick={nextClick}>Next - Extras</button>
        </div> */}
        </div>
        <Cart />
      </div>
    )
      : (
        <></>);
  }
}
// const mapStateToProps = (state) => ({
//   item: get(
//     state.items__sales_items.data,
//     get(state.items__sales_items, "active", undefined),
//     undefined
//   ),
//   shift: get(state.orders__shifts, "active", undefined),
//   mode: get(state.settings__mode, "active", undefined),
//   station: get(state.licensing__station, "active", undefined),


// });

export default DetailsWrap(Form(Details));
