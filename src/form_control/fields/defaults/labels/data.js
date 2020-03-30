import React, { Component } from 'react'
import applyFilter from 'helpers/functions/filters'
import { withTranslation } from 'react-i18next'
class DataDisplay extends Component {
    constructor(props){
        super(props)
        this.show = applyFilter(props.show, props.main_data)
    }
    render() {
        return (
            <p>
                {this.show}
            </p>
        )
    }
}

export default withTranslation()(DataDisplay)
