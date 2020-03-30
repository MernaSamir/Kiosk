import React, { Component } from 'react'
import splitCheck from 'assets/images/Group 1808@3x.png'
import {withRouter} from 'react-router-dom'
import classes from './style.less';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import { message } from 'antd';

class SplitCheck extends Component {


    splitCheck = () => {
        const {history, setMain, order} = this.props
        if(order.guests_num <= 1){
            message.warning("There's Only One Guest")

        }
        else{

            setMain('orders__details', {active: ''})
            history.push('/split-check')
        }
        
    }

    render() {
        const{t} = this.props
        return (
            <button className={classes.btn} onClick={this.splitCheck.bind(this)}>
                <img  src={splitCheck} />
                <span>{t('Edit Split Check')}</span>
            </button>
        )
    }
}
const mapStateToProps=state=>({
    order: get(state.orders__main, `data.${state.orders__main.active}`, "")
})

export default connect(mapStateToProps, mapDispatchToProps)( withRouter(SplitCheck) )
