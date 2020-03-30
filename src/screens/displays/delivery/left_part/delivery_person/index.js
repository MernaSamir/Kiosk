import React, { Component } from 'react'
import classes from './style.less'
import Header from './header';
import Group from './group';
import Table from './table';
import applyFilters from 'helpers/functions/filters'

export default class DeliveryPerson extends Component {
    // eslint-disable-next-line class-methods-use-this
    render() {
        const groups = applyFilters({
            key: 'Filter',
            path: "dropdowns__delivery_group",
            params: {
                active: true,
            }
        })
        return (
            <div className={classes.delivery_person}>
                <Header />
                <Group groups={groups}/>
                <Table  groups={groups}/>
            </div>
        )
    }
}