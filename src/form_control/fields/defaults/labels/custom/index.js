import React, { Component } from 'react'
import applyFilters from 'helpers/functions/filters';
import {get} from 'lodash'
import * as label_functions from './label_functions'
import { withTranslation } from 'react-i18next';
class CustomLabel extends Component {

    
    render() {
        const {fun, main_data, func, t} = this.props
        const val = func ? get(label_functions, func,(props) => label_functions.getValue(props))(this.props) : applyFilters(fun,undefined, undefined, {data: main_data})
        return (
            <p>
               {t(val)} 
            </p>
        )
    }
}
export default withTranslation()(CustomLabel)
