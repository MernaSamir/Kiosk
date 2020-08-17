import React, { Component } from "react";
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { isEmpty, map, get } from "lodash";
import Combo from "../../assets/images/eatn12.png";
import classes from "./style.less";
import Footer from './footer'
import Cart from 'screens/global_cart'
import { getInfo } from 'helpers/functions/get_item_info'
import applyFilters from 'helpers/functions/filters'
import { withRouter } from 'react-router-dom'
 
class Main extends Component {
  state = {
    active: {},
    qtn: 1,
  }
  gotoSubgroups = (l) => {
const {history, setMain, setAll}= this.props
// setMain('items__ssb_group', {active:l.id})
setAll([
  { type: "set_main", app:'items__ssb_group', data: { active:l.id } },
  { type: "set_main", app: 'form_actions', data: { CartStatus: false } }
])
history.push('/ssb-items')
  }
  renderComponents = () => {
    const {  activePrice } = this.props
  this.list = applyFilters({
      key: 'Filter',
      path: 'items__ssb_group',
      params: {
          'item_size': activePrice.id
      }
  })

    let info = {}

    return <div className={classes.buttonContainer} >
      {map(this.list, (l, key) => {
        // let price = applyFilters({ path: `items__prices.data.${l.item}`})

        // let ac =!isEmpty(active)?active.id:list[0].id
        info = getInfo(l, 'item')
        return <button 
        className={`${classes.title}`} type='button' key={key}
          onClick={() => this.gotoSubgroups(l)}>
          <p>{l.name}</p>
          {/* <p>{`${info.size}`}</p> */}
          <p>{`Q: ${l.max_quantity}`}</p>
        </button>
      })}
    </div>
  }

  render() {
    const { item, nextClick, goBack, activePrice, values, activeDetail } = this.props;
    return item ? (
      <div className={classes.above}>
        <div className={classes.allContainer}>
          {/* <div className={classes.stContainer}> */}
          <p className={classes.title}>{item.name}</p>
          <div className={classes.picDes}>
            <img src={Combo} className={classes.image} />
            <p className={classes.description}>
            Your choice of 4 sandwiches, 4 sides and 1 liter soft drink



          </p>
          </div>
          <div className={classes.sizeDoneCont}>
            <div className={classes.sizeContainer}>
              <p className={classes.p}>Select Group to make Choices</p>
              {this.renderComponents()}
            </div>

          </div>
          <Footer activePrice={activePrice} activeDetail={activeDetail} values={values}  {...this.props} items={this.list}/>

        </div>
        <Cart />
      </div>
    )
      : (
        <></>);
  }
}


const mapStateToProps = (state) => ({
  item: get(state.items__sales_items.data, state.items__sales_items.active, {}),
  activePrice: get(get(state.items__prices, 'data', ''), state.items__prices.active, ''),

  details: get(state.form_actions, 'details', {}),
  activeDetail: get(state.form_actions, 'active', ''),


})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Main))