import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import Form from 'helpers/wrap/form';
import Render from 'helpers/functions/field_mapper/renderfields'
import classes from './styles.less'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import { map } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import { withTranslation } from 'react-i18next';


const fields = {
    guests_num: {
        name: "val",
        type: "TextBox",
        label: "Guest ",
        validates: {
            required: true,
            // minNumber: 
        },
        className: classes.label
    },
    guests_num_pad: {
        type: "Calc",
        target: "val",
        num: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, 'D'],
        clear: ['C'],
        remove: ['D'],
        className: classes.Calc,

    }
}
class EnterNum extends Component {

    renderFields = () => {
        return Render(fields)
    }

    static onSubmit(props, values) {
        const {activeEvent } = props
   if(activeEvent.sub_type=='SM'){
         this.SmSaveOrder(props,values)
   }
   else{
       this.LcSaveOrder(props,values)
   }
        
    }
    static SmSaveOrder(props,values){
        const {setMain,activeEvent } = props
        setMain("parties__reservation", { item : {id:activeEvent.id,guest:values.val,  action:'update'} })
        const data = applyFilters({
            key: 'mapSelect',
            select: {
                serve: 'main.current.id',
                mode: 'settings__mode.active',
                shift: 'orders__shifts.active',
                station: 'licensing__station.active',
                event: activeEvent.id
            }
        })
        const order = {
            ...data,
            start_time: new Date(),
            guests_num: values.guest_num,
            event: activeEvent.id
        }
        setMain('orders__main',{ item: {...order, action:'add',onSuccess:this.saveDetails.bind(this, props,values, activeEvent) } })
    }
    static saveDetails(props,values, activeEvent,order){
        const ordermenu=  applyFilters({
            key: 'Filter',
            path: 'parties__tab_details',
            params: {
                reservation: activeEvent.id
            },
        })
        return [{
            type: 'set_main_orders__details',
            data: {
                item:{
                data: map(ordermenu , d=>({...d, order:order.id})),
                action:"bulkEdit",
                onSuccess: this.goHome.bind(this, props, values)
              }
            }
        }] 
    }
    static LcSaveOrder(props,values){
        const {setMain,activeEvent } = props
        setMain("parties__reservation", { item : {id:activeEvent.id,paid:values.val,  action:'update',
        onSuccess:this.goHome.bind(this, props,values, activeEvent) } })
    }
   static goHome(props){
        const {history, onCancel} = props
        history.push("/home")
        onCancel();
        return []   
    }
    render() {
        const {Title="Guests" , t }= this.props
        return (
            <div>
                <div >
                    <p className={classes.title}>{Title}</p>
                </div>
                {this.renderFields()}
                <div className={classes.last}>
                    <button type="button" onClick={this.props.onCancel}>{t("cancel")}</button>
                    <button type="submit" >{t("ok")}</button>
                </div>
            </div>
        )
    }
}

export default withRouter(connect(null, mapDispatchToProps)(withTranslation()(Form(EnterNum))))
