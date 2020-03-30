import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import ButtonO from './button'
import moment from 'moment'
import { map, get } from 'lodash'
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker
import {withTranslation} from 'react-i18next'

const buttonList = [
    { name: 'Today', value: 'today' },
    { name: 'Yesterday', value: 'yesterday' },
    { name: 'This Week', value: 'this_week' },
    { name: 'Last Week', value: 'last_week' }
]
export class DatePickerPopup extends Component {


    handleChange = (date, dateString) => {
        const { setMain } = this.props
        setMain("orders__main", { filter: { 'date': { 'start': date[0], 'end': date[1] } } })

    }

    renderButtons = () => {
        return map(buttonList, (e, i) => {
            return <ButtonO b={e} i={i} handleButtons={this.handleButtons} />
        })
    }

    handleButtons = (value) => {
        const { setMain } = this.props

        let options = {
            'today': { start: moment().subtract(1, 'day'), end: moment() },
            'yesterday': { start: moment().subtract(2, 'day'), end: moment().subtract(1, 'day') },
            'this_week': { start: moment().subtract(1, 'week'), end: moment() },
            'last_week': { start: moment().subtract(2, 'week'), end: moment().subtract(1, 'day') }
        }
        let dateList = get(options, value, {})
        setMain("orders__main", { filter: { 'date': dateList } })
        setMain('popup',{popup:''})
    }

    render() {
        const { t } = this.props

        return (
            <div>
                <div className={style.container}>
                    <p className={style.title}>{t("Date Selecter")}</p>
                    <div className={style.button_container}>
                        {this.renderButtons()}
                    </div>
                    <div style={{ marginRight: '15vw' }}>
                        <RangePicker
                            onChange={this.handleChange}
                            open={true}

                        />
                    </div>

                </div>

            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(DatePickerPopup))
