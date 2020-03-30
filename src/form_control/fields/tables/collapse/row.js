import React from 'react';
import InputComponent from 'helpers/components/input';
import { map, get, omit, pick, isEmpty } from 'lodash';
import SmallRow from './small_row';
import applyFilter from 'helpers/functions/filters';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
class TableCollapseRow extends InputComponent {

    renderGroupBody() {
        const {filtered_columns,filteredList,add_parent_to_list,filtered_rows, 
            reduxName, collapseAll, extra_show, data, field, filteredData, show, 
            index, fields, child, padIndex, sortAlpha, 
            parent_id, redux_parent_id,check_val} = this.props;
        
        let dataFiltered = (!child && filteredData) ? pick(data, filteredData) : data
        let filter = this.props.filter
        if(filter && filter.add_id) {
            filter = {
                ...filter,
                [filter.add_id]: get(this.props,'d.id')
            }
        }
        let list = applyFilter(filter,get(filtered_rows, reduxName, dataFiltered) );
        if(reduxName && !isEmpty(list) && add_parent_to_list) {
            list = {[get(this.props,'d.id')]: get(this.props, 'd'), ...list}
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
                parent_id={parent_id} 
                redux_parent_id={redux_parent_id}
                check_val={check_val}
                index={index}
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
