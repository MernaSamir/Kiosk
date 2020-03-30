import React, { Component } from 'react'
import Dropdown from './dropdown'
import classes from './style.less'

const shifts = [1, 2, 3, 4]

export class Shifts extends Component {
    render() {
        const {t}= this.props
        return (
            <div className={classes.filter}>
                <div><p>{t("Shift")}</p>
                    <Dropdown
                        data={shifts}
                        show="shift_num"
                        style={{ width: '100%' }}
                        name='shift' />
                </div>
            </div>
        )
    }
}

export default Shifts