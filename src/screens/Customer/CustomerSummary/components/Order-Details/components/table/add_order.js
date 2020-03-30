import React, { Component } from 'react'
import classes from './style.less';

class AddOrder extends Component {

    render() {
        return (
            <button type='submit' className={classes.startOrd} >Add to Order</button>

        )
    }
}

export default AddOrder