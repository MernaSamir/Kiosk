import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from "helpers/functions/filters";
import { get, pickBy, map, max } from 'lodash'
import uuid from 'uuid/v4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.less'
import Details from './details';
import { message } from 'antd';
import Clock from 'helpers/components/clock'
import moment from 'moment'

class Row extends Component {
    constructor(props) {
        super(props);
        this.fun = { key: 'diff', compare: 'select.created_at', label: true }
    }
    state = {
        active: false,
        transform: "rotate(0deg)",
        transitionDuration: ".4s",
    }

    renderRow = () => {
        const { element } = this.props
        return <tr className={this.renderStyle()}
            onClick={this.renderFunctions.bind(this, element)} >
            {this.renderIcon()}
            {this.renerAddress(element)}
            {this.renderArea(element)}
            {this.renderTime(element)}
            {this.renderOrderNum(element)}
            <td>{element.note}</td>
            {this.renderPrint(element)}
        </tr >
    }

    renderStyle = () => {
        const { details } = this.props
        const status = map(details, d => d.status)
        const created_at = (moment().diff(max(map(details, d => d.created_at)), "minutes"))
        const prep_time = max(map(details, d => d.prep_time))
        if (status.includes("ready")) {
            return this.ifReady()
        }
        return this.ifLate(created_at, prep_time)
    }

    ifLate = (created_at, prep_time) => {
        if (created_at > prep_time) {
            if (this.state.active) {
                return classes.active
            }
            return classes.late
        }
    }

    ifReady = () => {
        if (this.state.active) {
            return classes.active
        }
        return classes.ready
    }

    renderFunctions = (element) => {
        const { history } = this.props
        if (history.location.pathname.includes('info')) {
            return this.AssignTo(element)
        }
        return this.active()
    }

    AssignTo = (element) => {
        const { setMain, user } = this.props
        setMain('orders__main', {
            item: {
                action: 'update', id: element.id, delivery_person: user.id,
                onSuccess() {
                    return [
                        {
                            type: 'set_path_orders__main', path: `data.${element.id}.delivery_person`,
                            data: user.id
                        },
                        {
                            type: 'set_main_orders__main',
                            data: { active: '' }
                        }
                    ]
                }
            }
        })
    }

    active = () => {
        if (this.state.active == false)
            this.setState({
                active: true,
                transform: 'rotate(180deg)'
            })
        else {
            this.setState({
                active: false,
                transform: 'rotate(0deg)'
            })
        }
    }

    renerAddress = (element) => {
        const address = applyFilters({
            path: `parties__address.data.${element.address}`
        }) || applyFilters({
            path: `licensing__location.data.${element.pick_location}`
        })
        return <td>
            {`${get(address, 'address', address.full_name)}`}
        </td>
    }

    renderArea = (element) => {
        const { addresses, streets, areas } = this.props
        const address = get(addresses, element.address, {})
        const street = get(streets, address.street, {})
        const area = get(areas, street.area, {})
        return <td>{area.name}</td>
    }

    renderTime = (element) => {
        return <td>            <Clock format="HH:mm" select={element} fun={this.fun} />
        </td>
    }

    renderOrderNum = (element) => {
        return <td>{element.num}</td>
    }

    renderIcon = () => {
        return <td>
            <FontAwesomeIcon icon="chevron-right" className={classes.icon}
                style={{
                    transform: this.state.transform,
                    transitionDuration: this.state.transitionDuration
                }}
            />
        </td>
    }

    check = () => {
        const { element } = this.props
        if (this.state.active) {
            return <Details id={element.id} />
        }
    }

    renderPrint = (order) => {
        return <td >
            <button className={classes.actions} onClick={this.printOrder.bind(this, order)} >
                <FontAwesomeIcon icon="print" className={classes.icon} />
            </button>
            <button className={classes.actions} onClick={this.payOrder.bind(this, order)}>
                <FontAwesomeIcon icon="dollar-sign" className={classes.icon} />
            </button>
        </td>
    }

    printOrder = (order) => {
        const { setMain } = this.props;
        const receipt = applyFilters({
            path: 'orders__receipt',
            key: 'Find',
            params: {
                order: order.id
            }
        }) || { id: uuid() }
        const details = applyFilters({
            key: 'Filter',
            path: 'orders__details',
            params: {
                order: order.id
            },
            then: {
                key: "Reject",
                params: {
                    deleted: true
                }
            }
        })
        const receipts = applyFilters({
            key: 'calculateOrderReceipt',
            path: 'orders__receipt',
        }, details, undefined, { combine: true, order: order.id, receipt: receipt.id })
        setMain('popup', { popup: { type: "Receipt", receipts: [{ id: receipt.id, ...receipts }] } });
    }
    payOrder = (order) => {
        const { history, setAll } = this.props
        const receipt = applyFilters({
            path: 'orders__receipt',
            key: 'Find',
            params: {
                order: order.id
            }
        })
        if (!receipt) {
            return message.error('please print receipt first')
        }
        setAll([{
            type: 'set_main_orders__main', data: { active: order.id }
        }, {
            type: 'set_main_orders__receipt', data: { active: receipt.id }
        }])
        history.push('/Home/payment')
    }
    // printOrder = (order) => {
    //     const { setMain } = this.props
    //     const receipt = applyFilters({
    //         key: 'Find',
    //         params: {
    //             order: order.id
    //         }
    //     }) || { id: uuid() }
    //     const calc = applyFilters({
    //         key: "Filter",
    //         path: 'orders__details',
    //         params: {
    //             order: order.id
    //         },
    //         then: {
    //             key: "Reject",
    //             params: {
    //                 deleted: true
    //             },
    //             then: {
    //                 key: 'calculateOrderReceipt',
    //             }
    //         }
    //     }, undefined, undefined, {
    //             order: order.id,
    //             receipt: receipt.id
    //         })

    //     const receipts = [{ id: receipt.id, ...calc }]
    //     const popup = {
    //         type: "Receipt", receipts, goto: '/dispatcher'
    //     }
    //     setMain('popup', { popup })
    // }
    // payOrder = (order) => {
    //     const { setAll, history } = this.props
    //     const receipt = applyFilters({
    //         key: 'Find',
    //         params: {
    //             order: order.id
    //         }
    //     })
    //     if (!receipt) {
    //         return message.error("Please Print Receipt First")
    //     }
    //     setAll([{
    //         type: 'set_main_orders__main', data: { active: order.id }
    //     }, {
    //         type: 'set_main_orders__receipt', data: { active: receipt.id }
    //     }])
    //     history.push('/Home/payment')
    // }

    render() {
        return (
            <>
                {this.renderRow()}
                {this.check()}
            </>
        )
    }
}

const mapStateToProps = (state, props) => ({
    user: get(state.auths__user, `data.${get(state.auths__user, 'activeDel', '')}`, {}),
    details: pickBy(pickBy(get(state.orders__details, 'data', {}), { parent: null }), { order: props.element.id }),
    addresses: get(state.parties__address, 'data', {}),
    streets: get(state.geographies__street, 'data', {}),
    areas: get(state.geographies__area, 'data', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Row))