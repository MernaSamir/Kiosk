import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters';
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'
import {map} from 'lodash'
import Form from 'helpers/wrap/form.js';

export default class Removals extends Component {
    renderRemovableItem = () => {
        const { stocks, removals } = this.props

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
