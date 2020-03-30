import React, { Component } from 'react'
import Form from 'helpers/wrap/form'
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './style.less'

class Content extends Component {

    static onSubmit(values) {
    }

    renderRows = () => {
        const { data, indata } = this.props
        return Render([{
            name: "checks",
            type: 'MultiCheckbox',
            data: data,
            indata: indata,
            className: ''
        }])
    }

    render() {
        return (
            <div  className={classes.selector_list}>
                {this.renderRows()}
                <button type="submit" className={classes.save}>Save</button>
            </div>
        )
    }
}

export default Form(Content)
