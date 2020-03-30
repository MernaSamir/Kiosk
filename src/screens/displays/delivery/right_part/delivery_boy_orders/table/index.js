import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import { withRouter } from 'react-router-dom'
import { get, map, pickBy, find, head } from 'lodash'
import { message } from 'antd'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Clock from 'helpers/components/clock'

class Table extends Component {
    constructor(props) {
        super(props);
        this.fun = { key: 'diff', compare: 'select.created_at', label: true }
    }
    renderTable = () => {
        return <table>
            <thead>
                {this.renderHead()}
            </thead>
            <tbody>
                {this.renderBody()}
            </tbody>
        </table>
    }

    renderHead = () => {
        const headers = ["", "Address", "Area", "Time", "ORD", "Notes", "Status"]
        return <tr>{headers.map((d, i) => <th key={i} >{d}</th>)} </tr>
    }

    renderBody = () => {
        const { modes, user } = this.props
        const delivery = find(modes, { key: 'DL' }) || find(modes, { key: 'CC' })
        let list = applyFilters({
            key: 'Filter',
            path: 'orders__main',
            params: {
                mode: get(delivery, 'id', ''),
                delivery_person: user.id,
                delivery_status: 0,
                status: 'stl'
            },
            then: {
                key: 'Reject',
                params: {
                    address: null
                }
            }
        })
        
        list = [...list, ...applyFilters({
            key: 'Filter',
            path: 'orders__main',
            params: {
                mode: get(delivery, 'id', ''),
                delivery_person: user.id,
                delivery_status: 0,
                status: 'failed'
            },
            then: {
                key: 'Reject',
                params: {
                    address: null
                }
            }
        })]

        // pickBy(this.orders, { mode: get(delivery, 'id', ''), delivery_person: user.id, delivery_status: 0 })
        return map(list, o => (
            this.renderOrder(o)
        ))
    }

    renderOrder = (element) => {
        return <tr className={this.renderStyle()} >
            {this.renderIcon()}
            {this.renerAddress(element)}
            {this.renderArea(element)}
            {this.renderTime(element)}
            {this.renderOrderNum(element)}
            <td>{element.note}</td>
            {this.renderStatus(element)}
        </tr >
    }

    renderStyle = () => {

        return
    }

    renderIcon = () => {
        return <td>
            <FontAwesomeIcon icon="chevron-right" className={classes.icon} />
        </td>
    }

    renerAddress = (element) => {
        const { addresses } = this.props
        const address = get(addresses, element.address, {})
        return <td>
            {`${address.address}`}
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
        return <td>
            <Clock format="HH:mm" select={element} fun={this.fun} />
        </td>
    }

    renderOrderNum = (element) => {
        return <td>{element.num}</td>
    }

    renderStatus = (element) => {
        return <td>
            <div className={classes.status_btn}>
                {this.renderSuccesBtn(element)}
                {this.renderFailBtn(element)}
            </div>
        </td>
    }
    payOrder = (order) => {
        const { history, setAll } = this.props
        const receipt = applyFilters({
            path: 'orders__receipt',
            key: 'Find',
            params: {
                order: order
            }
        })
        if (!receipt) {
            return message.error('please print receipt first')
        }
        setAll([{
            type: 'set_main_orders__main', data: { active: order }
        }, {
            type: 'set_main_orders__receipt', data: { active: receipt.id }
        }])
        history.push('/Home/payment')
    }
    renderSuccesBtn = (element) => {
        return <button type="button" onClick={this.payOrder.bind(this, element.id)}>
            <FontAwesomeIcon icon="dollar-sign" />
        </button>
    }

    succes = (id) => {
        const { setMain, history } = this.props
        const popup = {
            type: 'CallCenterPay', visable: true, width: "50%"
        }
        setMain('popup', { popup })
        // setMain('orders__main', {
        //     item: {
        //         id: id, end_time: new Date(), delivery_status: 1, action: 'update',
        //         onSuccess: this.openPopup.bind()
        //     }
        // })
    }

    openPopup = () => {
        const { history } = this.props
        history.push('/dispatcher')
        return [
            {
                type: 'set_main_popup', data: {
                    popup: {
                        type: 'Save', visable: true, width: "50%",
                        childProps: {
                            msg: 'Delivery Person Orders Complete',

                        }
                    }
                }
            },
            {
                type: 'set_main_orders__main', data: { active: '' }
            }
        ]
    }

    renderFailBtn = (element) => {
        return <button type="button" onClick={this.fail.bind(this, element)}>
            <FontAwesomeIcon icon="unlink" />
        </button>
    }

    fail = (element) => {
        const { setMain } = this.props
        console.log("ORFF ", element)
        setMain('popup', {
            popup:
            {
                type: 'AddNote', visable: true, width: "90%",
                childProps: {
                    order: element,
                    fail: true,
                    onClick: this.onClick
                }
            }
        })
    }

    onClick = (order, note) => {
        const { setMain } = this.props
        console.log("NOTEEE ", note, order)
        setMain('orders__main', {
            item: {
                id: order.id, status: 'failed', note, delivery_person: null, action: 'update'
            }
        })
    }

    render() {

        this.orders = applyFilters({
            key: 'Filter',
            path: "orders__main",
            then: {
                key: 'Reject',
                params: {
                    address: null
                }
            }
        })

        return (
            <div className={classes.table}>
                {this.renderTable()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    orders: get(state.orders__main, 'data', {}),
    modes: get(state.settings__mode, 'data', {}),
    user: get(state.auths__user, `data.${get(state.auths__user, 'activeDel', '')}`, {}),
    addresses: get(state.parties__address, 'data', {}),
    streets: get(state.geographies__street, 'data', {}),
    areas: get(state.geographies__area, 'data', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Table))