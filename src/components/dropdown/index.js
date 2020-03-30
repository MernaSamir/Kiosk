import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Icon } from "antd"
import ClickOutSide from 'helpers/components/click';
import { withTranslation } from 'react-i18next'
import { message } from 'antd';
import { map, get, find } from 'lodash'
import classes from './style.less'
import './dropdown.css'

class Dropdown extends Component {

    state = {
        display: "none",
        className: this.props.btnClass
    }

    displayDropdown = () => {
        const { display } = this.state
        const { disabled } = this.props
        if (!disabled) {
            if (display == "none") {
                this.setState({
                    display: "block",
                    className: this.props.clickedclass
                })
            }
            else {
                this.setState({
                    display: "none",
                    className: this.props.btnClass
                })
            }
        }
        else {
            message.warning('There is an open order, Please close it first!')
        }
    }

    renderRows = () => {
        const { data, onChange, value, show = {}, only, fontSize, t } = this.props
        const { display } = this.state
        return display != 'none' && <ClickOutSide onClick={this.displayDropdown}>

            {map(data, (row) => {
                return <div key={row.id} className={classes.dropdown_row} onClick={onChange.bind(this, row.id, row)}>
                    <span style={{ fontSize: fontSize }}>{get(row, (only ? show : show.field), t(row.name))}</span>
                    <Icon style={{ display: row.id == value ? "block" : "none" }} className={classes.dropdown_check} type='check' />
                </div>
            })}
        </ClickOutSide>
    }

    render() {
        const { value, data, key = "id", show = "name", t } = this.props
        const selected = find(data, { [key]: value }) || {}
        return (
            <button type='button' className={this.state.className} onClick={() => this.displayDropdown()}>
                {this.props.children} {t(get(selected, show, ''))}
                <FontAwesomeIcon className={classes.mood_icon} icon="caret-down" />
                <div style={{ display: this.state.display }} className={classes.dropdown_list}>
                    {this.renderRows()}
                </div>
            </button>
        )
    }
}

export default withTranslation()(Dropdown)