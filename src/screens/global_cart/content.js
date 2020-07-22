import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import classes from './style.less'
import { map } from 'lodash'
import { withTranslation } from 'react-i18next'
import applyFilters from 'helpers/functions/filters';
import details from '../../helpers/components/table/details';
import Edit from "../../assets/images/edit.png";
import Collapse from './collapse'
import {array_to_obj} from 'helpers/functions/array_to_object'
class Content extends Component {
  state={
    test:'v',
    show:false
  }
  handelDelete = (data) => {

    const { setMain } = this.props
    const popup = {
      type: 'CancelCustomer', visable: true, width: "50%",
      childProps: {
        Title: '',
        first_msg: `Are you sure you want to delete ${data.qtn} x ${data.name}`,
        pressYes: () => this.deleteCart(data)
      }
    }
    setMain('popup', { popup })
  }
  deleteCart = (data) => {
    const { cart, history, setMain } = this.props

    setMain('cart', { data: omit(cart, data.id) })
    setMain('popup', { popup: {} })
    if (size(cart) == 1) {
      history.push('/order')
    }
  }
  goBack = () => {
    const { history } = this.props;
    history.goBack();

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
  renderOrders = () => {
    const { details } = this.props;
    return (
      <div className={classes.orderContainer}>
        {map(details, (d, v) => {
  console.log(d,"d cartttt")
          return (
            <div className={classes.cart}>
              <div className={classes.items}>
                {!d.parent &&
                  <>
                    <button className={classes.miniBtn} onClick={() => this.handelEdit(d)}>
                      <img src={Edit} className={classes.editImg} />
                    </button>
                    <button className={classes.miniBtn} onClick={() => this.handelDelete(d)}>X</button>
                    <button className={classes.qtn}>{d.quantity}</button>
                    <p>{d.item_name} - {d.size}</p>
                    <button onClick={this.handeltest} className={classes.showMore}>{this.state.test}</button></>}

                {d.parent && <Collapse history={this.props.history} d={d} show ={this.state.show}/>}
                    </div>
                    <div className={classes.itemPrice}>

                      {/* <div className={classes.each}>{d.price + (d.item ? d.item.price :0)}</div>
          <div className={classes.total}>{(d.qtn * d.price) + (d.item?(d.item.qtn * d.item.price):0)}</div> */}
                    </div>
                  </div>
          );
        })}
      </div>
    );
  }
  render() {
    const { details} = this.props
    return (
              <div>
                {this.renderOrders()}
              </div>
    )
  }
}


const wrapper = withTranslation()(Content)
export default withRouter(wrapper)
