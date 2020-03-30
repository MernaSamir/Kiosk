import React, { Component } from 'react'
import { connect } from 'react-redux'
import Fun from './fun'
export class Clock extends Component {
    render() {
        const {fun} = this.props
        return (
            <span>
                {Fun(fun, this.props)}
            </span>
        )
    }
}

const mapStateToProps = (state) => ({
    time: state.main.time
})

export default connect(mapStateToProps)(Clock)
