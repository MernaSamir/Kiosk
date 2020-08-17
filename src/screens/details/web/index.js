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

  }
  renderPrices = (item) => {
    const { getPrices } = this.props

    const priceList = getPrices(item)
console.log(priceList,"plis")
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
          initValue: priceList[0].id
        }])
      }
      {/* <SelectOne title='Size' options={priceList} redux='items__prices' /> */}
    </div>
  }
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
          <Footer activePrice={activePrice}  values={values}  {...this.props}
            {...{ ...pick(this.props, ['handleChange', 'handleSubmit', 'values']) }}
          />

        </div>
        <Cart />
      </div>
    )
      : (
        <></>);
  }
}


export default DetailsWrap(Form(Details));
