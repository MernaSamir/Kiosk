import React, { Component } from 'react'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const controls = (name1, name2, l1, l2, app) => ([
    {

        name: name2, label: l2, type: 'SelectA', className: classes.select,
        app: {
            name: app,
        }
    },
    { name: name1, label: l1, type: 'TextBox', },
   
])
class NewStreet extends Component {
    static saveStreet(props) {
        const { msg = "The Street Created" } =props
        const popup = {
            type: 'Save', visable: true, width: "50%",
            childProps: {
                msg: msg,
            }
        }
        return [{
            type: 'set_main_popup',
            data: { popup }
        }]
    }
    static onSubmit(props, values) {
        const { setMain, appSaved = 'geographies__street' ,customer } = props
        const activeCustomer = customer? customer.id : undefined
        setMain(appSaved, {
            item: {
                ...values,
                active: true,
                customer: activeCustomer,
                action: 'add',
                onSuccess: this.saveStreet.bind(this, props)

            }
        })

    }


    render() {
        const { title = "Add New Street",
                name1 = "name",
                name2 = "area",
                l1 = "Street",
                l2 = "Area",
                app = "geographies__area",t} = this.props

        return (
            <div className={classes.containall}>
                <p className={classes.p}>{t(title)}</p>
                <div className={classes.Form}>
                    {Render(controls(name1, name2, t(l1), t(l2), app))}
                </div>
                <div className={classes.saveBtns}>
                    <button type='button' onClick={this.props.onCancel}>{t("Cancel")}</button>
                    <button type='submit'>{t("Save")}</button>
                </div>
            </div>
        )
    }
}
export default withTranslation()(connect(null, mapDispatchToProps)(Form(NewStreet)))
