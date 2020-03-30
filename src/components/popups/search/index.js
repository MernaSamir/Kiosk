import React, { Component } from 'react'
import classes from './style.less';
import { connect } from 'react-redux'
import { get } from 'lodash';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import { withTranslation } from 'react-i18next';

class Search extends Component {

  

    static onSubmit(props, values) {
        const { onClick, onCancel } = props
        onClick(values.input)
        onCancel()
    }

    renderField = () => {
        const {t} = this.props
        return Render([{
            type: "TextBox",
            name: 'input',
            label: t('Search'),
            className: classes.inputField,
        }])
    }

    
    render() {
        const { onCancel , t} = this.props
        return (
            <div className={classes.header}>
                <p> {t('Search')}</p>
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

export default withTranslation()(connect(mapStateToProps)(Form(Search)))
