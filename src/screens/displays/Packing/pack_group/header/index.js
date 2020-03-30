import React, { Component } from 'react'
import { connect } from 'react-redux'
import classes from './../style.less'
import { get, groupBy, keys } from 'lodash'
import Clock from 'helpers/components/clock'
import IconBtn from 'screens/displays/clicked_icon'

class PackGroupHeader extends Component {
    
    constructor(props) {
        super(props);
        this.fun = {key: 'diff', compare: 'select.fired_time', label: true}
    }

    handelSelectOrder = (activePacking) => {
        const { setMain, orderDetails, changeStatus } = this.props;
        changeStatus()
        setMain('popup', {
            popup: {
                type: 'OrderView', width: "95%",
                childProps: {
                    activePacking,
                    orderDetails
                }
            }
        })
    }

    renderMode = () => {
        const { mode } = this.props
        if (mode.name == "Dine In") { return 'Di' }
        else if (mode.name == "Take Away") { return "Ta" }
        else { return "De" }
    }

    grouping() {
        const { orderDetails } = this.props;
        return groupBy(orderDetails, 'fired_time')
    }

    renderDiDetails = () => {
        const { order, mode, table } = this.props
        if (mode.name == "Dine In") {
            const g = order.guests_num
            const t = table && table.name
            return `/T:${t} G:${g}`
        }
        return ''
    }

    renderGroupByBtn = () => {
        const g_keys = keys(this.groups)
        return <button
            className={classes.button}
            type='button' onClick={this.openGB}>
            {g_keys.length}
        </button>
    }

    openGB = () => {
        this.seen_groups = this.groups;
        const { setMain } = this.props;
        setMain('popup', {
            popup: {
                type: 'SplitPacking', width: "95%", height: '90vh',
                childProps: {
                    groups: this.groups
                }
            }
        })
    }

    PackingGroupHeader = () => {
        const { order, orderDetails } = this.props
        const select = get(orderDetails, '[0]', {})
        return <>
            <div key={1} className={classes.headerFlex}>
                <div className={classes.orderName}>
                    {`${this.renderMode()} ${order.num} ${this.renderDiDetails()}`}
                </div>
                {this.renderGroupByBtn()}
                <IconBtn name="square" onClick={this.handelSelectOrder.bind(this, order.id)} />
            </div>
            <div key={2} className={classes.statusBox}>
                <Clock format="HH:mm" select={select.fired_time} />
                <Clock format="HH:mm" select={select} fun={this.fun} />
            </div>
        </>
    }

    render() {
        this.groups = this.grouping()
        return (
            this.PackingGroupHeader()
        )
    }
}

const mapStateToProps = (state, props) => ({
    mode: get(state.settings__mode.data, props.order.mode, {}),
    table: get(state.dinin__tables.data, props.order.table, {}),
})

export default connect(mapStateToProps)(PackGroupHeader);