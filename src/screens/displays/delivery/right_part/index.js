import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Orders from './orders';
import DeliveryBoyOrders from './delivery_boy_orders';

class RightPart extends Component {

    rendering = () => {
        const { history } = this.props
        if (history.location.pathname.includes("info") || history.location.pathname == "/dispatcher") {
            return this.gotoDefualt()
        }
        return this.gotoUsername()
    }

    gotoUsername = () => {
        const { match } = this.props
        return < Route exact path={`${match.url}/:username`} component={DeliveryBoyOrders} />
    }

    gotoDefualt = () => {
        const { match } = this.props
        return <Route path={`${match.url}/`} component={Orders} />
    }

    render() {
        return (
            this.rendering()
        )
    }
}

export default withRouter(RightPart)