import React, { Component } from 'react'
import { map, get } from 'lodash'
import { connect } from 'react-redux'
import Render from 'helpers/functions/field_mapper/renderfields'
import * as ShowFields from 'helpers/functions/show_field/'
import mapDispatchToProps from 'helpers/actions/main'
import { Formik } from 'formik'
// import classes from './style.less'
import Row from './table'
import uuid from 'uuid/v4';

class TableAddPlus extends Component {
    state={
        row: {}
    }
    onSave = (values, formProps) => 
    {
        const newVal= {id:uuid(), ...values}
        const { field: { value, onChange, name } } = this.props
        onChange({ target: { name, value: {...(value || {}),[newVal.id]: newVal} } })
        formProps.resetForm({currency:"", amount:"", depositer:"", date:""});

        
    }
    handleChange = (row)=>{
        this.setState({row})
    }
    renderFields(row,index)
    {
        const {fields, field} = this.props
                return <Row field={field} row={row} fields= {fields} index={index}change={this.handleChange}/>
    }
    renderValues(){
        const {field } = this.props
        return map(field.value, (data, index) => (
            <div className={`${data.remove ? 'remove':''}`} key={index}>
            {this.renderFields(data, index)}
            </div>
        ))
        
        
    }
    handelChange = (f, {handleChange}, ev) => {
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
            //  { onClick: this.props.onClick.bind(this, {...this.props, name: `create.${d.name}`}, this.handelChange.bind(this, d, props))})))
    }
    render() {

        const { fields ,btn} = this.props
        const { row } = this.state
        return (
            <>
            <Formik onSubmit={this.onSave} initialValues={row} enableReinitialize={true}>
                {({ handleSubmit, handleChange, ...props }) => (
                    <div>
                        {this.renderInputs(fields, { handleSubmit, handleChange, ...props })}
                        <button onClick={handleSubmit} className={btn.style}>{btn.name}</button>

                    </div>
                )}
            </Formik>
            {this.renderValues()}
            </>
        )
    }
}
export default connect(null, mapDispatchToProps)(TableAddPlus)
