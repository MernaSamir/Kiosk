import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { TakeAway } from './orders/details'
import Header from './headers'
import { connect } from 'react-redux'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import {isEqual, pick} from 'lodash'

class Bill extends Component {
    renderDetails() {
        const { handleChange, list , field} = this.props
        return <><div className={classes.order}>
            {
                <>
                    <TakeAway handleChange={handleChange} list={list} field={field}/>
                    {/* <BillCalculations /> */}
                </>
            }
        </div>
        </>
    }
    componentDidMount() {
      const {setMain} = this.props
      setMain("orders__details", {orderPopup: ''})
    }

    render() {
        const { payStatus } = this.props
        return (
            <>
            <div style={{ borderRight: 'white 1px solid' }}>

                <div className={payStatus ? `${classes.payment_bill} ${classes.myContainer}`
                    : `${classes.bill} ${classes.myContainer}`} >
                    <Header />
                    {this.renderDetails()}

                </div>
            </div>

            </>
        )
    }
}
export default withRouter(connect(null, mapDispatchToProps)(Bill))
