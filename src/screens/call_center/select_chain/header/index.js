import React, { Component } from 'react'
import classes from './style.less'
import { withTranslation } from 'react-i18next';
import moment from "moment"

class Header extends Component {
    render() {
        const {t} = this.props
        return (
            <div className={classes.header} >
                <p>{t("Welcome to Xena Call Center")}</p>
                <p id={classes.time}>{moment().format('DD-MM-YYYY hh:mm')}</p>
            </ div>
        )
    }
}
export default  withTranslation()(Header)