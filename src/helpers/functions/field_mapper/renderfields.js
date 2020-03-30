import React from 'react'
import FieldControl from 'imports/field';
import { map, get } from 'lodash'
import classes from './style.less'
export default (controls, props = {}) => {
    return map(controls, (data, idx) => <div key={idx}
        className={data.type != "RowForm" ?
            get(data, 'className', props.className || classes.input) : classes.formRow}
        style={{ ...props }}>
        <FieldControl {...{ ...props, name: data.name || idx, ...data }} />
    </div>)

}
