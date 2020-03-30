import React, { Component } from 'react'
import { message } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import style from './style.less'
import AdminButton from './admin'
import BusinessDayShifts from './Business_day_shift'
import Modes from './modes'
import User from './user'
import applyFilters from "helpers/functions/filters";
import { withTranslation } from 'react-i18next'
import Notifications from './notifications'
import { ConnectAllApps } from "helpers/functions"

export class Buttons extends Component {

    constructor(props){
        super(props)
        ConnectAllApps(props, ["settings__notifications"])
    }

    handelOrderQueue = () => {
        const { isOrderActive, history } = this.props
        if (isOrderActive) {
            message.error("You have to close current order .. !")
        } else {
            history.push('/holdorder')
        }
    }

    renderPreModes = () => {
        const { history, mode = {}, t } = this.props
        let list = {
            'DL': <button className={style.header_btn}>Order Status</button>,
            'DI': <button className={style.header_btn} onClick={() => history.push('/floor-plan')}>{t('Floorplan')}</button>
        }
        let button = get(list, mode.key, undefined)
        return button
    }

    openOrderQueue = () => {
        const { order, history } = this.props
        if (order) {
            message.warning('There is an open order, Please choose a customer first!')
        }
        else {
            history.push('/call_center_list')
        }
    }

    renderAfterModes = () => {
        const { mode = {}, station = {}, t } = this.props
        let orderslist = applyFilters({
            key: 'Filter',
            path: 'orders__main',
            params: {
                end_time: null
            },
            then: {
                key: 'Reject',
                params: {
                    hold_time: null
                }
            }
        })
        let list = {
            'TW': <button className={style.header_btn} style={{ display: 'flex', justifyContent: 'space-around' }}
                onClick={this.handelOrderQueue}>{t("Orders Queue")} {orderslist.length || 0}
                {/* <span className={style.span}>{orderslist.length||0}</span> */}
            </button>,
            'DI': (station._type == 'pos') && <button className={style.header_btn}
                onClick={() => this.props.history.push('/reservations')}>{t('Reservations')}</button>,
            'EV': <button className={style.header_btn}
                onClick={() => this.props.history.push('/event_list')}>{t('Reservations')}</button>,
            'CC': <button className={style.header_btn}
                onClick={this.openOrderQueue.bind()}>{t("Orders Queue")}</button>,
            'CT': <button className={style.header_btn}
                onClick={() => this.props.history.push('/catring_list')}>{t("Orders Queue")}</button>,
        }
        let button = get(list, mode.key, undefined)
        return button
    }
    orderStaff = () => {
        const { history } = this.props
        history.push("./staff")

    }
    render() {
        const { shift, station, t, setMain } = this.props
        return (
            <div className={style.header_btns} >
                <div className={style.start}>
                    <BusinessDayShifts />
                </div>
                <div className={style.center}>
                    {shift && this.renderPreModes()}
                    {shift && this.renderAfterModes()}
                    {shift && <Modes t={t} />}
                    {/* <button className={style.card_btn} onClick={this.orderStaff}>
                        <FontAwesomeIcon icon= {["far", "id-card"]} /></button> */}

                </div>
                <div className={style.end}>
                    {station._type != 'sma_w' && <AdminButton setMain={setMain} />}
                    <Notifications history={this.props.history}/>
                    <User />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mode: get(state.settings__mode, `data.${get(state.settings__mode, 'active')}`),
    isOrderActive: !!get(state, 'orders.active'),
    shift: state.orders__shifts.active,
    station: get(state.licensing__station.data, state.licensing__station.active, {}),
    data: state.orders__main.data,
    order: state.orders__main.active,
})

const wrapper = connect(mapStateToProps, null)(Buttons)
export default withRouter(withTranslation()(wrapper))
