import React, { Component } from 'react'
import Header from './header';
import classes from './style.less'
import Details from './details';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';

class ZReport extends Component {

    render() {
        const { data, settings } = this.props
        return (
            <div>
                <div className={classes.title_div}>
                    <p className={classes.title}>{get(settings, 'name', '')}</p>
                </div>
                <div className={classes.header_container}>
                    <Header businessDay={data.businessDay} data={data} />
                    <Details data={data} />
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    active: state.orders__business_days.active,
    data: get(state.report, 'data', {})
})
export default connect(mapStateToProps, mapDispatchToProps)(ZReport)
