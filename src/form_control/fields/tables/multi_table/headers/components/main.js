import React, { Component } from 'react';
import { get, map, max, concat, isEmpty, pick } from 'lodash';
import applyFilters from 'helpers/functions/filters'
import style from './style.less'
import HeaderFilter from './header_filters'
import { withTranslation } from 'react-i18next';

class MainClass extends Component {
    constructor(props) {
        super(props);
        // this.sortedList = []
    }

    renderHeaderTitle() {
        const {col_header_filter={}, labels={},my_sorted_list=[], show = { key: 'GetDataSelector', show: 'name' },total_cols={}, fields, settings = {}, colsList, t } = this.props
        const diff_show = settings.show ? settings.show : show
        const sorted_ids = my_sorted_list.length ? my_sorted_list:map(this.data, d=>d.id)
        let multi_columns = map(sorted_ids, (id, key) => {
            const d = get(this.data, id)
            let ChildData = fields.length;
            if (settings.child) {
                const child_redux_name = get(settings, 'child.reduxName')
                let data = get(colsList, child_redux_name, [])
                !isEmpty(col_header_filter[child_redux_name]) ? data = pick(data, col_header_filter[child_redux_name]) : null
                const c_data = applyFilters({ key: 'Filter', params: { [get(settings, 'child.match')]: d.id } }, data);
                ChildData *= c_data.length;
                this.sortedList = [...this.sortedList, ...c_data.map(d=>d.id) ]
                if(!ChildData){
                    return ''
                }
            }
            return <th key={key} colSpan={max([ChildData, 1])} className={style.head_td}>
                {applyFilters(diff_show, d)}
            </th>

        }).filter(Boolean)

        let total_columns = []
        if( get(labels, 'fields.length')) {
            let childsData = labels.fields.length;
            total_columns.push( 
                <th key="labels" colSpan={max([childsData, 1])} 
                    className={style.head_td} > 

                </th>
            )
            
        }
        if( total_cols.reduxName && !isEmpty(total_cols.fields)) {
            let childsData = total_cols.fields.length;
            if(total_cols.reduxName == settings.reduxName) {
                total_columns.push(<th key="totals" colSpan={max([childsData, 1])} className={style.head_td} >
                    {t(total_cols.title)}
                </th>) 
            } else {
                total_columns.push(<th key="totals" colSpan={max([childsData, 1])} className={style.head_td}> </th>)
            }
        }
        return concat(total_columns, multi_columns) 
    }

    renderHeader(fields, d) {
        //const { fields } = this.props;
        const {t} = this.props
        return map(fields, (d, index) => (
            <th key={d.name} className={style.small_head_th}>
                {t(d.head)}
                {/* {d.filter && 
                    <HeaderFilter {...d} filter={d.filter}/> 
                } */}
            </th>
        ))
    }

    renderHeaderCols() {
        const { labels={}, total_cols={}, fields} = this.props; 
        // const total_fields = total_cols.fields ? total_cols.fields.map((f) => 
        //     <th key={f.name}>{f.head}</th>) : [] ;
        const total_fields = !isEmpty(total_cols.fields) ? this.renderHeader(total_cols.fields) : [] ;
        const label_fields = labels.fields ? this.renderHeader(labels.fields) : [] ;
        const normal_fields = map(this.data, (d, key) => (this.renderHeader(fields,d)));
        return concat(label_fields, total_fields, normal_fields)
        
    }
    renderChilds() {
        const { settings = {} } = this.props;
        if (settings.child) {
            return <Main {...this.props} mainHeader={{}} settings={settings.child} />
        }
        return <tr>
            <th></th>
            {this.renderHeaderCols()}
        </tr>
    }

    render() {
        this.sortedList = []
        const {colsList, settings = {}, col_header_filter={}, mainHeader={}, t } = this.props
        let redux_name = settings.reduxName ? settings.reduxName : settings.filter_name
        this.data = redux_name ? get(colsList, redux_name) : get(colsList, "dates")
        !isEmpty(col_header_filter[redux_name]) ? this.data = pick(this.data, col_header_filter[redux_name]) : null
        
        // const Child = ;
        return <>
            <tr>
                <th colSpan={1} className={style.head_td}> 
                    {t(mainHeader.title)} 
                    {mainHeader.filter && 
                        <HeaderFilter {...this.props} filter={mainHeader.filter}/> 
                    }
                </th>
                {this.renderHeaderTitle()}
            </tr>
            {this.renderChilds()}
        </>
    }
}
export const Main = withTranslation()(MainClass)
