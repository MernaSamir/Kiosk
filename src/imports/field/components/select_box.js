import React, { Component } from 'react';
import { connect } from 'react-redux'
import { get, map, isEqual, pick, find } from 'lodash'
import applyFilters from 'helpers/functions/filters'
import mapDispatchToProps from 'helpers/actions/main'
class select extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['list']
        return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    }
    constructor(props) {
        super(props);
        this.list = props.options || applyFilters({
            path: get(props.app, 'name'),
            key: 'Filter',
            params: props.params
        })
    }
    onChange = (ev)=>{
        const {field, afterSelect=()=>{}} = this.props;
        field.onChange(ev);
        const d = find(this.list, {id: ev.target.value})
        afterSelect(this.props, d)
    }
    renderOptions = () => {
        const { getname } = this.props
        return map(this.list, (d) => (
            <option key={d.id} value={getname ? d.name : d.id}>{d.name}</option>
        ))
    }
    render() {
        const { field, placeholder } = this.props
        return (
            <select {...field} onChange={this.onChange}>
                {!field.value && <option value="">{placeholder || "Please Select"}</option>}
                {this.renderOptions()}
            </select>
        );
    }
}
// const mapStateToProps = (state, props)=>{ 
//     list: props.options || get(state, `${get(props.app, 'name', '')}.data`, {})}
export default connect(null, mapDispatchToProps)(select);