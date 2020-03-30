import React, { Component } from 'react';
import styles from './styles.less';
import FormControl from 'form_control';
import { map } from 'lodash';
import FilterComponent from "helpers/components/filter";
import mapDispatchToProps from 'helpers/actions/main';
import { connect } from 'react-redux';

class Filter extends Component {
    renderFilters() {
        const { filters } = this.props;
        return map(filters, d => <div style={{margin:'1%'}}>
            <FormControl {...d} />
        </div>)
    }

    FilterChange = (values) => {

    }
    render() {
        const {filterChange} = this.props
        let onFilterChange = filterChange? filterChange : this.filterChange
        return (
            <FilterComponent FilterChange={onFilterChange}>
                <div className={styles.root}>
                    {this.renderFilters()}
                </div>
            </FilterComponent>
        );
    }
}

export default connect((state, ownProps) => ({

}), mapDispatchToProps)(Filter);
