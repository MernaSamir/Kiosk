import React, { Component } from 'react'
import classes from "./style.less";

export default class Welcome extends Component {
    getMsg = () => {
        const { history } = this.props
        setTimeout(() => {
            history.push("./setting")
        }, 1500)
    }
    render() {
        this.getMsg()
        return (
            <div className={classes.dic}>
                <p> Welcome to Buffalo Burger</p>
                <p>We have a great selection of sandwiches and sides to suit every diet,
                all made with the freshest natural ingredients to give you the taste you’re
                craving without compromising on nutrition. Bon Appetit!</p>
            </div>
        )
    }
}
