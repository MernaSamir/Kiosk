import React from 'react';
import InputComponent from 'helpers/components/input';
import { map, get, omit, pick, assign } from 'lodash';
import SmallRow from './small_row';
import applyFilter from 'helpers/functions/filters';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
class TableCollapseRow extends InputComponent {

    renderGroupBody() {
        const {filteredList,filtered_columns,rows,rows_filtered,reduxName,filtered_rows, collapseAll, extra_show, data, field, filteredData, show, index, fields, child, padIndex, sortAlpha} = this.props;
        
        let dataFiltered = (!child && filteredData) ? pick(data, filteredData) : data
        let list_filter = rows && rows.reduxName == reduxName && rows.in_row_filter ?
            assign(this.props.filter, {params:{ ...this.props.filter.params,  ...rows.in_row_filter} })
             : this.props.filter

        
        let list = applyFilter(list_filter, get(filtered_rows, reduxName, dataFiltered));
        if(rows && rows.reduxName == reduxName && rows_filtered) {
            list = list.filter( l => rows_filtered.includes(l.id))
        }
        
        let sortedList = list
        if(sortAlpha){
            sortedList= map(list,d=>d).sort(function(a, b){
                if(a.name < b.name) { return -1; }
                if(a.name > b.name) { return 1; }
                return 0;
            })
        }

        return map(sortedList, (d, key)=>(
            <SmallRow 
                extra_show={extra_show}
                collapseAll={collapseAll}
                key={key} 
                filteredList={filteredList}
                field={field} 
                reduxName={reduxName}
                show={show} 
                data={d} 
                index={index}
                rows={rows}
                rows_filtered={rows_filtered}
                filtered_rows={filtered_rows} 
                child={child} 
                fields={fields}
                filtered_columns={filtered_columns} 
                ChildComponent={TableCollapsePluse}
                padIndex={padIndex} /> 
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

export const TableCollapsePluse = connect(mapStateToProps, mapDispatchToProps)(TableCollapseRow)
export default TableCollapsePluse
