import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import style from './application.less'
import NavMenu from './BackOffice/menu/menu'
import mainApptoScreenRender from './mainApptoScreenRender'
import { Route } from 'react-router-dom';
import { apps } from 'helpers/apps'
import { get, isEmpty } from 'lodash'


class MainAPP extends Component {

    constructor(props) {
        super(props)
        const { setAll, activeApp, history } = props
        let dis = [
            {app: 'apps', type: 'set_main', data: { 'data': apps }},
            {app: 'application_settings', type: 'set_main', data: { 'navMenuCollapsed': false, 'listCollapsed': false }},
        ]
        if (history.location.pathname == '/app' && !isEmpty(activeApp.data)) {
            const firstModel = activeApp.data ? activeApp.data[Object.keys(activeApp.data)[0]] : ''
            let firstApp = firstModel.data ? firstModel.data[Object.keys(firstModel.data)[0]] : ''
            if (!firstApp.path) {
                firstApp = firstApp.sub ? this.getSubApplication(firstApp.sub) : ''
            }
            dis.push({app: 'apps', type: 'set_main', data: { active: firstApp }})
            dis.push({app: 'application_settings', type: 'set_main', data: { 'navMenuCollapsed': true }})
            history.push('/app' + firstApp.path)
        }
        setAll(dis)
    }
    getSubApplication(sub){
        const data = sub[0];
        if(data.sub){
            return this.getSubApplication(data.sub)
        }
        return data
    }

    renderMenu = () => {
        const { homeApp } = this.props
        if (isEmpty(!homeApp)) {
            return <NavMenu />
        }
    }

    render() {
        const { match } = this.props
        const backOfficeBody = {
            display: 'block',
            width: '100vw'
        }

        return (
            <div>
                <div style={backOfficeBody} className={style.backOfficebody}>
                    {this.renderMenu()}
                    <Route path={`${match.url}/:appUrl/:item?`} component={mainApptoScreenRender} />
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    homeApp: get(state, 'apps', {}),
    get activeApp() { return get(this.homeApp.data, `${this.homeApp.name}`, {}) },
    navMenuCollapsed: get(state, 'application_settings.navMenuCollapsed', {}),

})

const wrapper = connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(MainAPP)
export default withRouter(wrapper)
