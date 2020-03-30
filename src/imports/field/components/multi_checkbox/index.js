import React, { Component } from 'react'
import classes from './style.less';
import { map, get, mapValues, every } from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Render from 'helpers/functions/field_mapper/renderfields'

export default class MultiCheckbox extends Component {

    state = {
        display: "none",
        transform: "rotate(0deg)",
        transitionDuration: ".6s",
    }

    onClick = () => {
        if (this.state.display == "none") {
            this.setState({
                display: 'block',
                transform: 'rotate(180deg)'
            })
        }

        else {
            this.setState({
                display: 'none',
                transform: 'rotate(0deg)'
            })
        }
    }

    // check = (value) => {
    //     this.setState({
    //         check: !(this.state.check)
    //     })
    //     this.onChange(value)

    // }

    // onChange = (value) => {
    //     const { field } = this.props;
    //     field.onChange({
    //         target: {
    //             name: field.name,
    //             value
    //         }
    //     })
    // }

    selectAll = (ev) => {
        const { field, handleChange } = this.props
        let name = field.name
        let values = field.value
        handleChange({ target: { name, value: mapValues(get(values, name, {}), d => (ev.target.value)) } })
    }

    renderParent = () => {
        const { data, field } = this.props
        let name = field.name
        let values = field.value
        const total = every(get(values, name, {}), Boolean);
        return map(data, (d) => {
            return <>
                <div className={classes.selector_row}  >

                    <div className={classes.check_div} onClick={this.selectAll.bind(this)}>
                        <FontAwesomeIcon className={classes.icon} icon="check"
                            style={{ display: total ? 'block' : 'none' }} />
                    </div>

                    <span>{d.mac_address}</span>

                    <FontAwesomeIcon className={classes.icon} icon="caret-down" onClick={this.onClick.bind()}
                        style={{ transform: this.state.transform, transitionDuration: this.state.transitionDuration }} />
                </div>

                <div className={classes.inrows} style={{ display: this.state.display }}>
                    {this.renderChild()}
                </div>
            </>
        }
        )
    }

    renderChild = () => {
        const { indata, field } = this.props
        return map(indata, (d, index) => (
            <div className={classes.ininrow}>

                {Render([{
                    name: `${field.name}[${index}]`,
                    type: 'Checkbox',
                    className: classes.outerClass
                }])}
                <span>{d.name}</span>
            </div>
        ))
    }


    render() {
        return (
            this.renderParent()

        )
    }
}
