import React, { Component } from 'react'
import { Select } from 'antd'
import { range, map } from 'lodash';
import { moment } from 'moment'
import classes from './style.less';
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
const Option = Select.Option
const list = range(0, 24).map(d => ({
    first: moment().set({ hour: d, minute: 0, second: 0 }).utcOffset(1),
    get last() { return this.first.add(1, 'hour') }
}))
class TimeRange extends Component {
    renderOptions = () => {
      return  map(list, (d, i) => {
            return <Option key={i} value={d.first}>{d.first.format('HH:mm:ss') + '-' + d.last.format('HH:mm:ss')}</Option>
        })
    }
      handleChange = (value) => {
        const { setMain } = this.props
                setMain("parties__reservation", { 'selectedTime': value })

    }

    render() {
        return (
            <div className={classes.timepick}>

                <Select defaultValue="Select Time" onChange={this.handleChange}>
                    {this.renderOptions()}
                </Select>
            </div>
        )
    }
}
export default connect(null, mapDispatchToProps)(TimeRange)