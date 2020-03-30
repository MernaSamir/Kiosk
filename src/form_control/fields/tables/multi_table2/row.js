import React from 'react';
import InputComponent from 'helpers/components/input';
import { map, omit, get} from 'lodash';
import SmallRow from './small_row';
import applyFilter from 'helpers/functions/filters';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import {getChildFilter} from 'helpers/functions/main'

class TableCollapseRow extends InputComponent {
    renderGroupBody() {
        const {filter_name ,full_row_filter={},collapseAll,field,filtered_rows,
            col_header_filter, total_cols, labels, total, extra_show, totalChange,
            show, index, colKey, colsList,reduxName, fields, child,padIndex} = this.props;
        
        let list = applyFilter(this.props.filter, get(filtered_rows, reduxName));
        const mainDataFilter = getChildFilter(this.props)
        return map(list, (d, key)=>(
            <SmallRow
                key={key}
                collapseAll={collapseAll}
                labels={labels}
                extra_show={extra_show}
                total={total} totalChange={totalChange}
                compare = {full_row_filter}
                filtered_rows={filtered_rows}
                filter_name={filter_name}
                total_cols={total_cols}
                field={field}
                mainDataFilter={mainDataFilter}
                colsList={colsList}
                col_header_filter={col_header_filter}
                colKey={colKey} show={show} data={d} index={index}
                reduxName={reduxName}
                child={child} fields={fields} ChildComponent={TableCollapsePluse} padIndex={padIndex}
            />
        ))
    }
    render() {
        return this.renderGroupBody()
    }
}
const mapStateToProps = (state, props) => ({
    
    filter: props.filter || {
        key: 'Filter',
        path: props.reduxName,
        params: omit({
            [get(props, 'match', '1')]: get(props, 'd.id', '')
        }, ['1'])
    },
    show: props.show || {
        key: 'GetDataSelector',
        show: 'name'
    },
    full_row_filter: get(state, `table_filters.${props.filter_name}.${props.reduxName}`)
})

export const TableCollapsePluse = connect(mapStateToProps, mapDispatchToProps)(TableCollapseRow)
export default TableCollapsePluse
