import React, { Component } from 'react';
import { get, map, max, concat, isEmpty, pick } from 'lodash';
import applyFilters from 'helpers/functions/filters'
import style from './style.less'

export class Main extends Component {
    constructor(props) {
        super(props);
    }

    renderHeaderTitle() {
        const {col_header_filter={}, labels={}, show = { key: 'GetDataSelector', show: 'name' },total_cols={}, fields, settings = {}, colsList } = this.props
        
        let multi_columns = map(this.data, (d, key) => {
            let ChildData = fields.length;
            if (settings.child) {
                const child_redux_name = get(settings, 'child.reduxName')
                let data = get(colsList, child_redux_name, [])
                !isEmpty(col_header_filter[child_redux_name]) ? data = pick(data, col_header_filter[child_redux_name]) : null
                
                ChildData *= applyFilters({ key: 'Filter', params: { [get(settings, 'child.match')]: d.id } }, data).length;
                if(!ChildData){
                    return ''
                }
            }
            return <th key={key} colSpan={max([ChildData, 1])} className={style.head_td}>
                {applyFilters(show, d)}
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
                    {total_cols.title}
                </th>) 
            } else {
                total_columns.push(<th key="totals" colSpan={max([childsData, 1])} className={style.head_td} > </th>)
            }
        }
        return concat(total_columns, multi_columns) 
    }

    renderHeader(fields, d) {
        //const { fields } = this.props;
        
        return map(fields, (d, index) => (
            <th key={d.name} className={style.small_head_th}>
                {d.head}
                {d.filter && 
                    <HeaderFilter {...d} filter={d.filter}/> 
                }
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
        const {colsList, settings = {}, mainHeader={} } = this.props
        let redux_name = settings.reduxName ? settings.reduxName : settings.filter_name
        this.data = redux_name? get(colsList, redux_name): get(colsList, "dates")
        console.log(this.props)
        const Child = this.renderChilds();
        return <>
            <tr>
                <th colSpan={1} className={style.head_td}> 
                    {mainHeader.title} 
                </th>
                {this.renderHeaderTitle()}
            </tr>
            {Child}
        </>
    }
}
