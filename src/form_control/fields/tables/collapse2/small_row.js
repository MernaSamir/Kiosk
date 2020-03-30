import React from 'react';
import InputComponent from 'helpers/components/input';
import { map, get, filter, pick, isEqual, isEmpty } from 'lodash';
import { connect } from 'react-redux';
import TCell from 'helpers/components/table/cell';
import mapDispatchToProps from 'helpers/actions/main'
import TDetails from 'helpers/components/table/details'
import applyFilter from 'helpers/functions/filters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import mainFun from 'helpers/functions/reducing'

class TableCollapseRow extends InputComponent {

    constructor(props) {
        super(props);
        const { child = {}, data, collapseAll } = props;
        this.mainList = filter(props.childData, { [child.match]: data.id });
        this.list = this.getFilteredData(props)

        this.state ={
            expand: collapseAll ? true : false,
            transform: 'rorate(0deg)',
            transitionDuration: '0.4s',
            icon: collapseAll ? 'chevron-up' : 'chevron-down',
        }

    }


    activeCollapse = () => {
        const { child } = this.props;
        const { expand } = this.state;
        if (child) {
            this.setState({
                expand: !expand,
                transform: expand ? 'rotate(0deg)' : 'rotate(180deg)'
            })
        }
    }
    shouldComponentUpdate(nextProps, nextState, ...props) {
        const compare = ['mainFilter'];
        const su = isEqual(pick(nextProps, compare), pick(this.props, compare));
        if (su) {
            this.list = this.getFilteredData(nextProps)
        }
        if(!isEqual(this.props.collapseAll, nextProps.collapseAll)){
            const {collapseAll} = nextProps
            this.setState({
                expand: collapseAll ? true : false ,
                icon: collapseAll ? 'chevron-up' : 'chevron-down',
            })
        }
        return !isEqual({ props: nextProps, state: nextState }, { state: this.state, props: this.state })
    }
    getFilteredData(props) {
        const { mainList } = this;
        const { mainFilter } = props;
        return applyFilter(mainFilter, mainList);
    }
    
    renderInnerRow(d) {
        let { field, child = {},filtered_columns, collapseAll,extra_show,rows,rows_filtered,filtered_rows,filteredList, ChildComponent, fields, index , padIndex} = this.props
        return <ChildComponent
            index={index}
            extra_show={extra_show}
            d={d}
            collapseAll={collapseAll}
            rows={rows}
            field={field}
            filteredList={filteredList}
            rows_filtered={rows_filtered}
            filtered_rows={filtered_rows}
            {...child}
            fields={fields}
            filtered_columns={filtered_columns}
            padIndex={padIndex + 2}
        />
    }

    handelParentChange = (f, ev) => {
        const { field } = this.props;
        //let value = get(field.value, index, {});
        const val = get(ev, 'target.value', ev.target.checked);
        map(this.list, (d, key) => {
            field.onChange({
                target: {
                    name: this.getFieldName(d, f),
                    value: val
                }
            })
            //set(value, `${d.id}.${f.name}`, val);
        })
    }
    getFieldName = (v, f) => {
        const { index } = this.props;
        return [...index, v.id, f.name].filter(d => d).join('.');
    }
    getMainValue = (f, index, list, values) => {
        const {fun={key: 'Reduce'}} = f
        return mainFun(fun,  f, index, list, values, {...pick(this, ['getFieldName']), data: this.props.data, field: this.props.field})

    }

    renderCell(d, fields) {
        const { data, child, index, reduxName, field, filtered_columns } = this.props
        return map(fields, (f, key) => {
            const included = (f.levels || []).includes(reduxName)
            if(!filtered_columns || filtered_columns.includes(f.name)) {

                if ((f.parent || included) && child) {
                    const mainValue = this.getMainValue(f, index, this.list, field.value)
                    const mainChange = this.handelParentChange.bind(this, f);
                    return <TCell key={key} f={{...f, type: f.parent_type || f.type}} name={this.getFieldName({}, f)} data={data} mainValue={mainValue} mainChange={mainChange} />
                } else if ((f.child || included) && !child) {
                    const mainValues = get(this.props.field, `value.${data.id}`, '')
                    return <TCell key={key} f={f} mainValues={mainValues} name={this.getFieldName(d, f)} data={d}/>
                }
                return <td></td>
            }
            return <></>
        })
    }
    renderArrow = () => {
        const { child } = this.props;
        const { icon } = this.state;
        if (!isEmpty(child)) {
            return <FontAwesomeIcon
                style={{ fontSize: '1vw', marginRight:'1%' }}
                icon={icon} />
        }

    }

    renderGroupBody = () => {
        const { data, show, fields, child, padIndex, extra_show } = this.props;
        const { expand } = this.state;
        this.show_row = child ? !isEmpty(this.mainList) : true
        return <>
            {this.show_row && <tr>
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
                {this.renderCell(data, fields)}
            </tr>}
            {expand && this.renderInnerRow(data)}
        </>
    }
    render() {
        return this.renderGroupBody()
    }
}

const mapStateToProps = (state, props) => ({
    childData: get(state, `${get(props, 'child.reduxName', '')}.data`, {}),
    mainFilter: get(state.filters, `${props.field.name}.data`, {})
})

export default connect(mapStateToProps, mapDispatchToProps)(TableCollapseRow)
