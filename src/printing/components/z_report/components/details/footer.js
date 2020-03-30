import React, { Component } from 'react'
import classes from '../style.less'

export default class Footer extends Component {
 
    render() {
        return (
            <>
                <div className={classes.footer}>
                    <p>Printed @ dd/mm/yyyy hh:mm:ss (Print #) </p>

                </div>
            </>
        )
    }
}
