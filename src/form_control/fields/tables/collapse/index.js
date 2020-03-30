import React, { Component } from 'react'
import TableCollapseRow from './row';
import { connect } from 'react-redux';
import { get, map,mapValues, has, isEmpty } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import { ConnectAllApps } from "helpers/functions"
import applyFilter from 'helpers/functions/filters';
import style from './style.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Checkbox} from 'antd'
import { withTranslation } from 'react-i18next';
class TableCollapsePluse_ extends Component {
    constructor(props) {
        super(props);
        // debugger
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
            filtered = mapValues(rows_filter, (f, k) => {
                let filtering =  applyFilter(f)
                if(f.is_empty_true && isEmpty(filtering)) {
                    filtering = undefined
                }
                return filtering
            })
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
        const { child, reduxName,extra_show, field,rows={}, mainKey, fields, filteredList, filters, filter_values = {} } = this.props
        const { sortAlpha } = this.state
        const rowDataFilter = map(filteredList, d => (get(d, get(filters, 'data.row'))))
        let filtered_rows = this.filterByRow()
        let filtered_columns = this.filterColumns()
        return <TableCollapseRow
            reduxName={reduxName}
            collapseAll={this.state.collapseAll}
            rows={rows}
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
        let { fields = [], t } = this.props
        let filtered_columns = this.filterColumns()
        return fields.map((d, index) => {
            return !filtered_columns || filtered_columns.includes(d.name) ?
                <th key={index} colSpan={get(d, 'sub.length')} className={style.header_td}>{t(d.head)}</th>
                : <></>
            })
    }
    renderMainHeader = () => {
        const { mainHeader, mainKey, t } = this.props
        const show = applyFilter(mainHeader.show || { key: 'GetDataSelector', show: 'name' }, { id: mainKey });
        const display = [t(mainHeader.name), t(show)].filter(d => d).join(' - ')
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
        
        const { showHeader, select, showSubHeader, mainKey, t} = this.props;
        if (!select || mainKey) {
            return (
                <div className="tableCollapse-container">
                    <Checkbox 
                        checked={this.state.collapseAll}
                        onChange={this.onCollapseAllChange.bind(this)}>
                        {t('Collapse all')}
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


export const TableCollapsePluse = connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(withTranslation()(TableCollapsePluse_))

export default TableCollapsePluse
