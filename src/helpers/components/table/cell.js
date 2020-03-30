import React, { Component } from 'react';
import FormControl from 'form_control';
import style from './style.less'
class TCell extends Component {
    render() {
        const {name, f, mainValue, totalChange, mainValues, allValues, mainChange, data, main_data=data, mainForm} = this.props;
        return (
            <td className={style.Tcell}><FormControl {...{...f, main_data, allValues, mainValue, mainForm, mainChange, totalChange, mainValues}} name={name} /></td>
        );
    }
}

export default TCell;
