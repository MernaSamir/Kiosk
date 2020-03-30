import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import { isEmpty, get } from 'lodash'

class AddTable extends Component {
    static onSubmit(props, values) {
        const { setAll, table } = props
        let dis = [
            {type: 'set_main_dinin__tables', data: { item: {...table, ...values, size: !values.size ? 2 : values.size } }}
        ]
        if(table.zone != values.zone){
            dis.push({type: 'set_main_dinin__zones', data: {active: values.zone}})
        }
        if(table.zone != values.zone || table.shape != values.shape || table.size < values.size){
            dis.push({type: 'set_main_popup', data: {popup:{type:'PlaceTable', visable:true,width:'40vw', border:'1.5px solid #13488b'}}})
        }
        else{
            dis.push({type: 'set_main_dinin__tables', data: { item: {...table, ...values ,action:'update'} }})
            props.onCancel()
        }
        setAll(dis)
    }

    state = {
        TypingField: '',
    }

    selectField = (field) => {
        this.setState({ TypingField: field.name })
    }
    renderName = () => {
        return Render([{
            type: "TextBox",
            name: 'name',
            label: 'Table Name',
            validates: { required: true },
            className: classes.inputField,
            onClick: this.selectField
        }])
    }
    renderCapacity = () => {
        return Render([{
            type: "TextBox",
            name: 'capacity',
            label: 'Capacity',
            validates: { required: true, number: true },
            className: classes.inputField,
            onClick: this.selectField
        }])
    }

  
    renderShapes = () => {
        return Render([{
            type: "SelectShape",
            name: 'shape',
            className: ''

        }])
    }
    renderSlider = () => {
        return Render([{
            label: 'Size',
            type: "Slider",
            name: 'size',
            className: classes.sliderlabel,

        }])
    }
    renderselect = () => {
        return Render([{

            type: "SelectBox",
            name: 'zone',
            label: 'Change Zone',
            className: classes.select,
            app: {
                name: "dinin__zones",
                api: 'dinin/zones/'
            }

        }])
    }
    onCancel = () => {
        const { resetForm, values } = this.props
        resetForm({ ...values, name: '', capacity: '' });
        this.setState({ TypingField: "" })
    }
    goBack = () => {
        this.setState({ TypingField: "" })
    }
    renderBody = () => {
        const { onCancel } = this.props
      
            return <><div className={classes.zone}>
                        {this.renderselect()}
                    </div>
                <div className={classes.slider}>
                    {this.renderSlider()}
                </div>
                {this.renderShapes()}
                <div className={classes.saveBtns}>
                    <button onClick={onCancel.bind(this)}>Cancel</button>
                    <button type='submit'>Ok</button>
                </div></>
        


    }
    

    render() {
        return (
            <div className={classes.tablePopupDiv} >
                <div className={classes.popupTitle}>
                    <span >Edit Table</span>
                </div>
                <div className={classes.inputs}>
                    {this.renderName()}
                </div>

                {this.renderBody()}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    table: get(state.dinin__tables.data, state.dinin__tables.active, {}),
    zones: get(state.dinin__zones, 'data', {}),
    activeZone: get(state.dinin__zones, 'active', ''),
    get initialValues() { 
        return { 
            name: this.table.name,
            capacity: this.table.capacity,
            zone: this.table.zone,
            size:this.table.size,
            shape:this.table.shape
        }
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(Form(AddTable))
