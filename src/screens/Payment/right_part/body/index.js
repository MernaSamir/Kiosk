import React, {Component} from 'react'
import { omit, round } from 'lodash';
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form';
import classes from './../styles.less'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';

class PaymentBody extends Component {
    getData = () => {
    }

    static onSubmit(props, values) {
        const onSuccess = this.addPayment.bind(this, props, values);
        const { calc } = props;
        applyFilters({
            key: 'SavingReceipt',
        }, calc, undefined, { finish: onSuccess});
    }

    state = {
        calcName: 'paid',
    }

    rendercal = () => {
        return Render([{
            type: "Calc",
            name: 'calc',
            target: this.state.calcName,
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "D"],
            clear: ['C'],
            remove: ['D'],
            className: classes.numPad,
            width: '8vh'
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

    handelClickDone = () => {
    }
    static addPayment(props, values, receipt) {
        const { order, AppendPath, reset } = props;
        const onSuccess = this.afterPrint.bind(this, props, values, receipt);
        reset("orders__main", {
            item: {
                id: order
            }
        })
        AppendPath('item', {
            action: 'add',
            onSuccess,
            order,
            receipt: receipt.id,
            ...values
        })
    }

    static printing(props, values, receipt = props.receipt, payment) {
        const afterPrint = this.addPayment.bind(this, props, values, receipt);
        if (values.print && values.due <= values.paid) {
            // afterPrint()
            return [{
                type: 'set_main_Printing', data: { print: { active: 'Receipt', receipts: [receipt.id], afterPrint }}
            }]
        } else {
            afterPrint()
            return []
        }
    }

    static afterPrint(props, values, receipt, payment) {
        const { setMain } = props;
        const onSuccess = this.cancel.bind(this, props, values, receipt, payment);
        let update = { id: receipt.id, onSuccess, action: "update" };
        //SetMain({ item: {} });
        if (values.print) {
            update.print_time = new Date();
            setMain("orders__receipt", {item: {print_time: new Date(), id: receipt.id, action: "update", onSuccess: this.cancel}})
        }
        if (receipt.balance_due <= payment.value) {
            update.paid_time = new Date();
        }
        setMain("orders__receipt", {
            item: update,
        })
    }

    static cancel(props) {
        const { history } = props;
        //SetMain({ item: {} });
        //reset("orders__main", {
        //    item: {
        //        id: order,
        //        action: 'update',
        //        onSuccess: this.goHome.bind(this, props)
        //    }
        //})
        history.push('/home')
        return []
    }

    static goHome(props) {
        //const {history, mode} = props;
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

    printChecbox() {
        const { mode } = this.props
        return Render([{
            type: 'CheckBoxHighlight',
            name: 'print',
            labeling: "Print Receipt"
        }].filter(d => (mode.key != "DI")))
    }

    render() {
        const {t} = this.props
        return (
            <>
                <div className={classes.types}></div>
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

const mapStateToProps = (state, props) => ({
    ...omit(state, ['item']),
    params: {
        order: state.order
    },
    receiptItems: state.receiptItems,
    initialValues: {
        due: round(props.calc.balance_due, 2),
        print: state.mode.key != 'DI'
    }
})
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(PaymentBody)))
