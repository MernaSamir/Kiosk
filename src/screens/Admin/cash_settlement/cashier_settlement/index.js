import React, { Component } from 'react'
import { connect } from 'react-redux';
import classes from './style.less'
import { withRouter } from 'react-router-dom'
import Header from './header'
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import {withTranslation} from 'react-i18next'
import PropTypes from 'prop-types';

let flag = false


const controls = [
    {
        name: 'cashier', label: "Cashier", type: 'SelectA',
        app: {
            name: "auths__user",
        },
        params: { is_cashier: true },
        validates: { required: true },
        className: classes.eventTBOX

    },

    {
        name: 'amount', label: "Amount", type: 'TextBox',
        validates: { required: true },
        className: classes.eventTBOX,
        no_keyboard: true,


    },
]

class CashierSettlement extends Component {
    static propTypes = {
        t: PropTypes.t
    };
    // to ensure that the prop will sure have a value
    static defaultProps = {
      };
      // this function executed from savebtn 
     // values : all form values
    
    static onSubmit(props, values) {
        const { setMain } = props
        if (!flag) {
            flag = true
            setMain("financials__cash_settlement", {
                item: {
                    ...values,
                    action: 'add',
                    onSuccess: this.save.bind(this, props, values)
                }
            })
        }

    }
    // popup if the save success
    static save(props) {
        const popup = {
            type: 'Save', visable: true, width: "60%",
            childProps: {
                msg: "Cash Settlement Created",

            }
        }
        flag = false
        props.history.goBack()
        return [{
            type: 'set_main_popup',
            data: { popup }
        }]
    }
    // if  i want to cancel the values saving 
    Cancel = () => {
        const { setMain, t } = this.props
        const popup = {
            type: 'CancelCustomer', visable: true, width: "50%",
            childProps: {
                Title: t('Cancel New Cash Settlement'),
                first_msg: t('Are you sure you want to Cancel?'),
                second_msg: t('All unsaved data will be lost'),
                pressYes: this.cancelAdd
            }
        }
        setMain('popup', { popup })
    }
    cancelAdd = () => {
        const { history, setMain } = this.props
        history.goBack()
        setMain('popup', { popup: {} })
    }
    // to render numpad the in  left part  
    rendercal = () => {
        return Render([{
            type: "Calc",
            name: 'amount_calc',
            target: "amount",
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "<"],
            // clear: ['C'],
            remove: ['<'],
            className: classes.numPad,
        }])
    }
    render() {
        const {t} = this.props
        return (
            <div className={classes.control_container}>
                <div className={classes.inner}>
                    <Header t={t}/>
                    <div className={classes.cashier_div}>
                        <div className={classes.left}>
                            {Render(controls)}
                            <div className={classes.saveBtns}>
                                <button type="button" onClick={this.Cancel} >{t('Cancel')}</button>
                                <button type="submit">{t('Save')}</button>
                            </div>
                        </div>
                        {this.rendercal()}
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
    employee__employee: get(state.employee__employee, 'data', {})
})


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()( Form( CashierSettlement) )));