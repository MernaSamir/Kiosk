import React, { Component } from 'react'
import classes from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import {connect} from 'react-redux'
import {withTranslation} from 'react-i18next'
class Search extends Component {
    static onSubmit(props, values) {
        const { setMain } = props
        setMain('main', {search:values.input})
      }
    renderField = () => {
        const {className, t} = this.props
        const obj = className?{
            type: "TextBox",
            name: 'input',
            placeholder:t('Search'),
            className
        }:{
            type: "TextBox",
            name: 'input',
            placeholder:t('Search'),
        }
        return Render([obj])
    }
    render() {
        const {style, iconClass=classes.icon} = this.props
        return (
            <>
             {/* <FontAwesomeIcon icon="search" className={iconClass} style={style}></FontAwesomeIcon>
                <input placeholder="Search" className={classes.input} /> */}
                {this.renderField()}
               
            </>
        )
    }
}
 
export default withTranslation() (connect(null, mapDispatchToProps)(Form(Search)) )