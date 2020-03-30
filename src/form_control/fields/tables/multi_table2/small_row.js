import React from 'react';
import InputComponent from 'helpers/components/input';
import { map, get, isEmpty, pick, every, values, flatten, isEqual } from 'lodash';
import mainFun from 'helpers/functions/reducing';
import applyFilter from 'helpers/functions/filters'
import { connect } from 'react-redux';
import TCell from 'helpers/components/table/cell';
import mapDispatchToProps from 'helpers/actions/main'
import TDetails from 'helpers/components/table/details'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './style.less'

class TableCollapseRow extends InputComponent {
    constructor(props) {
        super(props);
        const { collapseAll} = props
        this.mainList = applyFilter(props.mainDataFilter, undefined, undefined, {data: props.data});
        this.state = {
            expand: collapseAll ? true : false ,
            icon: collapseAll ? 'chevron-up' : 'chevron-down',
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(!isEqual(this.props.collapseAll, nextProps.collapseAll)){
            const {collapseAll} = nextProps
            this.setState({
                expand: collapseAll ? true : false ,
                icon: collapseAll ? 'chevron-up' : 'chevron-down',
            })
        }
        return !isEqual({props: nextProps, state: nextState}, {props: this.props, state: this.state})
    }
   
    activeCollapse = () => {
        const { child } = this.props;
        const { expand } = this.state;
        if (child) {
            this.setState({
                expand: !expand,
                icon: expand ? 'chevron-down' : 'chevron-up'
            })
        }
    }

    renderArrow = () => {
        const { child } = this.props;
        const { icon } = this.state;
        if (!isEmpty(child)) {
            return <FontAwesomeIcon
                style={{ fontSize: '0.8vw' }}
                icon={icon} />
        }

    }
    getFilteredData(props) {
        const { mainList } = this;
        const { mainFilter } = props;
        this.list = applyFilter(mainFilter, mainList);
    }
    
    renderInnerRow(d) {
        let { col_header_filter, compare, filter_name, field, total,filtered_rows, 
            totalChange,collapseAll, extra_show, labels, child = {}, total_cols, colKey, 
            colsList, ChildComponent, fields, index, padIndex } = this.props
        return <ChildComponent
            index={index}
            colKey={colKey}
            labels={labels}
            extra_show={extra_show}
            ChildComponent={ChildComponent}
            colsList={colsList}
            filter_name={filter_name}
            compare={compare}
            col_header_filter={col_header_filter}
            total_cols={total_cols}
            d={d}
            collapseAll={collapseAll}
            total={total}
            totalChange={totalChange}
            field={field}
            {...child}
            reduxName={child.reduxName}
            filtered_rows={filtered_rows}
            fields={fields}
            padIndex={padIndex + 1}
        />
    }

    handelParentChange = (f, index, ev) => {
        const { field } = this.props;
        const val = get(ev, 'target.value', ev.target.checked);
        map(this.list, (d, key) => {
            field.onChange({
                target: {
                    name: this.getFieldName(d, f, index),
                    value: val
                }
            })
        })
    }
    getFieldName = (v, f, i) => {
        const { index } = this.props;
        return [...index, i, v.id, f.name].filter(d => d).join('.');
    }
    getMainValue = (f, index, list, values) => {
        const {fun={key: 'Reduce'}} = f
        return mainFun(fun,  f, index, list, values, {...pick(this, ['getFieldName']), data: this.props.data, field: this.props.field})

    }

    renderCell(index) {
        const { fields } = this.props
        return map(fields, (f, key) => {
            return this.renderTCell(f, true, key, index)
        })
    }

    renderTCell(f, is_multi, key, index, props={}) {
        let { data, child, reduxName, totalChange, field } = this.props
        const included = (f.levels || []).includes(reduxName)
        let totalProps = {}
        if(!is_multi){
            totalProps.totalChange = totalChange;
        }
        if ((f.parent || included) && child) {
            if(f.parent_field){
                f = f.parent_field
            }
            //console.log(f)
            const i_name = is_multi ? index:'total'
            const mainValue = this.getMainValue(f, i_name, this.list, props.values || field.value)
            const mainChange = this.handelParentChange.bind(this, f, i_name);
            return <TCell 
                key={key} f={{...f, type: f.parent_type || f.type}}
                // {...props}
                {...totalProps}
                allValues={is_multi ? null : field.value} 
                name={is_multi ? this.getFieldName({}, f, index) : this.getFieldName(data, f, 'total')} 
                data={data} mainValue={mainValue} mainChange={mainChange} />
        } else if ((f.child || included) && !child ) {
            if(!is_multi){
                totalProps.mainValue = get(props.values, this.getFieldName(data, f, 'total'))
            }
            return <TCell
                {...props}
                key={key} f={f}
                {...totalProps}
                allValues={is_multi ? null : field.value} 
                name={is_multi ? this.getFieldName(data, f, index) : this.getFieldName(data, f, 'total')} 
                data={data} />
        }
        return <td className={style.td_row}></td>

    }
    renderCols(fields) {
        const {form, labels, data, total} = this.props;
        let rows = map(this.cols, d => (this.renderCell(d.id)))
        let firstRows = map(this.props.total_cols, (col) => {
            const mainValue = get(total, this.getFieldName(data, col, 'total'))
            return (this.renderTCell(col, false, col.name, undefined, {values: {total}, totalValue: mainValue, mainForm: form}))
        })
        let labelsRows = map(labels.fields, (col) => {
            return (this.renderTCell(col, false, col.name, undefined))
        })
        return <>
        {labelsRows}
        {firstRows}
        {rows}
        </>
    }

    renderGroupBody = () => {
        const { data, show, child, padIndex, extra_show } = this.props;
        const { expand } = this.state;
        return <>
            <tr>
                <TDetails
                    data={data}
                    filter={show}
                    extra_show={extra_show}
                    expand={expand}
                    collapse={Boolean(child)}
                    onClick={this.activeCollapse}
                    padIndex={padIndex}
                    renderArrow={this.renderArrow}
                />
                {this.renderCols()}
            </tr>
            {expand && this.renderInnerRow(data)}
        </>
    }


    render() {
        const { colsList, colKey, col_header_filter={},data, compare} = this.props;
        
        this.cols = get(colsList, colKey);
        !isEmpty(col_header_filter[colKey]) ? this.cols = pick(this.cols,col_header_filter[colKey]) : null
        this.getFilteredData(this.props)
        if(compare) {
            return isEmpty(flatten(values(compare))) || every(compare, (v,k) => !v || v.includes(data[k]) ) ? 
            this.renderGroupBody() :  <></>
        }

        return this.renderGroupBody()
    }
}

const mapStateToProps = (state, props) => ({
    childData: get(state, `${get(props, 'child.reduxName', '')}.data`, {}),
    mainFilter: get(state.filters, `${props.field.name}`, { key: 'Filter', params: {} })

})

export default connect(mapStateToProps, mapDispatchToProps)(TableCollapseRow)
