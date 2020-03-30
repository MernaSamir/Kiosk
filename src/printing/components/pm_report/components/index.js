import React, { Component } from 'react'
import Header from './header';
import classes from './style.less'
import Details from './details';
import moment from 'moment';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'

 class ZReport extends Component {
    renderTime = (date) => {
        return moment(date).format('lll')
    }

    render() {
        const {data}= this.props
        return (
            <div className={classes.header_container}>
                <Header businessDay={data.businessDay} data={data} renderTime={this.renderTime}/>
                <Details data={data}/>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    active: state.orders__business_days.active,
})
export default connect(mapStateToProps, mapDispatchToProps)(ZReport)
