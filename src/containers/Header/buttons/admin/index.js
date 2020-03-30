import React, { Component } from 'react'
import style from './../style.less'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { message } from 'antd';

export class admin extends Component {
    admin = () => {
        const { history, activeOrder, mode, setMain } = this.props
        if (!(activeOrder && mode.key == 'TW')) {
            history.push('/admin')
        }
        else if (history.location.pathname == "/admin/admin_orders"){
            history.push('/admin')
        }
        else{
            message.warning('There is an open order, Please close it first!')
        }
        setMain('main',{search:''})
    }
    render() {
        return (
                <FontAwesomeIcon className={style.icon} icon ='th'  onClick={this.admin}/>
        )
    }
}

const mapStateToProps = (state) => ({
    mode: get(state.settings__mode, `data.${get(state.settings__mode, 'active')}`),
    activeOrder: get(state.orders__main, 'active', false)
})


const wrapper = connect(mapStateToProps)(admin)
export default withRouter(wrapper)

