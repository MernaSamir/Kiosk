import React, { Component } from 'react'
import { map } from 'lodash'
import { Select } from 'antd';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get } from 'lodash';
const Option = Select.Option;

class dropdown extends Component {

    renderMenu = () => {
        const { data, show, render = (d) => (d) } = this.props
        return map(data, (d, i) => (
            <Option value={get(d, 'id', d)}>{render(get(d, show, d))}</Option>
        ))

    }
    handleChange = (val) => {
        const { setMain, name, filters } = this.props
        setMain('report', { filters: { ...filters, [name]: val } })
    }

    render() {
        return (

            <div style={{ textAlign: 'center', marginBottom: '2%' }}>
                <Select defaultValue="Please Select"
                    style={{ width: 200 }}
                    onChange={this.handleChange}>
                    <Option value=''>--</Option>
                    {this.renderMenu()}
                </Select>
            </div>


        )
    }
}

const mapStateToProps = (state, props) => ({
    filters: get(state.report, 'filters', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(dropdown)
