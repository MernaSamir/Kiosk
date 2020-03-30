import React, { Component } from 'react'
import { map } from 'lodash'
import moment from 'moment';
import PackGroup from './pack_group';
import classes from './style.less'

export default class SplitPacking extends Component {

    renderSmallPacking = () => {
        const { groups } = this.props
        return map(groups, (d, key) => (
            <div className={classes.box}>
                <p>{moment(key).format('HH:mm')}</p>
                <PackGroup elements={d} />
            </div>
        ))
    }

    render() {
        return (
            <div className={classes.container}>
                <div className={classes.holder}>
                    {this.renderSmallPacking()}
                </div>
            </div>
        )
    }
}