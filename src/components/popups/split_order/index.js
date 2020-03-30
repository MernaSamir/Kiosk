import React, { Component } from 'react'
import classes from './style.less'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import { withTranslation } from 'react-i18next';

class SplitOrder extends Component {

    static onSubmit(props, values) {
        const { onClick } = props
        onClick(values.gnum)
    }

    renderPad = () => {
        return Render([{
            type: "Calc",
            name: 'amount_calc',
            target: "gnum",
            num: [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0, "D"],
            clear: ['C'],
            remove: ['D'],
            className: classes.numPad,
        }])
    }

    renderQty = () => {
        const { gnum } = this.props
        return Render([{
            type: "TextBox",
            name: 'gnum',
            label: 'Guest Number',
            placeholder: gnum,
            validates: { required: true }
        }])
    }

    renderButtons = () => {
        const { onClick , t} = this.props
        return <div className={classes.saveBtns}>
            <button onClick={onClick}>{t("cancel")}</button>
            <button type='submit'>{t("ok")}</button>
        </div>
    }
    render() {
                const { t} = this.props

        return (
            <div className={classes.tablePopupDiv} >
                <div className={classes.popupTitle}>
                    <span >{t("Split Order")}</span>
                </div>
                <div className={classes.quantity}>
                    {this.renderQty()}
                </div>
                <div className={classes.popupCalculator} >
                    {this.renderPad()}
                </div>
                {this.renderButtons()}
            </div>
        )
    }
}

export default  withTranslation()(Form(SplitOrder))