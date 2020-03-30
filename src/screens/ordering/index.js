import React, { Component, Suspense } from 'react'
import Loading from "helpers/components/loading";

// import Home from 'containers/app-container'
const Quantity = React.lazy(() => (
    import('screens/Quntity')
));

const Modifires = React.lazy(() => (
    import('screens/Modifiers')
));
// import Discount from 'screens/Discount'
const Combo = React.lazy(() => (
    import('screens/combo')
));
const CustomMix = React.lazy(() => (
    import('screens/custom_mix')
));
const Payment = React.lazy(() => (
    import('screens/Payment')
));
const Paymentt = React.lazy(() => (
    import('screens/Payment/left_part')
));
const Discount = React.lazy(() => (
    import('screens/Discount')
));

import Bill from './bill'
import DineInBill from './bill/dinein_bill'
import OrderList from './orderList'
import Search from './orderList/MenuCategory/list/search'

import Favorite from './orderList/MenuCategory/list/favorite'
import { Route } from 'react-router-dom'
import { get } from 'lodash'
import { connect } from 'react-redux'
import classes from './style.less'
import Popup from './bill/orders/details/popup';
import { withRouter } from 'react-router-dom'


class Ordering extends Component {
    renderMode = () => {
        const { mode = {} } = this.props
        if (mode.key != "DI") {
            // if (history.location.pathname == "/Home/payment") {
            //     return this.renderPayment()
            // }
            return <Bill />
        }
        else {
            return <DineInBill />
        }
    }

    renderPayment = () => {
        return <Paymentt />
    }


    render() {
        return (
            <div className={classes.app_body}>
                <div className={classes.popup} >
                    {this.renderMode()}
                    <Popup />
                </div>
                <Suspense fallback={<Loading />}>
                    <Route exact path={`${this.props.match.url}/`} component={OrderList} />
                    <Route path={`${this.props.match.url}/favorite`} component={OrderList} />
                    <Route path={`${this.props.match.url}/search`} component={OrderList} />
                    <Route path={`${this.props.match.url}/combo`} component={Combo} />
                    <Route path={`${this.props.match.url}/custom_mix`} component={CustomMix} />
                    <Route path={`${this.props.match.url}/quantity`} component={Quantity} />
                    <Route path={`${this.props.match.url}/modifires`} component={Modifires} />
                    <Route path={`${this.props.match.url}/payment`} component={Payment} />
                    <Route path={`${this.props.match.url}/discount`} component={Discount} />
                </Suspense>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    mode: get(state.settings__mode, `data.${get(state.settings__mode, 'active')}`),
})

export default withRouter(connect(mapStateToProps, null)(Ordering))