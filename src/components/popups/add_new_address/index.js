import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Form from 'helpers/wrap/form.js';
import applyFilters from 'helpers/functions/filters'
import Address from 'screens/Customer/info/address'
import classes from './style.less'
import {withTranslation} from 'react-i18next'

class AddNewAddress extends Component {

    constructor(props) {
        super(props);
        const address = applyFilters({
            key: 'Find',
            path: 'parties__address',
        })
        this.initialValues = {
            address
        }
    }

    static onSubmit(props, values) {
        this.savingData.call(this, props, values.address);
    }

    static savingData(props, values) {
        const { setMain, customer } = props;
        const mValues = { ...values, 'customer': customer }
        setMain('parties__address', {
            item: {
                ...mValues, action: 'add', onSuccess: () => {
                    return [
                        { type: 'set_main_popup', data: { popup: { popup: {} } } },
                    ]
                }
            }
        })
    }

    renderBtns = () => {
        const { t } = this.props

        return <div className={classes.btns}>
            <button type="button" onClick={this.cancel.bind()}>{t("Cancel")}</button>
            <button type="submit" id={classes.save}>{t("Save")}</button>
        </div>
    }

    cancel = () => {
        const { setMain } = this.props
        setMain('popup', { popup: {} })
    }

    render() {
        return (
            <div className={classes.container}>
                <Address initialValues={this.initialValues} height='80vh' />
                {this.renderBtns()}
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(Form(AddNewAddress)))