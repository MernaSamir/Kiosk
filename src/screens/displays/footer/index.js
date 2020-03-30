import React, { Component } from 'react'
import classes from './style.less'
import { map, get } from 'lodash'

const StatusTab = (status, style) => <div className={classes.RStatusContainer}>
    <div key={status + 1} className={`${classes.RectangleStatus}   ${style}`}></div>
    <div key={status + 2} className={classes.footerText}>{status}</div>
</div>
export default class PackingFooter extends Component {

    renderOptions = () => {
    }
    render() {
        const { status } = this.props
        return (
            <div className={classes.footer_container}>

                <div className={classes.status}>
                    {map(status, (d, key) => (
                        StatusTab(d, get(classes, key, ''))
                    ))}
                </div>
            </div>
        )
    }
}
