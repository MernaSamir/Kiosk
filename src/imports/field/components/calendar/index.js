import React  , { Component } from 'react';
import { Calendar } from 'antd';
import moment from 'moment';
import classes from  './style.less'
class Calendar_ extends Component {
    onPanelChange=(value , mode)=> {
        const { field, target } = this.props;
        field.onChange({
            target: {
                name: target,
                value : moment(value)
            }
        })
    }

    render() {
        return (
            <div style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4 }} className={classes.div}>
                <Calendar fullscreen={false} mode={"month"} onChange={this.onPanelChange}
                validRange={[moment("1900-01-01"),moment("2090-01-01")]}
                  />
            </div>
        )
    }
}
export default Calendar_
