import React, { Component } from 'react'
import { Tree } from 'antd';
import form_style from 'styles/form_control.less'
import {
    get, map, isUndefined, isEqual, pick, isEmpty, intersection, compact, values,
} from 'lodash'
import applyFilter from 'helpers/functions/filters';
import BasicComponent from 'helpers/components/basic';
import { ConnectAllApps } from 'helpers/functions/index';
import { getChildFilter } from 'helpers/functions/main'
import '../style.css'
import { connect } from 'react-redux'
import style from '../style.less'
import { renderAsterisk } from 'form_control/validation'
import { withTranslation } from 'react-i18next';

const TreeNode = Tree.TreeNode;
const SHOW_CHILD = Tree.SHOW_CHILD;
const SHOW_ALL = Tree.SHOW_ALL;
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class SelectboxClass extends Component {

    state = {
        searchVal: ""
    }

    handleChange = (value) => {
        const { field, mainChange=field.onChange, onSelect } = this.props
        if (onSelect) {
            onSelect(value)
        }
        mainChange({
            target: {
                name: field.name,
                value
            }
        });
    }
    renderOptions = () => {
        const { show = { key: 'GetDataSelector', show: 'name' }, t, tree, filteredData = {}, filteredChildData, selectParent = true } = this.props
        // const { searchVal } = this.state
        let firstLayer = tree.reduxName ?
            applyFilter({ key: 'Filter', path: tree.reduxName }) : tree.options
        let child = get(tree, 'child', undefined)
        // firstLayer = firstLayer.filter((d) => includes(toLower(d.name), searchVal))
        // console.log('object', firstLayer)
        const treeNodes = map(firstLayer, (d, index) => {
            const mainList = applyFilter(this.props.mainDataFilter, undefined, undefined, { data: d });
            const filteredMainList = this.props.filter ? intersection(mainList, filteredChildData) : mainList
            const title = d.title || applyFilter(show, d)
            if (!isEmpty(filteredMainList) || tree.options) {
                return <TreeNode value={d.id} title={t(title)} key={d.id} path={d.name} selectable={selectParent}>
                    {this.renderSubOptions(d, child || d.child, filteredMainList, filteredData)}
                </TreeNode>
            }

        })
        return compact(treeNodes)
    }

    renderSubOptions = (aboveItem, child, filteredMainList, filteredData = {}) => {
        // const { searchVal } = this.state

        if (!isUndefined(child)) {
            const { show = { key: 'GetDataSelector', show: 'name' }, path = show } = child;
            const {t} = this.props
            let secondChild = get(child, 'child', undefined)
            let layerData = null;
            if (child.options) {
                layerData = child.options
            } else {
                layerData = get(filteredData, child.reduxName) ?
                    values(get(filteredData, child.reduxName)) : applyFilter({
                        key: 'Filter', path: child.reduxName,
                        params: { [child.match]: aboveItem.id }
                    }, secondChild ? undefined : filteredMainList)
            }
            // layerData = layerData.filter((d) => includes(toLower(d.name), searchVal))
            return map(layerData, (d, index) => {
                const title = applyFilter(show, d)
                return <TreeNode value={d.id} path={applyFilter(path, d)} title={t(title)} key={d.id}>
                    {this.renderSubOptions(d, secondChild, filteredMainList)}
                </TreeNode>
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { reset_fields = [] } = nextProps
        const reset = reset_fields.map(f => `form.values.${f}`)
        if (!isEqual(pick(this.props, reset), pick(nextProps, reset)) && this.props.field.value) {
            this.resetField(nextProps);
        }
        return !isEqual({ props: this.props, state: this.state }, { props: nextProps, state: nextState });
    }

    resetField(props) {
        const { field, multiple = true } = props
        field.onChange({ target: { name: field.name, value: multiple ? [] : '' } })
    }

    handleSearch = (searchVal) => {
        // console.log('list', searchVal)
        this.setState({ searchVal: searchVal })
    }

    render() {
        const { onSelectChange = this.handleChange, label, topLabel, t, placeholder = "Please select", field = {}, showParentVal, expand_all = true, multiple = true, validates = {} } = this.props

        let showInValue = showParentVal ? SHOW_ALL : SHOW_CHILD
        return (
            <BasicComponent compare={this.compares}>
                <div>
                    {label ?
                        <div>
                            {topLabel && <p className={style.top_label}>{t(topLabel)}</p>}
                            <div className={form_style.text_name}>{t(label)}{renderAsterisk(validates)}</div>
                        </div>
                        : undefined}
                    <Tree
                        checkable
                        style={{ fontSize: '1vw' }}
                        // value={field.value}
                        defaultExpandAll={expand_all}
                        multiple={multiple}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        checkedKeys={field.value}
                        placeholder={placeholder}
                        treeNodeLabelProp='path'
                        treeCheckable={multiple}
                        showCheckedStrategy={showInValue}
                        onCheck={onSelectChange}
                    >
                        {this.renderOptions()}
                    </Tree>
                </div>
            </BasicComponent>
        )
    }
}

const Selectbox = withTranslation()(SelectboxClass)

class select_connector extends Component {
    Component = <div></div>

    constructor(props) {
        super(props);
        const { tree, fetchApi } = props
        ConnectAllApps(tree, fetchApi)
        this.mainDataFilter = getChildFilter(tree)

    }

    filterChildData(child) {
        const { filter, filteredData = {}, form = {}, noFilterVals } = this.props
        let { mainValues } = this.props
        mainValues = mainValues || noFilterVals ? undefined : form.values

        if (child.child) {
            return this.filterChildData(child.child)
        }

        let mainList = get(filteredData, child.reduxName) ?
            values(get(filteredData, child.reduxName)) : applyFilter({ key: 'Filter', path: child.reduxName })
        return filter ? applyFilter(filter, mainList, mainValues) : mainList

    }

    render() {
        const { tree } = this.props
        const filterdData = this.filterChildData(tree)
        return (
            <Selectbox mainDataFilter={this.mainDataFilter} filteredChildData={filterdData} {...this.props} />
        )
    }
}
export const tree_select = connect((state, props) => ({
    data: get(state, props.tree.reduxName)
}))(select_connector)
export default tree_select;
