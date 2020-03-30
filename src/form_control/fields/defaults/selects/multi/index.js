import React, { Component } from 'react'
import { Select } from 'antd';
import { connect } from 'react-redux'
import { Connect } from "helpers/functions"
import form_style from 'styles/form_control.less'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isEmpty, isEqual, pick } from 'lodash'
import applyFilter from 'helpers/functions/filters';
import BasicComponent from 'helpers/components/basic';
import { withTranslation } from 'react-i18next';

const { Option, OptGroup } = Select;
class selectboxClass extends Component {
    componentDidMount() {
        this.getData();
    }
    constructor(props) {
        super(props);
        this.compares = {
            fetch: ['list', 'params'],
            action: this.getData
        }
    }
    getData = () => {
        const { reduxName, child, list, fetchAll, setMain, apis } = this.props;
        let foundReduxName = get(apis, `${reduxName}`, {})
        let childReduxNames = []
        if (child) {
            childReduxNames = this.childReduxName(child, {})
        }
        let reduxList = [
            {
                ...foundReduxName
            },
            ...childReduxNames
        ]
        if (isEmpty(list) && reduxName) {
            map(reduxList,r=>{
                setMain(`${r.name}`, { name: `${r.name}` })
            })
            fetchAll(reduxList)
        }
    }
    childReduxName = (child, lastChildList) => {
        const { apis } = this.props;
        let childList = []
        if (lastChildList) {
            childList = [lastChildList]
        }
        let foundReduxName = get(apis, `${child.reduxName}`, {})
        childList.push(foundReduxName)
        if (child.child) {
            let temp = this.childReduxName(child.child, childList)
            childList.push(temp)
            return childList
        }
        return foundReduxName
    }


    handleChange = (value) => {
        const { field, onSelect } = this.props
        if (onSelect) {
            onSelect(value)
        }
        field.onChange({
            target: {
                name: field.name,
                value
            }
        });
    }

    renderOptions = () => {
        const { colValue, t, list, show = { key: 'GetDataSelector', show: 'name' } } = this.props
        return map(list, (d, index) => {
            const val = applyFilter(show, d)
            const child = applyFilter({ key: 'childData', redux: 'licenses__location', select: { chain: 'id' } }, d)
            return <OptGroup
                key={index}
                label={t(val)}
                style={{ width: '100%' }}
            >
                <Option
                    key={index}
                    value={get(d, colValue, d.id)}
                    style={{ width: '100%' }}>
                    {t(val)}
                </Option>
            </OptGroup>
        })
    }

    render() {
        const { label, field = {}} = this.props

        return (
            <BasicComponent compare={this.compares}>
                <div>
                    {label ? <div><span className={form_style.text_name}>{label}</span></div> : undefined}
                    <Select
                        mode="multiple"
                        defaultValue={field.value ? field.value : ""}
                        placeholder="Please Select"
                        value={field.value}
                        style={{ fontSize: '1vw', display: 'flex' }}
                        onChange={this.handleChange}
                        onSearch={this.handleSearch}
                    >
                        {this.renderOptions()}
                    </Select>
                </div>
            </BasicComponent>
        )
    }
}
const selectbox = withTranslation()(selectboxClass)
const mapStateToProps = (state, ownProps) => ({
    list: ownProps.options || get(state, `${(ownProps.reduxName)}.data`, {}),
    stateVal:state,
    firstChild: get(state, `${(ownProps.child.reduxName)}.data`, {}),
    apis: get(state, 'apps.api', {}),
})

class select_connector extends Component {
    Component = <div></div>
    constructor(props) {
        super(props);
        this.getComponent(props, props);
        this.getInit(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['list', 'apis', 'mainValues', 'field.value']
        const su = !isEqual(pick(this.props, compare), pick(nextProps, compare));
        if (su && !nextProps.field.value) {
            this.getInit(nextProps);
        }
        return su;
    }
    getInit(nextProps) {
        const { form, init, field, mainValues = form.values } = nextProps;
        if (init) {
            const value = applyFilter(init, mainValues);
            if (value) {
                field.onChange({ target: { name: field.name, value } })
            }
        }
    }
    getComponent = (props, main) => {
        this.connectFunction(main.reduxName)
        if (main.child) {
            this.getComponent(props, main.child)
        }

    }

    connectFunction = (reduxName) => {
        const { apis, } = this.props
        let foundReduxName = get(apis, `${reduxName}`, {});
        const app = {
            name: `${foundReduxName.name}`,
            settings: {
                url: foundReduxName.api
            }
        }
        this.Component = Connect(null, app, selectbox)
    }
    render() {
        const { field, filter = { key: 'List', select: {} }, form, mainValues = form.values } = this.props;
        const mainValue = field.value || this.mainValue;
        const params = applyFilter({ ...filter, key: 'mapSelect' }, {}, mainValues);
        const list = applyFilter(filter, this.props.list, mainValues)
        return (
            <this.Component {...{ ...this.props, mainValue, list }} params={params} />
        )
    }
}
export const multi_select = connect(mapStateToProps, mapDispatchToProps)(select_connector)
export default multi_select;
