import React, { Component } from 'react'
import { TimePicker } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import './style.css'
class TimePicker_ extends Component {
    onChange = (time) => {
        const { field } = this.props;
        field.onChange({
            target: {
                name: field.name,
                value : time
            }
        })
    }
    render() {
        const {onChange, className, field} = this.props
        return (
            <TimePicker size="large" 
               allowClear = {false}
            value={moment(field.value)} 
             onChange={onChange||this.onChange} 
             defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
             className={className} />

    )
    }
}
export default connect(null, mapDispatchToProps)(TimePicker_)
