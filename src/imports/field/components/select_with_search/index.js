import React, { Component } from 'react'
import { Select } from 'antd';
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { get, map } from 'lodash'
import BasicComponent from 'helpers/components/basic';
import applyFilters from 'helpers/functions/filters'
import classes from './style.less'
const Option = Select.Option;
class selectbox extends Component {
    state = {
        selectedItems: [],
      };
    // filteredOptions = []
    handleChange = (value) => {
        const { field } = this.props
        this.setState({ selectedItems:value });
        field.onChange({
            target: {
                name: field.name,
                value
            }
        });
    }
    createNew =()=>{
      const { setMain} = this.props
      const popup = {
        type: 'AddWithSelect', visable: true, width: "50%",
      }
      setMain('popup', { popup })
    }
    renderOptions = () => {
        const { colValue, show={key: 'GetDataSelector', show: 'name'}} = this.props
        const { options } = this.props
        var data = this.list
   options? data = options :  data = this.list

        return map(data, (d, index) => {
            return <Option
                key={d.id}
                value= {d.id}
                name={d.name}
                style={{ width: '100%' }}
            >
                {d.name}
            </Option>
        })
    }

    filteredOptions(val, option)
    {
        return get(option ,"props.name" ,'').toLowerCase().includes(val.toLowerCase())
    }
    getList(){
        this.list = applyFilters({
            path: get(this.props.app, 'name'),
            key: 'Filter',
            params: this.props.params
        })
    }
    render() {
        this.getList()
        const {field = {} } = this.props

        return (
            <BasicComponent compare={this.compares}>
                <div>
                    <Select
                        defaultValue={field.value ? field.value : ""}
                        mode="default"
                        placeholder="Please Select"
                        value={field.value}
                        onChange={this.handleChange}
                        autoClearSearchValue={true}
                        showSearch={true}
                        filterOption= {this.filteredOptions.bind(this)}
                    >
                        {this.renderOptions()}
                    </Select>
                    <button className={classes.button} type='button' onClick={this.createNew}>+</button>
                </div>
            </BasicComponent>
        )
    }
}

const mapStateToProps = (state, props) => ({
    data: get(state, `${get(props, 'app.name')}.data`)
})

export const select = connect(mapStateToProps, mapDispatchToProps)(selectbox)
export default select;
