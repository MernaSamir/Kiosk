import React, { Component } from 'react'
import classes from '../multi_checkbox/style.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Checkbox extends Component {
    // state = {
    //     check: false,
    // }

    // check = (value) => {
    //     this.setState({
    //         check: !(this.state.check)
    //     })
    //     this.onChange(value)

    // }

    onChange = (ev) => {
        const { field } = this.props;
        field.onChange({
            target: {
                name: field.name,
                value:!field.value
            }
        })
    }

    render() {
        const { field } = this.props
        // const { check } = this.state

        return (
            <div className={classes.check_div} onClick={this.onChange}>
                {field.value && <FontAwesomeIcon className={classes.icon} icon="check"/>}
                {!field.value && <FontAwesomeIcon className={classes.icon} icon="square"/>}
            </div>
        )
    }
}
