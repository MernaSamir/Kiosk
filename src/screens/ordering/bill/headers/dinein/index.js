import React, { Component } from 'react'
import SplitCheck from './actions/split_check'
import Course from './actions/course'
import Fire from './actions/fire'
import classes from './style.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import {isEmpty, get} from 'lodash';
import { withTranslation } from 'react-i18next';

class DineInHeader extends Component {
    constructor(props){
        super(props);
        if(isEmpty(props.seat)){
            props.setPath("orders__details", "item.seat_num", (props.order.guests_num > 1) ? 0:1)
        }
    }
    render() {
        const {t} = this.props
        return (
            <div className={classes.dineIn_header}>
                <SplitCheck t ={t}/>
                <Course t ={t}/>
                <Fire t ={t}/>
            </div>
        )
    }
}
export default connect((state)=>({
    seat: get(state.orders__details, 'item.seat_num', ''),
    order: get(state.orders__main.data, state.orders__main.active, {})
}), mapDispatchToProps)( withTranslation()(DineInHeader))
