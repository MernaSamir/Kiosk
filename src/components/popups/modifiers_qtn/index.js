import React, { Component } from 'react'
import classes from './style.less'
import { withRouter } from 'react-router'
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import {get} from 'lodash'
import {message} from 'antd'
 class ModifierQtn extends Component {
    ok = ()=>{
        const{onCancel , pressYes} = this.props
        pressYes()
        onCancel()
    }
    state={
        qtn:1
    }
 handelClick = (action,max) => {
        const { setMain, cart } = this.props;
        console.log(cart)
    
        if (action === "-") {
            // if(cart.item.qtn >= max._max){
            //     message.warning(`you can choose max ${max._max}`)
            // }
            // else{
                
                 setMain("cart",{item:{...cart,item:{...cart.item,base_qtn:cart.item.base_qtn-1}}})
            // }

        }
     else {
        // if(cart.item.qtn >= max._max){
        //     message.warning(`you can choose max ${max._max}`)
        // }
        // else {

             setMain("cart",{item:{...cart,item:{...cart.item,base_qtn:cart.item.base_qtn+1}}})
        // }

         }
 }
     setButton = (qtn) => {
        if (qtn === 1) {
          return true;
        }
        return false;
    }
    cancle =()=>{
        console.log("cancle")
        const {setMain,cart}=this.props
        setMain ('cart',{item:{...cart,item:{}}})
        setMain('popup', { popup: {} })
    }
    render() {
        const{onCancel , Title , first_msg, second_msg , t,cart,max} = this.props
        console.log(onCancel)
        console.log(max)
        return (
            <div className = {classes.all}>
                <p className={classes.title}>{t(Title)}</p>
                <div className={classes.msg}>
                    <p className={classes.first}>{t(first_msg)}</p>
                    <p className={classes.second}>{t(second_msg)}</p>
                </div>
             <div className={classes.incrementer}>
              <button
            disabled={this.setButton(cart.item.base_qtn)}
            className={classes.minus}
            onClick={() => this.handelClick("-")}
          >
            -
          </button>
          <div className={classes.qantity}>{cart.item.base_qtn}</div>
          <button
            className={classes.plus}
            onClick={() => this.handelClick("+",max)}
          >
            +
          </button>
            </div>
                <div className={classes.last}>
                    <button type="button"  onClick={this.cancle}>{t("Back")}</button>
                    <button type="submit" onClick={this.ok}>{t("Add to Order")}</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    cart: get(state.cart, "item", {}),
});
export default connect (mapStateToProps,mapDispatchToProps)(withTranslation()(withRouter(ModifierQtn)))
