import React from 'react';
import InputComponent from 'helpers/components/input';
import { map, get, omit } from 'lodash';
import Sub from './sub';
import applyFilter from 'helpers/functions/filters';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
class selectCollapseClass extends InputComponent {
    renderGroupBody() {
        const {data, field, filter, show, child, mainChange=field.onChange} = this.props;
        const list = applyFilter(filter, data);
        return map(list, (d, key)=>(
            <Sub field={field} show={show} data={d} child={child} mainChange={mainChange} ChildComponent={SelectCollapse} /> 
        ))
    }
    render() {
        return this.renderGroupBody()
    }
}

const mapStateToProps = (state, props) => ({
    data:get(state, `${props.reduxName}.data`),
    filter: props.filter || {
        key: 'Filter',
        params: omit({
            [get(props, 'match', '1')]: get(props, 'd.id', '')
        }, ['1'])
    },
    show: props.show || {
        key: 'GetDataSelector',
        show: 'name'
    },
})

export const SelectCollapse = connect(mapStateToProps, mapDispatchToProps)(selectCollapseClass)
export default SelectCollapse;
