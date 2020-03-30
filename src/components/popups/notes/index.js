import React, { Component } from 'react'
import classes from './style.less';
import { connect } from 'react-redux'
import applyFilters from 'helpers/functions/filters';
import { get } from 'lodash';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import { withTranslation } from 'react-i18next';

class Note extends Component {

    state = {
    };

    static onSubmit(props, values) {
        const { onClick, onCancel, fieldName = 'note', order } = props
        if (order)
            onClick(order, get(values, fieldName))
        else
            onClick(get(values, fieldName))
        onCancel()
    }

    renderField = () => {
        const { sub = 'Notes:', t, fieldName = 'note', validations, title } = this.props
        return Render([{
            type: "TextBox",
            name: fieldName,
            label: t(title),
            className: classes.inputField,
            validates: validations,
            // no_keyboard: true
        }])
    }

    renderSelect = () => {
        const { handleChange, app = 'dropdowns__special_requests', params, fieldName = 'note', } = this.props;
        return Render([{
            type: 'SelectBox',
            name: 'Topnote',
            className: classes.selectFiled,
            app: {
                name: app,
            },
            params,

            afterSelect: (props, d) => {
                handleChange({
                    target: {
                        name: fieldName,
                        value: d.name
                    }
                })
            },
        }])
    }

    rendermode = () => {
        const { active_order } = this.props
        const mode = applyFilters({
            path: `settings__mode.data.${active_order.mode}`
        })
        return <p className={classes.title}>{` ${mode.name} # ${active_order.num}`} </p>
    }

    render() {
        const { onCancel, title, select = false, t, type, mode } = this.props
        return (
            <div className={classes.header}>
                <p className={classes.title}> {t(type)}</p>
                {mode && this.rendermode()}
                <div className={classes.SearchLabelDiv}>
                    {this.renderField()}
                    {select ? this.renderSelect() : undefined}
                </div>
                <div className={classes.saveBtns}>
                    <button onClick={onCancel.bind(this)}>{t("Cancel")}</button>
                    <button type='submit'>{t("Ok")}</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    active_order: get(state.orders__main.data, state.orders__main.active, {}),
    get initialValues() {
        return { note: get(props, 'note', '') }
    }
})

export default withTranslation()(connect(mapStateToProps)(Form(Note)))
