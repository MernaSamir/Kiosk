import React, { Component } from 'react'
import PanelControl from './control_panel'
import { Route, withRouter } from 'react-router-dom'

class Admin extends Component {
    render() {
        const { match } = this.props
        return (
            <div style={{ height: '100%' }}>
                <Route exact path={`${match.url}/`} component={PanelControl} />
            </div>
        )
    }
}

export default withRouter(Admin)