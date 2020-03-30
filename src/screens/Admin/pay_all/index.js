import React, { Component } from 'react'
import classes from './styles.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import { get, find } from 'lodash'
import Form from 'helpers/wrap/form.js';
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import Header from "./header"
import PayIn from './pay_in'
import PayOut from './pay_out'
import {withTranslation} from 'react-i18next'
import { multiRequest } from 'helpers';

let flag = false

class PayInOut extends Component {
    componentDidMount() {
        multiRequest({
                pay__item:{},
                pay__category:{},
                parties__customer:{},

        })
    }
    state = {
        activeTab: "Pay In",
        calcName: 'amount',

    }
    tabs = [
        { name: "Pay In", Component: PayIn },
        { name: "Pay Out", Component: PayOut },
    ]
    cancelAdd = () => {
        const { history, setMain } = this.props
        history.goBack()
        setMain('popup', { popup: {} })
    }
    CancelPay = () => {
        const { setMain } = this.props
        const popup = {
            type: 'CancelCustomer', visable: true, width: "50%",
            childProps: {
                Title: 'Cancel',
                first_msg: 'Are you sure you want to Cancel?',
                second_msg: 'All unsaved data will be lost',
                pressYes: this.cancelAdd
            }
        }
        setMain('popup', { popup })
    }
    static onSubmit(props, values) {

        const { setMain } = props
        if (!flag) {
            flag = true
            setMain("pay__pay", {
                item: {
                    ...values,
                    action: 'add',
                    onSuccess: this.savePay.bind(this, props, values)
                }
            })
        }
    }
    static savePay(props) {
        const popup = {
            type: 'Save', visable: true, width: "50%",
            childProps: {
                msg: "PayCreated",

            }
        }
        flag = false
        props.history.goBack()

        return [{
            type: 'set_main_popup',
            data: { popup }
        }]
    }

    rendercal = () => {
        return Render([{
            type: "Calc",
            name: 'amount_calc',
            target: this.state.calcName,
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "<"],
            remove: ['<'],
            className: classes.numPad,

        }])
    }
    selectInput = (field) => {
        if (['amount', 'quantity', 'paid'].includes(field.name)) {
            this.setState({
                calcName: ''
            }, () => {
                this.setState({ calcName: field.name })
            })
        }
    }

    WriteNote = () => {
        return Render([{
            type: "ButtonPopup",
            name: 'note',
            label: '',
            className: classes.note,
            popupType: "AddNote",
            ftype: "note",
            icon: ['far', 'sticky-note']
        }])
    }
    setActive = (d) => {
        this.setState({ activeTab: d.name }, () => {
        })
    }
    renderFooter = () => {
        const {t } = this.props

        return <div className={classes.footer}>
            {this.WriteNote()}
            <button>{t("Print")}</button>
            <button type="button" onClick={this.CancelPay}>{t("Cancel")}</button>
            <button type="submit">{t("Ok")}</button>
        </div>
    }
    render() {
        const { resetForm, values, t } = this.props
        const Component = find(this.tabs, { name: this.state.activeTab })
        return (
            <div className={classes.form}>
                <Header setActive={this.setActive}t={t} />
                <div className={classes.containerit}>
                    <div className={classes.left}>
                        {get(this.state, 'activeTab', false) && Component.Component &&
                            <Component.Component selectInput={this.selectInput} resetForm={resetForm} values={values} t={t}/>}
                        {this.renderFooter()}
                    </div>
                    {this.rendercal()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    initialValues: { shift: state.orders__shifts.active }
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)( withTranslation() (Form(PayInOut)) ))
