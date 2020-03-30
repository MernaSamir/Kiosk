import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router'
import applyFilters from 'helpers/functions/filters'
import Render from 'helpers/functions/field_mapper/renderfields'
import { withTranslation } from 'react-i18next';
import Form from 'helpers/wrap/form'
import classes from './style.less'

let controls = (order) => ([
    {
        name: 'served_location', label: 'Choose Branch to Transfer', type: 'SelectA',
        className: classes.select,
        options: applyFilters({
            key: 'Reject',
            path: 'licensing__location',
            params: {
                id: order.served_location
            }
        })
    },
    { name: 'note', label: "Notes", type: 'TextBox', },

])

class ChooseOne extends Component {

    static onSubmit(props, values) {
        const { order, setMain } = props;
        var item
        const sub_mode = applyFilters({
            key: 'Find',
            path: 'settings__sub_mode',
            params: {
                id: order.sub_mode,
            }
        })
        if (sub_mode.key == "delivery") {
            item = {
                ...values,
                id: order.id,
                action: 'update',
                onSuccess: this.save.bind(this, props)
            }
        }
        else {
            item = {
                ...values,
                pick_location: values.served_location,
                id: order.id,
                action: 'update',
                onSuccess: this.save.bind(this, props)
            }
        }
        console.log("Order ", order, item)
        setMain('orders__main', { item: item })

    }

    static save(props) {
        const popup = {
            type: 'Save', visable: true, width: "50%",
            childProps: {
                msg: "The Order is Transfered Successfully",

            }
        }
        props.onCancel()
        return [
            {
                type: 'set_main_popup',
                data: { popup }
            },
            {
                type: 'set_main_orders__main',
                data: { active: '' }
            }
        ]
    }

    render() {
        const { onCancel, t, order } = this.props
        return (
            <div className={classes.containall}>
                <p className={classes.p}>{t("Trasfer Order")}</p>
                <div className={classes.Form}>
                    {Render(controls(order))}
                </div>
                <div className={classes.saveBtns}>
                    <button onClick={onCancel}>{t("Cancel")}</button>
                    <button type='submit' >{t("Save")}</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    locations: state.licensing__location.data,
    initialValues: {}
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(ChooseOne))))