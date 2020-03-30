import React, { Component } from 'react'
import Clock from 'react-live-clock';
import classes from './../style.less';
import Pagination from './pagination';

export default class Header extends Component {
    render() {
        return (
            <div className={classes.header}>
                <p> <Clock format={'DD/MM/YYYY , HH:mm A'} ticking={true} /></p>
                <Pagination />
            </div>
        )
    }
}
