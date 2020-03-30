import React, { Component } from 'react'
import { connect } from 'react-redux';
import { round, max, get } from 'lodash';
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form';
import classes from './../styles.less'
import Header from 'components/header_back'
import { withTranslation } from 'react-i18next';
import applyFilters from 'helpers/functions/filters'

const controls = [
    {
        name: 'due', label: "Due", type: 'Label', className: classes.due
    },
    {
        name: 'paid', label: "Paid", type: 'TextBox',
        validates: { required: true, number: true, minNumber: 0 }
    },
    {
        name: 'tips', label: "Tips", type: 'TextBox'
    },
    {
        name: 'change', label: "Change", type: 'LabelCalc', className: classes.change,
        func(d) {
            return (round(max([Number(d.paid || '') - Number(d.tips || '') - Number(d.due), 0]), 2))
        }
    },
]

class PaymentHeader extends Component {

    state = {
        calcName: 'paid',
    }

    static cancel(props) {
        const { history } = props;
        history.push('/home')
    }

    selectInput = (field) => {
        if (['tips', 'paid'].includes(field.name)) {
            this.setState({
                calcName: ''
            }, () => {
                this.setState({ calcName: field.name })
            })
        }
    }

    renderHeader = () => {
        console.log('hereeeeeee')
        let name = ''
        const { mode, receipt = {}, activeOrder , t } = this.props
        if (mode.key == 'TW') {
            name = t('Payment')
        }
        else {
            if (activeOrder.guests_num == receipt.seats.length) {
                name = t('Pay All In One')
            }
            else if (receipt.seats.length > 1) {
                name = `${t("Pay seats")} ${receipt.seats.join(', ')}`
            }
            else {
                name = `${t("Pay seat")} ${receipt.seats[0]}`
            }
        }
        const authorize = applyFilters({key: 'authorize', compare: ['payment_back']})
        console.log('baaack', authorize)
        return <Header name={name} authorize={authorize}/>
    }

    render() {
        return (
            // <div>
            //     {this.renderHeader()}
            //     <div className={classes.header}>
            //         {Render(controls, { onClick: this.selectInput })}
            //     </div>
            // </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    receipt: get(state.orders__receipt.data, state.orders__receipt.active, {}),
    activeOrder: get(state.orders__main.data, state.orders__main.active, {}),
    initialValues: {
        due: round(props.calc.balance_due, 2),
        get print() { return this.mode.key != 'DI' }
    }
})

export default connect(mapStateToProps)(withTranslation()(Form(PaymentHeader)))