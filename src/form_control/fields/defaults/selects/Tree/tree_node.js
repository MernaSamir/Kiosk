import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { TreeSelect } from 'antd';

const TreeNode = TreeSelect.TreeNode;
export class tree_node extends Component {
    static propTypes = {
        prop: PropTypes
    }

    render() {
        const {d} = this.props
        console.log('node',d)
        return (
            <TreeNode value={d.value} title={d.name} key={d.value}>
                {/* <TreeNode value="parenertt 2" title="parent 2-0" key="0-2-2">
                    <TreeNode value="leafert1" title="my leaf" key="randomasdasd" />
                    <TreeNode value="leaertf2" title="your leaf" key="randomsdds1" />
                </TreeNode> */}
            </TreeNode>
        )
    }
}


export default connect(null, null)(tree_node)
