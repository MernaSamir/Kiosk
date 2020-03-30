import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'helpers/actions/main'
import { isEqual, pick, get } from 'lodash'
import { TakeAway } from './orders/details'
import Header from './headers'
import BillCalculations from './calculations'
import DeliveryCalc from './calculations/delivery';
import classes from './style.less'

class Bill extends Component {

    state = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
    };

    // componentDidUpdate(prevProps) {
    //     const {SetMain} = this.props
    //     if(!isEqual(prevProps.list,this.props.list)){
    //         this.getData()
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['order']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }

    // renderFooter = () => {
    //     return <BillFooter />
    // }

    renderCalc = () => {
        const { mode } = this.props
        if (mode.key == "CC"|| mode.key == "EV") {
            return <DeliveryCalc />
        }
        return <BillCalculations />
    }

    renderDetails() {
        const { order } = this.props;
        if (order) {
            return <><div className={classes.order}>
                {
                    order && <>
                        <TakeAway />
                        {this.renderCalc()}
                    </>
                }
            </div>
                {/* {this.renderFooter()} */}
            </>
        }
    }

    componentDidMount() {
        const { setMain } = this.props
        setMain("orders__details", { orderPopup: '' })
    }

    render() {
        const { payStatus } = this.props
        return (
            <div style={{ borderRight: 'white 1px solid', height: '100%' }}>

                <div className={payStatus ? `${classes.payment_bill} ${classes.myContainer}`
                    : `${classes.bill} ${classes.myContainer}`} >
                    <Header />
                    {this.renderDetails()}

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        discounts: state.orders__orders_discount.data,
        order: state.orders__main.active,
        get mode_id() { return get(state.orders__main.data, this.order, {}).mode },
        get mode() {
            return get(state.settings__mode.data, (this.mode_id), {})
        }
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Bill))