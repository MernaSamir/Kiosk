import React, { Component } from 'react'
import {Modal, Button} from 'antd'
import { Formik } from "formik";
import {map, pick, get} from 'lodash'
import FormControls from 'form_control'
import style from './style.less'
import { connect } from "react-redux";
import mapDispatchToProps from 'helpers/actions/main'
import {multiRequest} from 'helpers'
import { ConnectAllApps } from 'helpers/functions/index';
import uuid from 'uuid/v4';
import applyFilter from 'helpers/functions/filters';

class dialogComp extends Component {

    constructor(props){
        super(props)
        ConnectAllApps(props)
    }

    renderForm = () => {
        const {modal_fields=[]} = this.props
         return map(modal_fields, (d, index) => {
             return (
                 <section key={index} className="collapse_table_td">
                     {this.renderFormField(d)}
                 </section>
             )
         })

    };

    renderFormField(field){
        const {reduxName} = this.props
        return <FormControls
            {...field}
            layout={reduxName}
        />
    }


    onSuccess(formVals) {
        const {child={}, UpdateBulkApp} = this.props
        const onSuccess = this.finalAction.bind(this)
        UpdateBulkApp(formVals, onSuccess, undefined, child.reduxName)
    }

    finalAction(){
        const {submitFullForm, closeDialog} = this.props
        submitFullForm();
        multiRequest({
            stock__balance: {filter: {store: this.from_store}}
        })
        closeDialog()
    }
    submitData(values) {
        const {insert,use_store,fixed={}, formvalues, UpdateBulkApp, reduxName, child={}} = this.props
        let items = []

        const vals = map(values, v => {
            const id = uuid();
            const pr = use_store ? null : v.id ;
            this.from_store = use_store ? applyFilter({...use_store}) : v.from_store;
            items = map(get(formvalues, v.id), v=>(v.allocated && v.item_variant ? {
                to_transfer : v.allocated,
                transaction: id,
                item_variant: v.item_variant
            } : null)).filter(l=>l)
            return {
                ...pick(v, insert),
                from_store: this.from_store,
                id,
                pr,
                // items,
                ...fixed
            }
            
        })
       
        const onSuccess = this.submitDetailsData.bind(this, items)
        UpdateBulkApp(vals, onSuccess, undefined, reduxName);
    }

    submitDetailsData(values){
        const {UpdateBulkApp, child={}} = this.props
        let reduxName = get(child, 'reduxName')
        const onSuccess = this.finalAction.bind(this)
        UpdateBulkApp(values, onSuccess, undefined, reduxName);
    }


    render() {
        const {closeDialog, visible, title="",maskClosable=false, initialValues} = this.props
        const Form = this.renderForm()
        
        return (
            <Modal
                title={title}
                visible={visible}
                footer={null}
                onCancel={() => closeDialog()}
                maskClosable={maskClosable}
            >
                <Formik onSubmit={this.submitData.bind(this)} initialValues={initialValues} enableReinitialize={true} >
                    {({handleSubmit}) => <div> 
                            {Form} 
                            <div className={style.footer}>
                                <Button onClick={() => closeDialog()} > Cancel </Button> 
                                <Button type='primary' onClick={handleSubmit} > OK </Button>
                            </div>
                        </div>
                    }                    
                </Formik>
          </Modal>
        )
    }
}


export const Dialog = connect(null, mapDispatchToProps)(dialogComp)
export default Dialog;