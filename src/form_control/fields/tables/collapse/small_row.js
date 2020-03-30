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
        let { field, child = {}, filtered_columns, collapseAll,extra_show,filtered_rows,filteredList, ChildComponent, fields, index , padIndex} = this.props
        return <ChildComponent
            index={index}
            extra_show={extra_show}
            d={d}
            collapseAll={collapseAll}
            field={field}
            filteredList={filteredList}
            filtered_rows={filtered_rows}
            {...child}
            fields={fields}
            filtered_columns={filtered_columns}
            padIndex={padIndex + 2}
            parent_id = { d.id}
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
        const { index, redux_parent_id, child={}, parent_id } = this.props;
        let parentID = undefined
        const redux_parent_ID = get(v,'table_parent_id')
        if(redux_parent_id){
            parentID = redux_parent_ID ? redux_parent_ID : parent_id
        }else if(get(child, "redux_parent_id")){
            parentID =  redux_parent_ID ? redux_parent_ID : v.id 
        }
        return [...index,parentID, v.id, f.name].filter(d => d).join('.');
    }
    getMainValue = (f, index, list, values) => {
        const {fun={key: 'Reduce'}} = f
        return mainFun(fun,  f, index, list, values, {...pick(this, ['getFieldName']), data: this.props.data, field: this.props.field})

    }

    applyPermission(f={}, name=""){
        const {filter:{parent_key, child_key,pick, ...filter_params}} = f.permission
        const field_name = name.split(".")
        let params ={}
        if(field_name[2] && field_name[0] != field_name[1]) {
            parent_key ? params[parent_key] = field_name[0] : null
            params[child_key] = field_name[1]
        } else {
            params[child_key] = field_name[0]
        }
        const item = applyFilter({
            params,
            ...filter_params,
        })
        return get(item,pick,false)
    }

    renderCell(d, fields) {
        const { data, child, index, reduxName,check_val, field, filtered_columns } = this.props
        return map(fields, (f, key) => {
            const included = (f.levels || []).includes(reduxName)
            if(!filtered_columns || filtered_columns.includes(f.name)) {
                let show_field = true
                if ((f.parent || included) && child) {
                    const mainValue = this.getMainValue(f, index, this.list, field.value)
                    const mainChange = this.handelParentChange.bind(this, f);
                    let condition = get(child || {}, 'redux_parent_id') && !get(d, check_val)
                    const field_name = this.getFieldName( condition ? d : {}, f)
                    if(f.permission) {
                        show_field = this.applyPermission(f, field_name)
                    }
                    let mainProps = {}
                    if(!condition){
                        mainProps = {
                            mainValue,
                            mainChange
                        }
                    }else{
                        mainProps.mainValues = get(this.props.field, `value.${data.id}.${data.id}`, '')
                    }
                    return show_field ? <TCell key={key} f={{...f, type: f.parent_type || f.type}} name={field_name} data={data} {...mainProps} />
                        : <td></td>
                } else if ((f.child || included) && !child) {
                    const mainValues = get(this.props.field, `value.${data.id}`, '')
                    const field_name = this.getFieldName(d, f)
                    if(f.permission) {
                        show_field = this.applyPermission(f, field_name)
                    }
                    
                    return show_field ? <TCell key={key} f={f} mainValues={mainValues} name={field_name} data={d}/>
                        :<td></td>
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
        this.show_row = child ? !isEmpty(this.mainList) || child.alwaysShow : true
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
