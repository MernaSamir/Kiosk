import React, { Component } from 'react'
import { Select } from 'antd'
import { range, map } from 'lodash';
import moment from 'moment'
import classes from './style.less';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next';

const Option = Select.Option
const list = range(0, 24).map(d => ({
    first: moment().set({ hour: d, minute: 0, second: 0 }),
    get last() { return moment(this.first).add(1, 'hour') }
}))
class TimeRange extends Component {
    renderOptions = () => {
      return  map(list, (d, i) => {
            return <Option key={i} value={d.first}>{d.first.format('HH:mm') + '-' + d.last.format('HH:mm')}</Option>
        })
    }
      handleChange = (value) => {
        const { setMain } = this.props
                setMain("parties__reservation", { 'selectedTime': value })

    }

    render() {
        const {width, t} = this.props
        return (
            <div className={classes.timepick} style={{width:width}}>

                <Select defaultValue={null} onChange={this.handleChange}>
                <Option value={null}>{t("Select Time")}</Option>
                    {this.renderOptions()}
                </Select>
            </div>
        )
    }
}
export default connect(null, mapDispatchToProps)(withTranslation()(TimeRange))