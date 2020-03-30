import React, { Component } from 'react'
import {get} from 'lodash';
import {connect} from 'react-redux'
import Takeaway from './takeaway';
const HeaderComponents = {
    "TW": Takeaway
}
class Header extends Component {
    render () {
        const {mode} = this.props;
        const Component = get(HeaderComponents, mode.key);
        return Component ? <Component />:<></>
    }
}
const mapStateToProps = (state, ownProps) => ({
    mode: get(state.settings__mode, `data.${get(state.settings__mode, 'active')}`, {}),
})
export default connect(mapStateToProps)(Header)
