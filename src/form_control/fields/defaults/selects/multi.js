import React, { Component } from 'react'
import { Select } from 'antd';
import { connect } from 'react-redux'
import { Connect } from "helpers/functions"
import form_style from 'styles/form_control.less'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isEmpty, isEqual, pick, filter } from 'lodash'
import applyFilter from 'helpers/functions/filters';
import BasicComponent from 'helpers/components/basic';
import { withTranslation } from 'react-i18next';
const { Option, OptGroup } = Select;
class selectboxClass extends Component {

    state={
        searchQuery: ''
    }

    componentDidMount() {
        this.getData();
    }
    constructor(props) {
        super(props);
        this.compares = {
            fetch: ['parentList', 'list', 'params'],
            action: this.getData
        }
    }
    getData = () => {
        const { reduxName, parentReduxName,extra, list, fetchAll, setMain, apis } = this.props;
        let foundReduxName = get(apis, `${reduxName}`, {})
        let foundParentReduxName = get(apis, `${parentReduxName}`, {})
        let foundExtraReduxName = get(apis, `${extra}`, {})
        if (isEmpty(list) && reduxName) {
            setMain(`${foundReduxName.name}`, { name: `${foundReduxName.name}` })
            setMain(`${foundParentReduxName.name}`, { name: `${foundParentReduxName.name}` })
            setMain(`${foundExtraReduxName.name}`, { name: `${foundExtraReduxName.name}` })
            fetchAll([
                {
                    ...foundReduxName,
                    params: this.props.params
                },
                {
                    ...foundParentReduxName,
                    params: this.props.params
                },
                {
                    ...foundExtraReduxName,
                    params: this.props.params
                }
            ])
        }

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

    renderGroups = () => {
        const { parentList, t } = this.props
        return map(parentList, (group, index) => {
            return <OptGroup
                key={index}
                label={t(group.name)}
                style={{ width: '100%' }}
            >
                {this.renderOptions(group)}
            </OptGroup>
        })
    }

    renderOptions = (group) => {
        const { colValue, list, show = { key: 'chain', selectors: {dropdowns__units_of_measure:{ select: 'sales_unit' }}, }, match } = this.props
        let filterdList = filter(list, { [match]: group.id })
        return map(filterdList, (d, index) => {
            const val = applyFilter(show, d)
            return <Option
                key={index}
                value={get(d, colValue, d.id)}
                style={{ width: '100%' }}
            >
                { val.name}
            </Option>
        })
    }

    onSearch=(val)=>{
        // const {list } = this.props
        // const {searchQuery } = this.state

        // let temp=  filter(list, function(o) { return o.name == val; })
    }

    render() {
        const { label, field = {}, mode = "default", t } = this.props

        return (
            <BasicComponent compare={this.compares}>
                <div>
                    {label ? <div><span className={form_style.text_name}>{t(label)}</span></div> : undefined}
                    <Select
                        defaultValue={field.value ? field.value : mode=="multiple" ? []:''}
                        mode={mode}
                        placeholder="Please Select"
                        value={field.value}
                        style={{ fontSize: '1vw', display: 'flex', minWidth: '100%' }}
                        onChange={this.handleChange}
                        onSearch={this.onSearch}
                    >
                        {this.renderGroups()}
                    </Select>
                </div>
            </BasicComponent>
        )
    }
}
const selectbox = withTranslation()(selectboxClass)
const mapStateToProps = (state, ownProps) => ({
    list: ownProps.options || get(state, `${(ownProps.reduxName)}.data`, {}),
    parentList: get(state, `${(ownProps.parentReduxName)}.data`, {}),
    apis: get(state, 'apps.api', {}),
})

class select_connector extends Component {
    Component = <div></div>
    constructor(props) {
        super(props);
        this.getComponent(props);
        this.getInit(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['list', 'apis', 'mainValues', 'field.value','parentList']
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
    getComponent = (props) => {
        const { apis } = this.props
        let foundReduxName = get(apis, `${props.reduxName}`, {});
        const app = {
            name: `${foundReduxName.name}`,
            settings: {
                url: foundReduxName.api
            }
        }
        this.Component = Connect(null, app, selectbox)

        let foundParentReduxName = get(apis, `${props.parentReduxName}`, {});
        const appParent = {
            name: `${foundParentReduxName.name}`,
            settings: {
                url: foundParentReduxName.api
            }
        }
        this.Component = Connect(null, appParent, selectbox)

        let foundExtraReduxName = get(apis, `${props.extra}`, {});
        const Extra = {
            name: `${foundExtraReduxName.name}`,
            settings: {
                url: foundExtraReduxName.api
            }
        }
        this.Component = Connect(null, Extra, selectbox)
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
export const select_multi = connect(mapStateToProps, mapDispatchToProps)(select_connector)
export default select_multi;
