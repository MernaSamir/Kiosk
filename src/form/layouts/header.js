import React, { Component } from 'react'
import {connect} from 'react-redux';
import {get} from 'lodash'
import applyFilter from 'helpers/functions/filters';
class Header extends Component {
  render() {
    const {layout, show} = this.props;
    const showData = applyFilter(show || {key: 'GetDataSelector', show: 'name'}, {});
    const display = [layout.layoutName, showData].filter(d=>d).join(' - ')

    return <>
        {display}
    </>
  }
}
export default connect((state, props)=>({
    mainForm: get(state.form, props.layout.reduxName),
    show: get(props, 'layout.show', {key: 'GetDataSelector', show: 'name'})
}))(Header)