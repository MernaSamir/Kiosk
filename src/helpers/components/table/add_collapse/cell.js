import React, { Component } from 'react';
import FormControl from 'form_control';

class TCell extends Component {
    render() {
        const {name, f, mainValue, mainValues, mainChange} = this.props;
        return (
            <td ><FormControl {...{...f, mainValue, mainChange, mainValues}} name={name} /></td>
        );
    }
}

export default TCell;
