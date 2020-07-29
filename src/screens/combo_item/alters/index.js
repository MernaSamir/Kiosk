import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'
import { map, get } from 'lodash';

export default class Alters extends Component {
    renderSpanStyle = (name) => {
        if ((name).includes(" ")) {
            return <span style={{ padding: '7%' }} >  {name}</span>
        }
        return <span> {name}</span>
    }

    renderPriceStyle = (price) => {
        if (price > 0) {
            return <div className={classes.Mod_price}>
                <span>+{price.price}.00</span>
            </div>
        }
    }

    renderButtons = () => {
        const { active , getInfo} = this.props
        const list = applyFilters({
            key: 'Filter',
            path: 'items__combo_alters',
            params: {
                combo_item: active.id
            }
        })
        const combo_info= getInfo(active,'item')
        console.log(active, 'jmn', combo_info)
        return<>
        <button className={`${classes.title}`} type='button' 
                onClick={() => alert("bebbbbbeee")}>
                <p>{combo_info.name}</p>
                <p>{`${combo_info.size}`}</p>
            </button>
        { map(list, (l, key) => {
            const info = getInfo(l,'alter_item')
            return <button className={`${classes.title}`} type='button' key={key}
                onClick={() => alert("bebbbbbeee")}>
                <p>{info.name}</p>
                <p>{`${info.size}`}</p>
                <div>
                <p>{`+EGP ${l.price_variance}.00`}</p>
                </div>
            </button>
        })}</>

    }
    render() {

        console.log("hnaaaaaaasvghhmsgjhg")

        return <div className={classes.container}>{this.renderButtons()}</div>
    }
}
