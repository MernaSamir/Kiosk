import React, { Component } from 'react'
import classes from './style.less'

export default class ModifiersAlert extends Component {
    // eslint-disable-next-line class-methods-use-this
    render() {
        const { only, msg = 'Exceeded maximum number of Items' } = this.props
        return (
            <div className={classes.container}>
                <div className={classes.title}>
                    <p>{msg}</p>
                </div>
                {!only && <div className={classes.content}>
                    <p>The order exceed the number of items allowed.</p>
                    <p>Please delete 1 Items</p>
                </div>}

            </div>
        )
    }
}
