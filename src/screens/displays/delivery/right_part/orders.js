import React, { Component } from 'react'
import Table from './table';
import classes from './style.less'

export default class Orders extends Component {

    render() {
        return (
            <div className={classes.table}>
                <Table />
            </div>
        )
    }
}