import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { map, get, find } from 'lodash'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Types extends Component {

    mapping = () => {
        const { list, show, add } = this.props
        return [
            map(list, d => (
                <div className={this.checkclassName(d.id)} onClick={this.chechType.bind(this, d)}>
                    {get(d, show, "")}
                    {this.displayIcon(d.id)}
                </div>
            )), add && this.addNewAddress()
        ]
    }

    checkclassName = (element) => {
        const { list, pickup } = this.props
        const active = find(list, { is_active: true }) || pickup
        if (active) {
            if (element == active.id) {
                return classes.activerow
            }
        }
        return classes.row
    }

    displayIcon = (element) => {
        const { list, pickup } = this.props
        const active = find(list, { is_active: true }) || pickup
        if (element == active.id) {
            return <FontAwesomeIcon icon="check" />
        }
    }

    chechType = (element) => {
        const { activeSub, setMain, active } = this.props
        if (activeSub == "pickup") {
            setMain('licensing__location', { pickup: element.id })
            setMain('settings__sub_mode', { active })
        }
        else {
            this.activeNewAddress(element)
        }
    }

    activeNewAddress = (element) => {
        const { setMain, appName, list, active } = this.props
        const old = find(list, { is_active: true })
        const data = [{ id: old.id, is_active: false }, { id: element.id, is_active: true }]
        setMain(appName, { item: { data, action: 'bulkEdit' } })
        setMain('settings__sub_mode', { active })
    }

    addNewAddress = () => {
        return <div className={classes.add} >
            <div className={classes.border}></div>
            <div onClick={this.onClick.bind()}>
                <FontAwesomeIcon icon="plus" />
                <p>Add New Address</p>
            </div>

        </div>
    }

    onClick = () => {
        const { setMain, customer } = this.props
        setMain('popup', {
            popup: {
                type: 'AddNewAddress',
                visable: true, width: '90vw',
                border: '1.5px solid #13488b',
                childProps: {
                    customer
                }
            }
        })
    }

    render() {
        return (
            this.mapping()
        )
    }
}

const mapStateToProps = (state) => ({
    pickup: get(state.licensing__location.data, state.licensing__location.pickup, {})
})

export default connect(mapStateToProps, mapDispatchToProps)(Types)