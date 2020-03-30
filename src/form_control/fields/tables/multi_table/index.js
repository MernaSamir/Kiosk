import React, { Component } from 'react'
import TableCollapseRow from './row';
import {connect} from 'react-redux';
import { get, isEqual, set, pick, merge, mapValues, isEmpty } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'
import { ConnectAllApps } from 'helpers/functions'
import applyFilter from 'helpers/functions/filters';
import Header from './headers';
import style from './style.less'
import {Checkbox} from 'antd'
import { withTranslation } from 'react-i18next';

class TableMultiCols extends Component {
    constructor(props){
        super(props)
        this.state = {
            collapseAll: get(props,'collapseAll')
        }
    }
    renderRows = (colsList, filtered_rows) => {
        const { child, reduxName,appSettings,colKey,filter_name, field, mainKey, 
            labels={}, total_cols={}, fields } = this.props
        
            const {filtered_fields,total_cols_fields,labels_fields, col_header_filter} = this
        
        return <TableCollapseRow
            reduxName={reduxName}
            appSettingsRedux={appSettings.reduxName}
            collapseAll={this.state.collapseAll}
            filter_name={filter_name}
            total={this.state.total}
            totalChange={this.totalChange}
            labels={{ ...labels, fields: labels_fields || labels.fields }}
            child={child}
            field={field}
            colKey={colKey}
            fields={filtered_fields || fields}
            colsList={colsList}
            col_header_filter={col_header_filter}
            filtered_rows = {filtered_rows}
            total_cols={total_cols_fields || total_cols.fields} 
            index={[mainKey].filter(d=>d)}
            padIndex={0}
        />
    }

    totalChange = (ev)=>{
        const {add_totals, appendPath, appSettings={}, fullForm} = this.props
        this.newState = {};
        set(this.newState, ev.target.name, ev.target.value)
        this.setState(merge({}, {total: this.state.total}, this.newState))
        
        if(add_totals && add_totals.includes(get(ev.target.name.split('.'),'2')) &&  (get(fullForm, `${appSettings.reduxName}.${ev.target.name}.val`) != ev.target.value)) {
            appendPath('form', `${appSettings.reduxName}.${ev.target.name}` , {val: ev.target.value})
        }
    }

    renderHeaders = () => {
        const { fields=[]} = this.props
        return fields.map((d, index) => {
            return <th key={index} colSpan={get(d, 'sub.length')} className="n-th">{d.head}</th>
        })
    }

    filterColums(filters_value){
        const {fields, total_cols={}, labels={}} = this.props
        const columns_fields = get(filters_value, "filter_component.filter_multi_columns")
        
        this.col_header_filter = get(filters_value, "filter_component")
        if(!isEmpty(columns_fields)) {
            this.filtered_fields = fields.filter(field => columns_fields.includes(field.name));
            this.total_cols_fields = total_cols.fields.filter(field => columns_fields.includes(`total_${field.name}`)) 
            this.labels_fields =  labels.fields.filter(field => columns_fields.includes(`label_${field.name}`))
        } else {
            this.filtered_fields = null;
            this.total_cols_fields = null; 
            this.labels_fields = null;
        } 
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {reseting, compare_filters=[]} = this.props
        const compare = ['cols', 'reduxName', 'appSettings', 'form.values', 'fullForm']
        if(!isEqual(pick(nextProps, compare), pick(this.props, compare)) && this.list){
            this.filterData(nextProps);
        }
        if(!isEqual(pick(nextProps, compare_filters), pick(this.props, compare_filters))) {
            this.filterColums(nextProps.filters_value)
        }
        if (reseting) {
            const comparing = [`fullForm.${reseting.field}`]
            if(!isEqual(pick(nextProps, comparing), pick(this.props, comparing))){
                this.resetField(nextProps)
            }
        }

        return !isEqual({props: nextProps, state: nextState}, {props: this.props, state: this.state})
    }

    resetField(nextProps) {
        const {field:{value},form={}, reseting, fullForm} = nextProps
        const selectors = get(fullForm, reseting.field, []); 
        if(reseting.depth == 1) {
            form.setValues(pick(value, selectors))
        } else if(reseting.depth == 2) {
            mapValues(value, v => pick(v, selectors))
        }
    }
    renderMainHeader = () => {
        const { mainHeader,  mainKey} = this.props
        const show = applyFilter(mainHeader.show || {key: 'GetDataSelector', show: 'name'}, {id: mainKey});
        const display = [mainHeader.name, show].filter(d=>d).join(' - ')
        return <th className="first-th">{display}</th>
    }
    getFilteredData(props){
        const {colFilter, cols} = props;
        return applyFilter({
            key: 'chainChildData',
            cols,
            filters: colFilter
        });
    }

    filterByRow(props) {
        const {rows_filter} = props;
        let filtered = {};
        if(rows_filter) {
            filtered = mapValues(rows_filter, (f, k) => (applyFilter(f)))
        }
        return filtered
    }
    filterData(props){
        const { data_filter={}, deps=[], form={} } = props;

        const filtered = mapValues(data_filter, (d, key)=>(applyFilter(d, get(this.list, key),undefined, pick(get(form,'values',{}), deps))))
        const list = {...this.list, ...filtered}
        let filtered_rows = this.filterByRow(props)
        
        this.setState({
            list,
            filtered_rows
        })
    }
    getAppsData = (props)=>{
        const { fetchingApis=[] } = props;
        
        ConnectAllApps(props, fetchingApis, undefined, {extra: props.cols})
        .then(d=>{
            const list = this.getFilteredData(props);
            this.list = list
            this.filterData(props);
        });
    }
    componentDidMount() {
        this.getAppsData(this.props);
    }
    onCollapseAllChange(event){
        this.setState({collapseAll: event.target.checked})
    }

    render() {
        const { select, mainKey,cols, t, header, mainHeader, total_cols={}, fields, labels={}} = this.props;
        if(!select || mainKey){
            return (
                <div className="tableCollapse-container">
                    <Checkbox 
                        checked={this.state.collapseAll}
                        onChange={this.onCollapseAllChange.bind(this)}>
                        {t('Collapse all')}
                    </Checkbox>
                    <table  className={style.table}>
                        <thead>
                            <Header 
                                header={header}
                                mainHeader={mainHeader} 
                                filtered_rows = {this.state.filtered_rows}
                                total_cols={{ ...total_cols, fields: this.total_cols_fields || total_cols.fields }} 
                                labels={{ ...labels,  fields: this.labels_fields || labels.fields }}
                                colsList={this.state.list}
                                col_header_filter={this.col_header_filter} 
                                settings={cols}
                                fields={this.filtered_fields || fields} />
                        </thead>
                        <tbody>
                            {
                                this.renderRows(this.state.list, this.state.filtered_rows)
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
    appSettings: get(state, 'apps.active', {}),
    colFilter: get(state.filters, `${props.field.name}.cols`, {}),
    fullForm: get(state, 'form')
})


export const TableMultiCol = connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(withTranslation()(TableMultiCols))
export default TableMultiCol
