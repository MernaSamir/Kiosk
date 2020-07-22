import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters';
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'
import {map} from 'lodash'
import Form from 'helpers/wrap/form.js';

export default class Removals extends Component {
    renderRemovableItem = () => {
        const { detail } = this.props
        console.log(detail,"dedede")
        const recipe = applyFilters({
            key: 'Filter',
            path: 'items__recipe',
            params: {
                sales_item: detail.price_id,
                removable: true
            }
        })
        console.log(recipe,"reeeeee")
        const stocks = applyFilters({
            key: 'picking',
            reduxName: 'stock__items',
            select: 'stock_item'
        }, recipe)
        const removals = applyFilters({
            key: 'Filter',
            path: 'orders__recipe_removals',
            params: {
                detail: detail.id,
                _type: 'rm'
            }
        })
        // return <div className= {classes.btnsContanier}>
        //  {map(stocks,(d,i)=>{
        //      const found =find (filter(field.value ,v=>!v.remove), s=>s.stock_item==d.id )

        //      return<button className={found&& "active" }>{d.name}</button>
        // })}
        // </div>
        return Render([{
            name: "items",
            type: 'MultiSelectRemoved',
            className: classes.btnsContanier,
            options: stocks,
            initValue: map(removals, i => ({ stock_item: i.stock_item, id: i.id }))

        }])

    }

    render() {
        return (
                this.renderRemovableItem()
        )
    }
}
