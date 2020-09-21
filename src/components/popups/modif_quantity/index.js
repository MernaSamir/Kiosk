import React, { Component } from 'react'
import classes from './style.less'
import { withRouter } from 'react-router'
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import mapDispatchToProps from "helpers/actions/main";
import { get, omit } from 'lodash'
import { message } from 'antd'
class ModifierQtn extends Component {
    ok = () => {

        const { onCancel, pressYes , modifier_item,first_msg , item_id} = this.props
        const { qtn} = this.state

        pressYes(qtn, modifier_item, first_msg, item_id)
        onCancel()
    }
    state = {
        qtn: 1
    }
    handelClick = (action, max) => {
        const { setMain, cart } = this.props;
        const {qtn}= this.state
        console.log(cart)

        if (action === "-") {
          this.setState({
              qtn:qtn-1   
          })
            // setMain("cart", { item: { ...cart, item: { ...cart.item, base_qtn: cart.item.base_qtn - 1 } } })

        }
        else {
            if(max==qtn){
                setMain('popup',
                {
                    popup: { type: 'ModifiersAlert', visable: true, width: '40%', border: '1.5px solid #d73f7c',
                
                    childProps: {
                        only:true
                    }
                }
                })
            }
            else{
            this.setState({
                qtn:qtn+1    
            })
        }
            // setMain("cart", { item: { ...cart, item: { ...cart.item, base_qtn: cart.item.base_qtn + 1 } } })
        }
    }
    setButton = (qtn) => {
        if (qtn === 1) {
            return true;
        }
        return false;
    }
    cancle = () => {
        console.log("cancle")
        const { setMain, cart } = this.props
        // const data = omit(cart, 'item')
        // setMain('cart', { item: { ...data } })
        setMain('popup', { popup: {} })
    }
    render() {
        const { onCancel, Title, first_msg, second_msg, t, cart, max , modifier_item} = this.props
        const {qtn} = this.state
        console.log(qtn,"quantttt")
        console.log(max)
        return (
            <div className={classes.all}>
                <p className={classes.title}>{t(Title)}</p>
                <div className={classes.msg}>
                    <p className={classes.title}>{t(first_msg)}</p>
                    <p className={classes.second}>{t(second_msg)}</p>
                </div>
                <div className={classes.incrementer}>
                    <button
                        disabled={this.setButton(qtn)}
                        className={classes.minus}
                        onClick={() => this.handelClick("-")}
                    >-</button>
                    <div className={classes.qantity}>{qtn}</div>
                    <button
                        className={classes.plus}
                        onClick={() => this.handelClick("+", max)}
                    >+</button>
                </div>
                <div className={classes.containerTitel}>

                    <p className={classes.title}> {qtn} x {first_msg} </p>
                    <p className={classes.title}>  EGP {modifier_item.price * qtn}</p>
                </div>
                <div className={classes.last}>
                    <button type="button" className={classes.cancel} onClick={this.cancle}>{t("Back")} </button>
                    <button type="submit" className={classes.submit} onClick={this.ok}>{t("Add to Order")}</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    cart: get(state.cart, "item", {}),
});
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withRouter(ModifierQtn)))
