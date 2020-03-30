import React, { Component } from 'react'
import classes from './style.less'
import { connect } from 'react-redux'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'
import mapDispatchToProps from 'helpers/actions/main'
import {withTranslation} from 'react-i18next'


class AddTable extends Component {
    static onSubmit(props, values) {
        const {setMain} = props
        setMain("dinin__tables",{item:{...values,size:!values.size?2:values.size}})
        this.openPopup(props)

    }
    static openPopup = (props) =>{
        const {setMain} = props
        setMain('popup',{popup:{type:'PlaceTable', visable:true,width:'40vw', border:'1.5px solid #13488b'}})
    }



    renderName = () => {
        return Render([{
            type: "TextBox",
            name: 'name',
            label: 'Name',
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
    renderShapes =()=>{
        return Render([{
            type: "SelectShape",
            name: 'shape',
            className:''

        }])
    }
    renderSlider =()=>{
        return Render([{
            label: 'Size',
            type: "Slider",
            name: 'size',
            className: classes.sliderlabel,

        }])
    }
    onCancel = () =>{
        const {resetForm} = this.props
        resetForm({name: '', capacity: ''});

        this.setState({TypingField:""})

    }
    goBack = () =>{
        this.setState({TypingField:""})
    }
    renderBody = () =>{
        const { onCancel , t } = this.props
      
            return <><div className={classes.slider}>
            {this.renderSlider()}
            </div>
            {this.renderShapes()}
            <div className={classes.saveBtns}>
                    <button onClick={onCancel.bind(this)}>{t("Cancel")}</button>
                    <button type='submit'>{t("Ok")}</button>
         </div></>
        


    }
 
    render() {
        const {t} = this.props
        return (
            <div className={classes.tablePopupDiv} >
                <div className={classes.popupTitle}>
                    <span >{t("Add New Table")}</span>
                </div>
                <div className={classes.inputs}>
                    {this.renderName()}
                    {this.renderCapacity()}
                </div>
               {this.renderBody()}
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(withTranslation()(Form(AddTable)))
