import React, { Component } from 'react'
import LeftComponent from './left_component';
import MenuCategory from 'screens/ordering/orderList/MenuCategory';
import classes from './style.less'

export default class Setting extends Component {
    render() {
        const { match } = this.props
        return (
            <div className={classes.app_body}>
                <LeftComponent />
                <MenuCategory match={match} option={true} />
            </div>
        )
    }
}
