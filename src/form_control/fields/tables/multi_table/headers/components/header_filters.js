import React, { Component, Suspense } from 'react';
import * as FormComponents from 'form_control/fields'
import {get, isEmpty} from 'lodash'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main';

class headerFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: []
        }
    }


    selectChange(value){

        const {appendPath, filter={}} = this.props
        let newVal = isEmpty(value) ? null : value
        appendPath("table_filters", `${filter.filter_name}.${filter.reduxName}`, {[filter.name]: newVal})
        this.setState({
            value
        })
    }

    render() {
        const {filter={}, filtered_rows={}} = this.props
        const FilterComponent = get(FormComponents,filter.type, FormComponents.tree_select)
        return (
            <Suspense fallback={<></>}>
                <FilterComponent
                    {...{ ...this.props, ...filter }}
                    field={{
                        value: this.state.value
                    }}
                    onSelectChange={this.selectChange.bind(this)}
                    filteredData= {{...filtered_rows}}
                />
            </Suspense>

        )
    }
}

export default connect(null, mapDispatchToProps)(headerFilter);