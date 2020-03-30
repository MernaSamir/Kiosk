import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import  classes from './style.less'

class Actions extends Component {

    printing = () => {
        const { setMain, settings } = this.props;
        setMain('Printing', {
            print: {
                active: 'ReportDetails',
                settings
            }
        })
    }
    
    goBack = () => {
        this.props.history.goBack()
    }

    render() {
        const {t}= this.props
        return (
            <div className={classes.saveBtns}>
                <button onClick={this.goBack}>{t("Cancel")}</button>
                <button onClick={this.printing}>{t("Print")}</button>
            </div>
        )
    }
}



const mapStateToProps = (state, props) => ({
    reportData: state.report
})

export default connect(mapStateToProps, mapDispatchToProps)(Actions)
