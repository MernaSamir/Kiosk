import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import { DatePicker } from 'antd';
const { RangePicker } = DatePicker;
// import classes from './style.less'
import moment from 'moment';
import { get } from 'lodash'

class business_day extends Component {

    onChange = (date, dateString) => {
        const { setMain, filters } = this.props
        setMain('report', { filters: { 
            ...filters, 
            start: moment(date[0]).startOf('day').format(), 
            end: moment(date[1]).endOf('day').format() 
        } })
    }

    constructor(props) {
        super(props);
        const { getShifts } = this;
        this.state = {
            businessDay: props.businessDay,
            get shifts() { return getShifts(this.businessDay || '') }
        }
    }

    getShifts(bd) {
        return applyFilters({
            key: 'Filter',
            path: "orders__shifts",
            params: {
                date: bd
            }
        })
    }

    render() {
        // const { shifts, shift } = this.state;
        const { t } = this.props
        return (
            <div> <p>{t("Business Day")}</p>
                <RangePicker onChange={(date, dateString) => this.onChange(date, dateString)} />

                {/* <Dropdown data={shifts} value={shift} show="shift_num"
                    onChange={handelChange.bind(this, 'shift')}
                    style={{ width: '100%' }}
                    name='shift' />
                <Dropdown data={shifts} value={shift} show="shift_num"
                    onChange={handelChange.bind(this, 'shift')}
                    style={{ width: '100%' }}
                    name='shift' /> */}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    businessDay: state.orders__business_days.active,
    business_days: state.orders__business_days.data,
    filters: get(state.report, 'filters', {}),

})

export default connect(mapStateToProps, mapDispatchToProps)(business_day)