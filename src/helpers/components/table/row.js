import React, { Component } from 'react'
import TCol from './col';
import { map, get } from 'lodash';
import style from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export class InputRow extends Component {

    renderClickButton = (d) => {
        const { push_url, handleClick } = this.props
        if (push_url) {
            return <td className={style.InputRow}>
                <FontAwesomeIcon
                    icon="chevron-right"
                    className={style.arrow}
                    onClick={() => handleClick(d)} />
            </td>
        }
    }

    render() {
        const { list, ...props } = this.props;
        return map(list, (d, key) => (
            <tr key={key}>
                {this.renderClickButton(d)}
                <TCol data={d} {...props} index={get(d, 'id')} mainValues={d} />
            </tr>
        ))
    }
}
export default InputRow
