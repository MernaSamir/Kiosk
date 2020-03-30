import React, { Component } from 'react'
import { map, get } from 'lodash'
import { connect } from 'react-redux'
import Render from 'helpers/functions/field_mapper/renderfields'
import * as ShowFields from 'helpers/functions/show_field/'
import mapDispatchToProps from 'helpers/actions/main'
import { Formik } from 'formik'
import classes from './style.less'
class MultiSelect extends Component {

    onSave = (values) => {
        
        const { field: { value, onChange, name } } = this.props
        onChange({ target: { name, value: [...(value || []), values] } })
    }
    removeItem = (index)=>{
        const {field: {value: fValue, onChange, name}} = this.props
        const val = fValue[index]
        let vals = fValue.filter((_,i)=>(i!=index))
        if(val.id){
            vals = fValue.slice()
            vals[index].remove = true
        }
        onChange({target: {name, value: vals}})
    }
    renderFields(row)
    {
        const {fields} = this.props;
        return  map(fields, (field, name)=>{
            const data = get(row,field.name|| field.show)
            return <p key={name}> {get(ShowFields, field.type, (d=>d))(data, row, field, this.props)}</p>
        })
    }
    renderValues(){
        const {field} = this.props
        return map(field.value, (data, index) => (
            <div className={`${classes.rowFields} ${data.remove ? 'remove':''}`} key={index}>{this.renderFields(data)}
                <button type="button" onClick={this.removeItem.bind(this, index)}>x</button>
            </div>
        ))
        
        
    }
    handelChange = (f, {handleChange}, ev) => {
        // const {field_name} = this.props
        const {field} = this.props;
        field.onChange(ev)
        handleChange({
            target: {
                name: f.name,
                value: ev.target.value
            }
        })
    }
    renderInputs = (fields, props)=>{
        return fields.map(d=>(Render([d])))
    }
    render() {

        const { fields } = this.props
        return (
            <>
            <Formik onSubmit={this.onSave}>
                {({ handleSubmit, handleChange, ...props }) => (
                    <div className={classes.row}>
                            {this.renderInputs(fields, { handleSubmit, handleChange, ...props })}
                            
                        <button onClick={handleSubmit}>+</button>

                    </div>
                )}
            </Formik>
            {this.renderValues()}
            </>
        )
    }
}
const mapStateToProps = (state, props) => (
    { list: get(state, `${get(props.app, "name", '')}.data`, {}) }
)
export default connect(mapStateToProps, mapDispatchToProps)(MultiSelect)
