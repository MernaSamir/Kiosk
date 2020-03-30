import React, { Component } from 'react';
import {get} from 'lodash';
import mapDispatchToProps from 'helpers/actions/main';
import {connect} from 'react-redux';
import BasicComponent from 'helpers/components/basic'
const mapStateToProps = (state, props)=>({
    filterData: get(state.filters, props.filterName),
})

export default function FilterMain(WrappedComponent){
    class FormComponent extends Component{
        ChangeFilter = (name, ev)=>{
            const val = get(ev.target, 'checked', ev.target.value);
            const {appendPath, filterName} = this.props;
            appendPath('filters', filterName, {[name]: val})
        }
        render() {
            const {name, filterData} = this.props;
            const field = {
                name: name,
                value: get(filterData, name, ''),
                onChange: this.ChangeFilter.bind(this, name)
            }
            const form = {
                values: filterData
            }
            return <BasicComponent compare={this.compares}>
                <WrappedComponent {...this.props} field={field} form={form} />
            </BasicComponent>
        }

    }
    const MainComponent = connect(mapStateToProps, mapDispatchToProps)(FormComponent);
    return MainComponent;
}
