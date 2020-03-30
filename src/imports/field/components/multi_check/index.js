import React, { Component } from 'react'
import classes from './style.less';
import { map } from 'lodash'
import Render from 'helpers/functions/field_mapper/renderfields'

export default class MultiCheck extends Component {


    renderChild = () => {
        const { indata, field } = this.props
        return map(indata, (d, index) => (
            <div className={classes.ininrow}>

                {Render([{
                    name: `${field.name}[${index}]`,
                    type: 'CheckBoxHighlight',
                    className: classes.outerClass
                }])}
                <span>{d.name}</span>
            </div>
        ))
    }


    render() {
        return (<div className={classes.inrows}>
            {this.renderChild()}
        </div>
        )
    }
}
