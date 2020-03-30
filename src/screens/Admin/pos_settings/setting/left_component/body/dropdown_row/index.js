import React, { Component } from 'react'
import classes from '../../../style.less'
import Dropdown from "components/dropdown"
import { find, get } from 'lodash'

export default class DropdownRow extends Component {

    state = {
        currentItem: 0,
    }

    setCurrentItem = (id) => {
        const { setAll, data, key = "id" } = this.props
        this.setState({
            currentItem: id
        }, () => {
            const mode = find(data, { [key]: this.state.currentItem })
            setAll([
                { type: 'set_path', path: 'update.mode', app: 'settings__filter', data: mode.id },
                { type: 'set_path', path: 'item.mode', app: 'settings__filter', data: mode.id },
                { type: 'set_path', path: 'pos_settings.mode', app: 'main', data: get(mode, key, '') },
            ])
        })
    }

    chooseMode = () => {
        const { getSettings, k } = this.props
        const { currentItem } = this.state
        getSettings(k, currentItem)
    }

    renderValue = () => {
        const { value } = this.props
        const { currentItem } = this.state
        if (currentItem != 0) {
            return currentItem
        }
        return value
    }

    renderDropdown = () => {
        const { data = {} } = this.props
        return <Dropdown data={data}
            btnClass={classes.combo}
            clickedclass={classes.combo}
            onChange={this.setCurrentItem}
            value={this.renderValue()} />
    }

    render() {
        const { name, } = this.props
        return (
            <div className={classes.groupings1}>
                <p >{name}</p>
                <div className={classes.Dropdown}>
                    {this.renderDropdown()}
                </div>
            </div>
        )
    }
}