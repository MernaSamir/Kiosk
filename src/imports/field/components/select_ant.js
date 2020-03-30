import React, { Component } from 'react'
import { Select } from 'antd';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map, isEqual, pick } from 'lodash'
import BasicComponent from 'helpers/components/basic';
import applyFilters from 'helpers/functions/filters'

const Option = Select.Option;
class selectbox extends Component {
    constructor(props) {
        super(props);
        this.list = applyFilters({
            path: get(props.app, 'name'),
            key: 'Filter',
            params: {
                ...props.params
            }
        })
    }
    // componentDidUpdate(prevProps, prevState) {
    //     console.log('iam in did update')
    //     if(!isEqual(prevProps.params, this.props.params)){
    //         console.log('iaam here')
    //         this.list = applyFilters({
    //             path: get(this.props.app, 'name'),
    //             key: 'Filter',
    //             params:{
    //               ...this.props.params
    //             }
    //         })
    //     }
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     const compare = ['params'];
    //     return !isEqual(pick(this.props, compare), pick(nextProps, compare))
    // }



    handleChange = (value) => {
        const { field } = this.props

        field.onChange({
            target: {
                name: field.name,
                value
            }
        });
    }

    renderOptions = () => {
        const { colValue, show = { key: 'GetDataSelector', show: 'name' } } = this.props
        const { options } = this.props
        var data = this.list
        options ? data = options : data = this.list
        return map(data, (d, index) => {
            const val = applyFilters(show, d)
            return <Option
                key={index}
                value={get(d, colValue, d.id)}
                style={{ width: '100%' }}
            >
                {val}
            </Option>
        })
    }

    resetValue = () => {
        const {reset, field} = this.props
        map(reset, (v) => {
            let {value} = field
            if(isEqual(v.val, value)) {
                field.onChange({
                    target: {
                        name: v.path,
                        value: undefined
                    }
                })
            }
        })
    }

    render() {
        const { field = {}, mode = "default", reset } = this.props
        if(reset){
            this.resetValue()
        }
        return (
            <BasicComponent compare={this.compares}>
                <div>
                    <Select
                        defaultValue={field.value ? field.value : ""}
                        mode={mode}
                        placeholder="Please Select"
                        value={field.value}
                        onChange={this.handleChange}
                    >
                        {this.renderOptions()}
                    </Select>
                </div>
            </BasicComponent>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
})

export const select = connect(mapStateToProps, mapDispatchToProps)(selectbox)
export default select;
