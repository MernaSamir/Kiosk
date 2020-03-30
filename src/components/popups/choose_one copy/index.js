import React, { Component } from 'react'
import classes from './style.less'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import { withTranslation } from 'react-i18next';
import applyFilters from 'helpers/functions/filters'
import { get } from 'lodash'

let controls = (order, values, neworder) => ([
    {
        name: 'address', label: 'Choose the new delivery Address', type: 'SelectA',
        className: classes.select,
        app: {
            name: "parties__address",
        },
        params: {
            customer: order.customer
        }
    },
    {
        name: 'pick_location', label: 'Choose Branch to Transfer', type: 'SelectA',
        className: classes.select,
        app: {
            name: "licensing__location",
        },
        value: values.address,
        flag: values.address ? true : false,
        options: values.address && [applyFilters({
            key: 'chain',
            selectors: {
                "parties__address": "address",
                "geographies__street": "street",
                "geographies__area": 'area',
                "licensing__location": 'location',
            },
        }, neworder)]
    },
    { name: 'note', label: "Notes", type: 'TextBox', },

])

class ChooseOne extends Component {

    static onSubmit(props, values) {
        const { order, setMain } = props;
        var item

        if ((values.pick_location && values.address) || (values.address && !values.pick_location)) {
            const newSub_mode = applyFilters({
                key: 'Find',
                path: 'settings__sub_mode',
                params: {
                    mode: order.mode,
                    key: 'delivery'
                }
            })
            item = {
                ...values,
                pick_location: null,
                id: order.id,
                sub_mode: newSub_mode.id,
                action: 'update',
                onSuccess: this.save.bind(this, props)
            }
        }
        else if (values.pick_location && !values.address) {
            const newSub_mode = applyFilters({
                key: 'Find',
                path: 'settings__sub_mode',
                params: {
                    mode: order.mode,
                    key: 'pickup'
                }
            })
            item = {
                ...values,
                address: null,
                served_location: values.pick_location,
                id: order.id,
                sub_mode: newSub_mode.id,
                action: 'update',
                onSuccess: this.save.bind(this, props)
            }
        }
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
        return [{
            type: 'set_main_popup',
            data: { popup }
        }]
    }

    render() {
        const { onCancel, t, order, values } = this.props
        const address = get(values, 'address', null)
        const neworder = { ...order, address }
        return (
            <div className={classes.containall}>
                <p className={classes.p}>{t("Trasfer Order")}</p>
                <div className={classes.Form}>
                    {Render(controls(order, values, neworder))}
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
    initialValues: {

    }
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(ChooseOne))))