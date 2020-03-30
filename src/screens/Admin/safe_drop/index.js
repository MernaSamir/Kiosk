import React, { Component } from 'react'
import moment from "moment"
import classes from './styles.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form.js';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import mapDispatchToProps from 'helpers/actions/main'
import Header from 'components/header_back'
import {withTranslation} from 'react-i18next'
let flag = false

const controls = [
    {
        name: 'amount', label: "Pay Out", type: 'TextBox',
        no_keyboard: true,
        validates: { required: true },
        className: classes.tipsPayO,
    },
]
class SaveDrop extends Component {
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
            msg: "Safe Drop Created",

        }
    }
    flag = false
    props.history.goBack()
    return [{
        type: 'set_main_popup',
        data: { popup }
    }]
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
renderFooter = () => {
    const {t} = this.props
    return <div className={classes.footer}>
        {this.WriteNote()}
        <button>{t('Print')}</button>
       <div className={classes.save}>
       <button type="button" onClick={this.CancelPay}>{t('Cancel')}</button>
        <button type="submit">{t('Ok')}</button>
       </div>
    </div>
}
rendercal = () => {
    return Render([{
        type: "Calc",
        name: 'amount_calc',
        target: "amount",
        num: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "<"],
        remove: ['<'],
        className: classes.numPad,

    }])
}
render() {
    const {t} = this.props
    return (
        <div className={classes.form}>
            <Header name={t("Safe Drop")}></Header>
            <p className={classes.p}>{t('Location')}: Branch Heliopolis- All POS</p>

            <div className={classes.tabDiv}>
                <div className={classes.left}>
                    <p className={classes.time} >{moment().format('MMM-DD-YYYY hh:mm')}</p>
                    {/* <p className={classes.time}>Balance: 500.000</p> */}
                    {Render(controls)}
                    {this.renderFooter()}
                </div>
                <div className={classes.right}> {this.rendercal()}</div>
            </div>
        </div>
    )
}
}
const mapStateToProps = (state) => ({
    initialValues: { shift: state.orders__shifts.active, _type: 'PO', sub_typ: 'SD' }
})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation() (Form(SaveDrop) ) ))
