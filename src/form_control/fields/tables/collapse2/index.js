import React, { Component } from 'react'
import TableCollapseRow from './row';
import { connect } from 'react-redux';
import { get, map, concat, isEmpty, mapValues, has } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import { ConnectAllApps } from "helpers/functions"
import applyFilter from 'helpers/functions/filters';
import style from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox } from 'antd'
class TableCollapsePluse_ extends Component {
    constructor(props) {
        super(props);
        ConnectAllApps(props, props.fetchingApis || [])
        this.state = {
            sortAlpha: false,
            collapseAll: get(props,'collapseAll')
        }
    }

    filterByRow() {
        const {rows_filter} = this.props;
        let filtered = {};
        if(rows_filter) {
            filtered = mapValues(rows_filter, (f, k) => (applyFilter(f)))
        }
        return filtered
    }

    filterColumns(){
        const {column_filter, fields=[]} = this.props
        if(column_filter) {
            let filtered = mapValues(column_filter, (v,k) => (applyFilter(v)))
            return fields.map( field =>  has(filtered, field.name) ?  get(filtered, field.name) ? field.name : null : field.name)
        }
        return null
    }

    renderRows = () => {
        const { child, reduxName,extra_show,collapseAll, field,rows={},fullForm, mainKey, fields, filteredList, filters, filter_values = {} } = this.props
        const { sortAlpha } = this.state
        const rowDataFilter = map(filteredList, d => (get(d, get(filters, 'data.row'))))
        
        let rows_filtered = null;
        if(rows.row_filter){
            
            const {row_filter:{path, select, full_form_field_name, pick}} = rows
            if(!isEmpty(get(fullForm, full_form_field_name,[]))){
                rows_filtered = applyFilter({
                    key: 'Includes',
                    path,
                    select,
                }, undefined, undefined, {data: concat([], get(fullForm, full_form_field_name))})
            
                rows_filtered = rows_filtered.map(l => l[pick])
            }
             


        }

        let filtered_rows = this.filterByRow(this.props)
        let filtered_columns = this.filterColumns()
        
        return <TableCollapseRow
            reduxName={reduxName}
            collapseAll={this.state.collapseAll}
            rows={rows}
            rows_filtered={rows_filtered}
            filtered_rows={filtered_rows}
            child={child}
            extra_show={extra_show}
            field={field}
            fields={fields}
            filtered_columns={filtered_columns}
            index={[mainKey].filter(d => d)}
            padIndex={0}
            filteredData={filter_values.data && rowDataFilter}
            sortAlpha={sortAlpha}
        />
    }

    renderHeaders = () => {
        let { fields = [] } = this.props
        let filtered_columns = this.filterColumns()
        return fields.map((d, index) => {
            return !filtered_columns || filtered_columns.includes(d.name) ?
                <th key={index} colSpan={get(d, 'sub.length')} className={style.header_td}>{d.head}</th>
                : <></>
            })
    }
    renderMainHeader = () => {
        const { mainHeader, mainKey } = this.props
        const show = applyFilter(mainHeader.show || { key: 'GetDataSelector', show: 'name' }, { id: mainKey });
        const display = [mainHeader.name, show].filter(d => d).join(' - ')
        return <th className={style.header_td}> {this.renderSortButton()} {display} </th>
    }
    renderSortButton = () => {
        const { mainHeader } = this.props
        const { sortAlpha } = this.state
        if (mainHeader.sort) {
            return <FontAwesomeIcon
                icon="sort-alpha-down"
                onClick={this.toggleSort}
                className={sortAlpha ? style.sort_button_active : style.sort_button}
            />

        }
    }
    toggleSort = () => {
        const { sortAlpha } = this.state
        this.setState({ sortAlpha: !sortAlpha })
    }

    onCollapseAllChange(event){
        this.setState({collapseAll: event.target.checked})
    }
    render() {

        const { showHeader, select, showSubHeader, mainKey } = this.props;
        if (!select || mainKey) {
            return (
                <div className="tableCollapse-container">
                    <Checkbox 
                        checked={this.state.collapseAll}
                        onChange={this.onCollapseAllChange.bind(this)}>
                        Collapse all
                    </Checkbox>
                    <table style={{ width: '100%', overflowX: 'scroll' }}>
                        <thead>
                            {showHeader && <tr className="collapse-tr-first-child">
                                {this.renderMainHeader()}
                                {this.renderHeaders()}
                            </tr>
                            }
                            {showSubHeader && <tr className="collapse-tr-first-child">
                                <th className="first-th"></th>
                                {this.renderSubHeaders()}
                            </tr>
                            }
                        </thead>
                        <tbody>
                            {
                                this.renderRows()
                            }
                        </tbody>
                    </table>

                </div>
            )
        }
        return <div></div>
    }
}

const mapStateToProps = (state, props) => ({
    mainKey: get(state, props.select, ''),
    filteredList: get(state, `${props.layout}.filter.date`),
    fullForm: get(state, 'form')
})


export const TableCollapsePluse = connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(TableCollapsePluse_)

export default TableCollapsePluse
