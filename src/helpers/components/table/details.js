import React, { Component } from 'react';
import applyFilter from 'helpers/functions/filters';

class details extends Component {
    render() {
        const { onClick, data, className, extra_show={}, filter = { key: 'GetDataSelector', show: 'name' }, padIndex, renderArrow = () => { } } = this.props;
        const show = applyFilter(filter, data)
        const stock_unit = applyFilter(extra_show, undefined, undefined, {data})
        const style = {
            paddin: '0.5vw',
            paddingLeft: (padIndex) + 'vw',
            fontSize: '1vw',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            cursor: 'pointer'
        }
        return (
            <td onClick={onClick} style={style} className={className}>
                {renderArrow()} {show} {stock_unit ? <span style={{'fontWeight': "bold"}}>{'(' + stock_unit + ')'}</span> : undefined}
            </td>
        );
    }
}

export default details;
