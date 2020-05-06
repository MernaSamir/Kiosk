import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get, min } from "lodash";
import applyFilters from "helpers/functions/filters";
import Table from "../../assets/images/2924_27020938.png";
import classes from "./style.less";
import Summary from './summary';
class Details extends Component {



  handelClick = (item, name, unit) => {
    const { appendPath, setMain } = this.props;
    // appendPath('cart', `item.${item.id}`, item)
    setMain('cart', { item: { ...item, qtn: 1, name: name, unit: unit } })
  }
  nextClick = () => {
    const { history, match } = this.props;
    // history.push(`${match.url}/qtn`)
    history.push('/modifier')

  }

  renderPrices(item) {
    const list = applyFilters({
      key: "List",
      path: "items__prices",
      select: {
        sales_item: item.id,
      },
      then: {
        key: "Reject",
        params: {
          active: false,
        },
      },
    });

    return list.map((d) => {
      let unit = applyFilters({
        key: "Find",
        path: "dropdowns__units_of_measure",
        params: {
          id: d.sales_unit,
        },
      });
      return (
        <button className={classes.priceContainer} onClick={() => this.handelClick(d, item.name, unit.name)}>
          <div className={classes.flexContainer}>
          <div className={classes.size} style={{marginBottom:"10%"}}>{unit.name}</div>
          <div className={classes.price}>EGP {d.price}</div>
          </div>
        </button>
      );
    });
  }

  goBack() {
    const { history, setMain } = this.props;
    setMain('cart', { item: {} })
    history.push("/order");
  }

  goNext() {
    const { history } = this.props;
    // history.push("/extras");
  }

  render() {
    const { item } = this.props;
    return item ? (
      <div className={classes.allContainer}>
        <div className={classes.stContainer}>
          <p className={classes.title}>{item.name}</p>
          <img src={Table} className={classes.image} />
          <p className={classes.description}>
            Item description from data base
          </p>
          <div className={classes.sizeContainer}>
            <p className={classes.select}>Select Size</p>
            <div className={classes.prices} >{this.renderPrices(item)}</div>
          </div>
        </div>
        <Summary />
        <div className={classes.btnContainer}>
          <button className={classes.back} onClick={() => this.goBack()}>
            Back
          </button>
          <button className={classes.next} onClick={() => this.nextClick()}>
            Next - Extras
          </button>
        </div>
      </div>
    ) : (
        <></>
      );
  }
}
const mapStateToProps = (state) => ({
  item: get(
    state.items__sales_items.data,
    get(state.items__sales_items, "active", undefined),
    undefined
  ),
  shift: get(state.orders__shifts, "active", undefined),
  mode: get(state.settings__mode, "active", undefined),
  station: get(state.licensing__station, "active", undefined),


});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
