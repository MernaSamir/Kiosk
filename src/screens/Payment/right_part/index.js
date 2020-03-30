/* eslint-disable class-methods-use-this */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import applyFilters from 'helpers/functions/filters'
import Performance from 'helpers/components/performance'
import { withRouter } from 'react-router-dom'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form';
import { withTranslation } from 'react-i18next';
import Header from 'components/header_back'
import { get, max, find, ceil, head } from 'lodash';
import classes from './../right_part/styles.less'
// import { Modes as urls } from 'config'

const controls = [
    {
        name: 'due', label: "Due", type: 'Label', className: classes.due
    },
    {
        name: 'paid', label: "Paid", type: 'TextBox', no_keyboard: true,
        validates: { required: true, number: true },
    },
    {
        name: 'tips', label: "Tips", type: 'TextBox', no_keyboard: true,
    },
    {
        name: 'change', label: "Change", type: 'LabelCalc', className: classes.change,
        func(d) { return (ceil(max([Number(d.paid || '') - Number(d.tips || '') - Number(d.due), 0]), 2)) }
    }
]

class PayTypes extends Component {
    // shouldComponentUpdate(nextProps, nextState) {
    //        const compare = ['initialValues', 'item'];
    //        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    //     }

    state = {
        calcName: 'paid',
    }

    constructor(props) {
        super(props);
        PayTypes.send = false
    }

    static send = false;

    static onSubmit(props, values) {
        if (!this.send) {
            const { calc, setMain, setAll, mode, receipt, ratio, currency } = props;
            this.send == true
            const newValues = {
                ...values, paid: ceil((values.paid * ratio), 2),
                due: ceil((values.due * ratio), 2),
                change: ceil((values.change * ratio), 2)
            }
            const finish = this.addPayment.bind(this, props, newValues);
            const finishTakeAway = this.cancel.bind(this, props, newValues);
            if (receipt && mode.key == "DI") {
                if (values.paid >= values.due) {
                    setMain('orders__receipt', {
                        item: {
                            id: receipt.id,
                            paid_time: new Date(),
                            action: 'update',
                            onSuccess: finish
                        }
                    })
                }
                else {
                    setAll(finish(receipt))
                }
            }
            else {
                let newValue = {
                    ...values, paid: ceil((values.paid * ratio), 2),
                    due: ceil((values.due * ratio), 2),
                    change: ceil((values.change * ratio), 2)
                }
                // console.log(values, "  ", calc, "  -> ", newValue ," - ", ratio)

                applyFilters({
                    key: 'SavingReceipt',
                    payment: newValue,
                    currency: currency
                }, calc, undefined, {
                    finish: finishTakeAway,
                    print: values.print, paid_time: ((values.paid >= values.due) && new Date())
                })
            }
        }
    }

    rendercal = () => {
        return Render([{
            type: "Calc",
            name: 'calc',
            target: this.state.calcName,
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "D"],
            clear: ['C'],
            remove: ['D'],
            // className: classes.numPad,
        }])
    }

    buttonField() {
        return Render([{
            name: "payment_type",
            type: 'selectButtons',
            className: "",
            selectFirst: true,
            validates: {
                required: true
            },
            app: {
                name: 'payment__types',
                api: "payment/types/"
            }
        }])
    }

    static addPayment(props, values, receipt) {
        const { order } = props;
        return [{
            type: 'set_main_orders__payment',
            data: {
                item: {
                    action: 'add',
                    order,
                    receipt: receipt.id,
                    onSuccess: this.printReceipt.bind(this, props, values, receipt),
                    ...values
                }
            }
        }]
    }

    static printReceipt(props, values, receipt) {
        const finish = this.cancel.bind(this, props, values)
        if (receipt.paid_time && values.print) {
            return [
                {
                    type: 'set_main_Printing',
                    data: {
                        print: {
                            active: 'Receipt',
                            receipts: [receipt.id],
                            afterPrint() {
                                finish()
                                return Promise.resolve()
                            }
                        }
                    }
                }
            ]
        } else {
            return finish()
        }
    }

    static cancel(props, values) {
        const { history } = props;
        if (values.paid >= values.due) {
            if (history.location.pathname.includes('payment')) {
                history.push('/home')
            }
        } else {
            this.send = false
        }
        return [];
    }

    selectInput = (field) => {
        const { resetForm, values } = this.props
        if (field.name == 'paid') {
            resetForm({ ...values, paid: '' });
        }
        if (['tips', 'paid'].includes(field.name)) {
            this.setState({
                calcName: ''
            }, () => {
                this.setState({ calcName: field.name })
            })
        }
    }

    // eslint-disable-next-line react/display-name
    renderHeader = () => {
        let name = ''
        const { mode, receipt = {}, activeOrder } = this.props

        if (mode.key == 'TW' || mode.key == 'CC' || mode.key == 'DL' || mode.key == 'EV') {
            name = 'Payment'
        }
        else {
            if (activeOrder.guests_num == get(receipt, 'seats.length')) {
                name = 'Pay All In One'
            }
            else if (get(receipt,'seats.length',0) > 1) {
                name = `Pay seats ${receipt.seats.join(', ')}`
            }
            else {
                name = `Pay seat ${head(receipt.seats)}`
            }
        }
        const authorize = applyFilters({key: 'authorize', compare: ['payment_back']})
        return <Header name={name} authorize={authorize} />
    }

    printChecbox() {
        const authorize = applyFilters({key: 'authorize', compare: ['no_print']})
        return Render([{
            type: 'CheckBoxHighlight',
            name: 'print',
            labeling: "Print Receipt",
            disabled:!authorize
        }])
    }

    render() {
        const { t } = this.props
        

        return (
            <>
                {this.renderHeader()}
                <div className={classes.header}>
                    {Render(controls, { onClick: this.selectInput })}
                </div>

                <div className={classes.types}>

                </div>

                <div className={classes.afterheader}>
                    <div className={classes.leftside}>
                        <p className={classes.optHeader}>{t("Payment Options")}</p>
                        <div className={classes.setting}>
                            {this.buttonField()}
                        </div>
                        {this.printChecbox()}
                    </div>
                    <div className={classes.flexColumns}>
                        <div className={classes.calcContainer}>
                            {this.rendercal()}

                        </div>
                        <button type="submit" className={classes.submit}>{t("Done")}</button>
                    </div>
                </div>
            </>
        )
    }
}


export default withRouter(withTranslation()(connect((state, props) => ({
    order: state.orders__main.active,
    mode: get(state.settings__mode.data, state.settings__mode.active, {}),
    receipt: get(state.orders__receipt.data, state.orders__receipt.active, {}),
    activeOrder: get(state.orders__main.data, state.orders__main.active, {}),
    payments: state.orders__payment.data,
    currency: state.dropdowns__currencies.active,
    get ratio() {
        return get(
            find(state.dropdowns__currencies_conversions.data, { _from: this.currency }),
            'ratio', 1)
    },
    get initialValues() {
        return {
            due: ceil((props.calc.balance_due / this.ratio), 2),
            print: true,
            paid: ceil((props.calc.balance_due / this.ratio), 2),
        }
    }
}), mapDispatchToProps)(Performance((Form(PayTypes)), ['initialValues', 'receipt', 'payments', "calc"]))))
