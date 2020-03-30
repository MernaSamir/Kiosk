import React, { Component } from 'react'
import classes from '../../../style.less'
import Selector from 'components/selector'

export default class ApplyTo extends Component {
    render() {
        const { name, selectorName, stations, modes } = this.props
        return (
            <div className={classes.groupings1}>
                <p >{name}</p>
                <div className={classes.Dropdown}>
                    <Selector data={stations}
                        indata={modes}
                        selectorName={selectorName}
                        btnClass={classes.selector}
                        clickedclass={classes.selectoractive} />
                </div>
            </div>
        )
    }
}
