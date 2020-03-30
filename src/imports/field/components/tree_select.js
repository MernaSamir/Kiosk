import React, { Component } from 'react'
import { TreeSelect } from 'antd';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isUndefined } from 'lodash'
import applyFilter from 'helpers/functions/filters';
import BasicComponent from 'helpers/components/basic';
import { ConnectAllApps } from 'helpers/functions/index';

const TreeNode = TreeSelect.TreeNode;
const SHOW_CHILD = TreeSelect.SHOW_CHILD ;

class Selectbox extends Component {
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
        const { show = { key: 'GetDataSelector', show: 'name' }, tree ,field } = this.props
        let firstLayer = applyFilter({ key: 'Filter', path: tree.reduxName })
        let child = get(tree, 'child', undefined)
        return map(firstLayer, (d, index) => {
            return <TreeNode value={field.value} title={applyFilter(show, d)} key={d.id} path={d.name}>
                {this.renderSubOptions(d, child)}
            </TreeNode>
        })
    }

    renderSubOptions = (aboveItem, child) => {
        if (!isUndefined(child)) {
            const { show = { key: 'GetDataSelector', show: 'name' }, path = show } = child;
            let layerData = applyFilter({ key: 'Filter', path: child.reduxName, params: { [child.match]: aboveItem.id } })
            let secondChild = get(child, 'child', undefined)
            return map(layerData, (d, index) => {
                return <TreeNode value={d.id} path={applyFilter(path, d)} title={applyFilter(show, d)} key={d.id}>
                    {this.renderSubOptions(d, secondChild)}
                </TreeNode>
            })
        }
    }

    render() {
        const {  field = {} } = this.props

        return (
            <BasicComponent compare={this.compares}>
                <div>
                    {/* {label ? <div><span className={form_style.text_name}>{label}</span></div> : undefined} */}
                    <TreeSelect
                        showSearch
                        style={{ fontSize: '1vw', display: 'flex' }}
                        value={field.value}
                        defaultValue={field.value ? field.value : undefined}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        placeholder="Please select"
                        allowClear
                        multiple
                        treeNodeLabelProp='path'
                        treeCheckable={true}
                        showCheckedStrategy={SHOW_CHILD}
                        onChange={this.handleChange}
                        onSearch={this.handleSearch}
                    >
                        {this.renderOptions()}
                    </TreeSelect>
                </div>
            </BasicComponent>
        )
    }
}

class select_connector extends Component {
    Component = <div></div>
    constructor(props) {
        super(props);
        ConnectAllApps(props.tree, props.fetchApi)

    }
    render() {
        return (
            <Selectbox {...this.props} />
        )
    }
}
export const tree_select = connect((state, props) => ({
    list: get(state, props.tree.reduxName)
}), mapDispatchToProps)(select_connector)
export default tree_select;
