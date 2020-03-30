import React, { Component } from 'react';
import applyFilter from 'helpers/functions/filters'; 
class show extends Component {
    render() {
        const {onClick, data, filter={key: 'GetDataSelector', show: 'name'}} = this.props;
        const show = applyFilter(filter, data)
        return (
            <div onClick={onClick.bind(this, data)}>
                {show}
            </div>
        );
    }
}

export default show;
