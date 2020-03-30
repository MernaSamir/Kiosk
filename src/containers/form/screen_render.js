import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from 'form'
import mapDispatchToProps from 'helpers/actions/main'
import { get, isEqual, pick, map, toArray } from 'lodash'
import { ConnectAllApps } from "helpers/functions"

class ScreenRender extends Component {

    shouldComponentUpdate = (nextProps, nextState) => {
        const compare = ['appSetting']
        const su = !isEqual(pick(this.props, compare), pick(nextProps, compare));
        if (su) {
            this.getData(nextProps);
        }
        return su
    }
    componentDidMount() {
        this.getData(this.props);
    }
    getData = (props) => {
        const { appSetting } = props;
        ConnectAllApps(appSetting.tableList, [...get(appSetting, 'fetch', []), ...map(get(appSetting, 'layouts', []), d => d.reduxName)])
    }

    render() {
        return (
            <Form
                layouts={toArray(get(this.props, 'appSetting.layouts', {}))}
            />
        )
    }
}



const mapStateToProps = (state) => ({
    appSetting: get(state, 'apps.active', {})
})

export default connect(mapStateToProps, mapDispatchToProps)(ScreenRender)
