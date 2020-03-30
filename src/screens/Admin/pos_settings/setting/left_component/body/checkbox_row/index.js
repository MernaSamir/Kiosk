import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get, find } from 'lodash'
import classes from '../../../style.less'

export default class CheckboxRow extends Component {

    state = {
        // check: false,
    }

    static getDerivedStateFromProps(props, state) {
        const { list, k, mode, station } = props
        if (state.check == undefined || state.mode != mode.id) {
            return {
                check: eval(get(find(list, { mode: mode.id, station: station.id, key: k }),
                    'value', '')),
                mode: mode.id,
            }
        }
    }

    check = () => {
        const { getSettings, k } = this.props
        this.setState({
            check: !(this.state.check)
        }, () => {
            getSettings(k, this.state.check.toString())
        })
    }

    render() {
        const { name, innerName } = this.props
        const { check } = this.state

        return (
            <div className={classes.groupings1}>
                <p >{name}</p>
                <div className={classes.custom}>
                    <p >{innerName}</p>
                    <div className={classes.check_div} onClick={this.check.bind()}>
                        <FontAwesomeIcon className={classes.icon} icon="check"
                            style={{ display: check ? 'block' : 'none' }} />
                    </div>
                </div>
            </div>
        )
    }
}
