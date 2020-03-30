import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash'
import Header from './header';
import CustomerList from 'screens/Customer/CustomerList';
import classes from './style.less'

class Delivery extends Component {

    state = {
        page: 1,
    }

    handleClick = (value) => {
        const { list } = this.props
        const { page } = this.state
        const max = Math.ceil(Object.keys(list).length / 8)
        if (!(page <= 1 && value == -1) && !(page >= max && value == 1)) {
            this.setState({
                page: page + value
            })
        }
    }

    render() {
        const { match, list } = this.props
        const { page } = this.state
        const maxPage = Math.ceil(Object.keys(list).length / 8)
        return (
            <div className={classes.delivery_container}>
                <Header maxPage={maxPage} page={page} handleClick={this.handleClick} />
                <CustomerList match={match} delivery={true} page={page} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    list: get(state.parties__customer, 'data', {})
})

export default connect(mapStateToProps, mapDispatchToProps)(Delivery)