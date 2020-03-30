import React, { Component } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash';
import Takeaway from './takeaway';
import DineIn from './dinein';
import Delivery from './delivery';
import { withTranslation } from 'react-i18next';


const HeaderComponents = {
    "DI": DineIn,
    "TW": Takeaway,
    "CC": Delivery,
    "EV": Delivery,
    "DL": Delivery,
    "CT": Delivery,
}

class Header extends Component {
    render() {
        const { mode, t } = this.props;
        const Component = get(HeaderComponents, mode.key);
        return Component ? <Component  t={t}/> : <></>
    }
}

const mapStateToProps = (state, ownProps) => ({
    mode: get(state.settings__mode, `data.${get(state.settings__mode, 'active')}`, {}),
})

export default withTranslation() (connect(mapStateToProps)(Header) )