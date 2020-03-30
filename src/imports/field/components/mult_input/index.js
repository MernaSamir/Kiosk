import React, { Component } from 'react'
import Form from "helpers/wrap/form.js"
import Render from "helpers/functions/field_mapper/renderfields"
import { get } from 'lodash';
import classes from './styles.less'
class MultiInputs extends Component {

    handelChange = (ev) => {
        const {field_name, handleChange} = this.props
        handleChange({ target: { name: field_name, value: ev.target.value } })
    }

    static onSubmit(props, values, formProps) {
        const { field: { value: fValue, onChange, name }, extra } = props
        onChange({ target: { name, value: [...(fValue || []), {...values, ...extra}] } })
        formProps.resetForm({  });
    }

    removeItem = (index) => {
        const { field: { value: fValue, onChange, name } } = this.props
        const val = fValue[index]
        let vals = fValue.filter((_,i)=>(i!=index))
        if(val.id){
            vals = fValue.slice()
            vals[index].remove = true
        }
        onChange({target: {name, value: vals}})
    }

    renderField() {
        const { text_validates, field, field_name, onClick = () => { } ,numPad=true} = this.props;
        // debugger
        return Render([{
            type: 'TextBox',
            name: field_name,
            validates: text_validates,
            numPad: numPad
        }], 
    { onClick: onClick.bind(this, {...this.props, name: field_name + field.name}, this.handelChange.bind(this)) })
    }

    render() {
        const { field, field_name , width } = this.props;
        return (
            <>
                <div style={{width:width}}>
                    {this.renderField()}
                    <button onClick={this.props.handleSubmit} className={classes.onSubmitBtn}>+</button>
                </div>
                <div>
                    <div className={classes.secDiv}>
                    {(field.value || []).map((d, k) => (
                        <div key={k} className={d.remove ? 'remove':''} >
                            <p>{get(d, field_name)}</p>
                            <button onClick={this.removeItem.bind(this, k)} type="button">x</button>
                        </div>
                    ))}
                    </div>
                </div>
            </>
        )
    }
}

export default Form(MultiInputs)