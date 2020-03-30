import React, { Component } from 'react'
import classes from './style.less'
import List from './list'
import Bill from './bill'
import mapDispatchToProps from 'helpers/actions/main';
import { connect } from 'react-redux';
import { get } from 'lodash';
import {withTranslation} from 'react-i18next'

class OrdersAdmin extends Component {

    componentWillUnmount(){
        const {setAll} = this.props;
        setAll([
            {type: 'set_main', app: 'dinin__tables', data: {active: ''}},
            {type: 'set_main', app: 'orders__main', data: {active: ''}},
            {type: 'set_main', app: 'orders__receipt', data: {active: ''}},
        ])
    }

    render() {
        const{receipt, t} = this.props
        return (
            <div className={classes.admin_order_contanier}>
                <List t={t}/>
                {receipt&& <Bill t={t}/>}
            </div>
        )
    }
}

const mapStateToProps = (state)=>({
    receipt:get(state.orders__receipt, 'active', '')
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrdersAdmin) )