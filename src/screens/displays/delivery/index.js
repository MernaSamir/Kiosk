import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pickBy, keys, get } from 'lodash';
import classes from './style.less'
import LeftPart from './left_part';
import RightPart from './right_part';
import Footer from '../footer'

class DeliveryDispatcher extends Component {

    state = {
        page: 1
    }

    handelPageClick = (op) => {
        const { page } = this.state
        const { list } = this.props
        let pageMax = Math.ceil((keys(pickBy(list, { parent: null, deleted: null, status: null })) || []).length / 14)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            this.setState({ page: page + op })
        }
    }

    render() {
        const { list } = this.props
        let pageMax = Math.ceil((keys(pickBy(list, { parent: null, status: null })) || []).length / 14)
        const status = { ready: 'Ready', late: 'Late', canceled: 'Failure' }
        return (
            <>
                <div className={classes.container}>
                    <LeftPart />
                    <RightPart />
                </div>
                <Footer handelPageClick={this.handelPageClick} page={this.state.page} pageMax={pageMax}
                    status={status} />
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    list: get(state.orders__main, 'data', {}),
})

export default connect(mapStateToProps)(DeliveryDispatcher)