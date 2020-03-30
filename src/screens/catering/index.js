import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { keys, get } from 'lodash';
import CustomerList from 'screens/Customer/CustomerList';
import Header from './header'
import classes from './style.less'
import { multiRequest } from 'helpers';

class Catering extends Component {

    state = {
        page: 1
    }
    componentDidMount() {
        multiRequest({
             parties__Address:{},
            dropdowns__currencies:{},
        })
    }
    handleClick = (value) => {
        const { list } = this.props
        const { page } = this.state
        const max = Math.ceil(Object.keys(list).length / 10)
        if (!(page <= 1 && value == -1) && !(page >= max && value == 1)) {
            this.setState({
                page: page + value
            })
        }
    }

    render() {
        const { match, list } = this.props
        const { page } = this.state
        const maxPage = Math.ceil(keys(list).length / 10)

        return (
            <div className={classes.catering_container}>
                <Header maxPage={maxPage} page={page} handleClick={this.handleClick} />
                <CustomerList match={match} delivery={true} page={page} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    list: get(state.parties__customer, 'data', {})
})

export default connect(mapStateToProps, mapDispatchToProps)(Catering)