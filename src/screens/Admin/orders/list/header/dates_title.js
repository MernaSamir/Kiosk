import React, { Component } from 'react'
import style from './style.less'
import { connect } from 'react-redux'
import { get, isEmpty } from 'lodash';
import moment from 'moment'

export class dates_title extends Component {

    renderDates = () => {
        const { dates } = this.props
        if (!isEmpty(dates)) {
            return moment(dates.start).format('YYYY-MM-DD') + '  ~  ' + moment(dates.end).format('YYYY-MM-DD')
        }else {return 'Today'}
    }

    render() {
        const{t} = this.props
        return (
            <div className={style.dates}>
               { t('Orders')}:  &nbsp;&nbsp; {this.renderDates()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    dates: get(state, 'orders__main.filter.date', {})
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(dates_title)
