import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Select } from 'antd';
import { get } from 'lodash'

const { Option, OptGroup } = Select;
export class option extends Component {
    static propTypes = {
        prop: PropTypes
    }

    render() {
        const { d, colValue, val, index } = this.props
        return (
            <OptGroup
                key={index}
                value={val}
                style={{ width: '100%' }}
            >
                <Option
                    key={index}
                    value={get(d, colValue, d.id)}
                    style={{ width: '100%' }}>
                    {val}
                </Option>
            </OptGroup>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(option)
