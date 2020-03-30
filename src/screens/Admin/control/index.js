import React, { Component } from 'react'
import classes from './style.less'
import { map } from 'lodash'
import { withRouter } from 'react-router-dom'
import Header from 'components/header_back'
import {withTranslation} from 'react-i18next'
class Control extends Component {

    constructor(props) {
        super(props)
        this.buttons = {
            Favorite: {
                title: 'Favourites',
                url: 'favorite',
            },
            // PriceByPos: {
            //     title: 'Items by Station',
            //     url: 'price-by-pos',
            // },
            // FloorsZones: {
            //     title: 'Floors & Zones',
            //     url: 'floors-zones',
            // },
            items_printer: {
                title: 'Items by Display',
                url: 'items-printer',
            },
            printer_groups: {
                title: 'Display Groups',
                url: 'printer-groups',
            }
        };
    }

    goTo = (d) => {
        const { history } = this.props;
        history.push("/app/" + d.url)
    }

    renderOptions = () => {
        const {t} = this.props
        return map(this.buttons, (d, key) => (
            <button key={key} className={classes.options_btn} onClick={this.goTo.bind(this, d)}>
                {t(d.title)}
            </button>
        ))

    }

    render() {
        const {t} = this.props
        return (
            <div className={classes.all}>
                <Header name={t("Control")} />
                <div className={classes.options_div}>
                    {this.renderOptions()}
                </div>
            </div>
        )
    }
}

export default withRouter( withTranslation() (Control) )
