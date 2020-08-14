import React, { Component } from 'react'
import Render from 'helpers/functions/field_mapper/renderfields'
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'
import { map, get } from 'lodash';

export default class Alters extends Component {
    state ={
        alter: ''
    }
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
        const { active , getInfo, activeAlter, alter} = this.props
        const list = applyFilters({
            key: 'Filter',
            path: 'items__combo_alters',
            params: {
                combo_item: active.id
            }
        })
        const combo_info= getInfo(active,'item')
        let alter_all_info = {...active,...combo_info}
        return<>
        <button className={`${classes.title} ${(alter== active.id)&& classes.active}`} type='button' 
                onClick={() => activeAlter(alter_all_info)}>
                <p>{combo_info.name}</p>
                <p>{`${combo_info.size}`}</p>
            </button>
        { map(list, (l, key) => {
            const info = getInfo(l,'alter_item')
            let alter_all_info = {...l,...info}
  console.log(alter,"allllll",l.id)
            return <button className={`${classes.title} ${(alter== l.id)&& classes.active}`} type='button' key={key}
                onClick={() =>  activeAlter(alter_all_info)}>
                <p>{info.name}</p>
                <p>{`${info.size}`}</p>
                <div>
                <p>{`+EGP ${l.price_variance}.00`}</p>
                </div>
            </button>
        })}</>

    }
    render() {
        return <div className={classes.container}>{this.renderButtons()}</div>
    }
}
