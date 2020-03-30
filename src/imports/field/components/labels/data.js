import React, { Component } from 'react'
import applyFilter from 'helpers/functions/filters'
import { get } from 'lodash'
export default class DataDisplay extends Component {
    render() {
        const { form, main_data = form.values, show } = this.props
        console.log('main_data',main_data)
        console.log('show', show)
        this.show = applyFilter(show, main_data)
        return (
            <p>
                {get(this.show, 'name', '')}
            </p>
        )
    }
}
