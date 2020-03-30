import React, { Component } from 'react'
import TextBox from 'imports/field/components/text_box'
export default class title extends Component {
    render() {
        const {label} = this.props;
        return (
            <>
                <label>{label}</label>
                <TextBox {...{...this.props, no_keyboard: true, autoFocus: true}} />
            </>
        )
    }
}
