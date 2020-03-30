import React, { Component } from 'react'
import Header from './header';
import classes from './style.less'
import Details from './details';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
import { Spin } from 'antd';
class ReportDetailsClass extends Component {

    renderContent = () => {
        const { settings, loading } = this.props
        if (loading) {
            return <div className={classes.container}>
                <Spin size="large" />
            </div>
        } else {
            return <div>
                <div className={classes.title_div}>
                    <p className={classes.title}>{get(settings, 'name', '')}</p>
                </div>
                <div className={classes.header_container}>
                    <Header />
                    <Details settings={settings} />
                </div>
            </div>
        }
    }

    render() {
        return (
            this.renderContent()
        )
    }
}
const mapStateToProps = (state, props) => ({
    loading: get(state.report, 'loading', false),
})
const ReportDetails = connect(mapStateToProps, mapDispatchToProps)(ReportDetailsClass)
export default ReportDetails
