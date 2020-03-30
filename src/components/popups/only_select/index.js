import React, { Component } from 'react'
import classes from './style.less';
import { connect } from 'react-redux'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import { withTranslation } from 'react-i18next';

class SelectOnly extends Component {
    static onSubmit(props, values) {
        const {  onClick} = props
        onClick(values)
        // setMain('orders__main', {
        //     item: {
        //         id: active,
        //         confirm_reason: values.reason,
        //         status:"nc",
        //         action: 'update',
        //         onSuccess: this.save

        //     }
        // })
    }
    // static save() {
    //     const popup = {
    //         type: 'Save', visable: true, width: "50%",
    //         childProps: {
    //             msg: "Order Sent to Confirmer",
    //             only: true


    //         }
    //     }
    //     // history.push(get(urls, mode.key))
    //     return [{
    //         type: 'set_main_popup',
    //         data: { popup }
    //     }, 
    //   ]
    // }

    renderField = () => {
        const { sub = 'Reason:' ,name='reason', app='dropdowns__reasons', colValue} = this.props
        return Render([{
            type: "SelectA",
            name: name,
            label: sub,
            colValue,
            className: classes.select,
            app: {
                name: app,
            },
        }])
    }



    render() {
        const { onCancel, title = "Select Reason" , t} = this.props
        return (
            <div className={classes.header}>
                <p> {t(title)}</p>
                <div className={classes.SearchLabelDiv}>
                    {this.renderField()}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Form(SelectOnly)))

