import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Shifts from './shifts'
import Actions from './actions';
// import Options from './options';
import Filters from './filters';
import Header from 'components/header_back'
import classes from './style.less'
import BusinessDay from './business_day';

class Filter extends Component {

    renderBd = (businessDay) => {
        const {  t } = this.props
        if (businessDay) {
            return <BusinessDay t={t}/>
        }
    }

    renderOp = (option) => {
        const { t } = this.props
        if (option) {
            return <>{t('OPTIONS')}</>
            // <Options handelChange={this.handelChange} values={this.state} />
        }
    }

    render() {
        const { settings, t } = this.props
        return (
            <div className={classes.root}>
                <Header name={settings.name} t={t}/>
                {this.renderBd(settings.businessDay)}
                <Shifts t={t}/>
                <Filters t={t}/>
                {this.renderOp(settings.option)}
                <Actions settings={settings} t={t}/>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    businessDay: state.orders__business_days.active
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter)