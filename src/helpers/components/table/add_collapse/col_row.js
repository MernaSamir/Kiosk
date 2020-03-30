import React, { Component } from 'react'
import Collapse_col from './collapse_col';
import { map } from 'lodash';


export class ColRow extends Component {
    render() {
        const { list, ...props } = this.props;
        return map(list, (d, key) => (
            <tr key={key}>
                <Collapse_col data={d} {...props} index={d.id} mainValues={d} />
            </tr >
        ))
    }
}
export default ColRow
