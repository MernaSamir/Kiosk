import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import Render from 'helpers/functions/field_mapper/renderfields'
import moment from 'moment'
import { withTranslation } from 'react-i18next';
import classes from './style.less';
import { get } from 'lodash'
import applyFilters from 'helpers/functions/filters'



class Basic extends Component {
    constructor(props) {
        super(props);
        this.date = moment()
        this.pick_up = applyFilters({
            key:'Find',
            path:"settings__sub_mode",
            params:{
                key: "pickup",
                mode: props.mode
            }
        })
        this.delivery = applyFilters({
            key:'Find',
            path:"settings__sub_mode",
            params:{
                key: "delivery",
                mode: props.mode
            }
        })
    }
    
    controls = (mode) => ({

        row1: [
            {
                name: 'basic.customer_name', label: "Customer Name", type: 'TextBox', className: classes.eventTBOX,
                validates: { required: true, noSpecialChar: '', maxLength: '20' }
            },
            {
                name: 'basic.mobile', label: "Mobile Phone", type: 'NumberField',
                validates: { required: true, number: "", minLength: '11', maxLength: '11' }
            },
        ],
        row2: [   
            {
                name: 'basic.date', label: "Date", type: 'ButtonPopup', popupType: 'DataSelector',
                validates: { required: true, before_today: true }, className: classes.buttonpop, ftype: 'date',
                initValue: this.date
            },
            {
                name: 'basic.from_hour', label: "Hour", type: 'TimePicker', className: classes.timepick,
                validates: { required: true },
            },
            {
                name: "basic.duration", label: "Duration", type: 'NumberField', className: classes.duration,
                validates: { required: true, minLength: '1', number: "" }
            },
            {
                name: "basic.guest", label: "Guest", type: 'NumberField', className: classes.duration
            },
        ],
        row3: [
            {
                name: 'basic.order_type', label: "Order Type", type: 'SelectA',className: classes.eventTBOX,
                app:{
                    name : "settings__sub_mode"
                },
                reset:[{
                    path: 'basic.address',
                    val: this.pick_up.id
                },
                {
                    path: 'basic.pickup_location',
                    val: this.delivery.id
                },
                ],
                validates: { required: true },
                params:{
                    mode: mode
                }

            },
        ],
    })
    chooseType =()=>{
        const {values, Customer,mode} = this.props
        let row3 =  this.controls(mode).row3

        let type = ''
        if (Customer)
            type = 'SelectA'
        else
            type = 'TextBox'

        if(values.basic.order_type==this.pick_up.id)
        {
            row3.push(
                {
                    name: 'basic.pickup_location', 
                    label: "Branch", 
                    type: 'SelectA', 
                    
                    className: classes.eventTBOX,
                    app: {
                        name: 'licensing__location'
                    },
                    // params: {
                    //     customer: Customer
                    // },
                }
            )
        }
else if(values.basic.order_type==this.delivery.id){
    row3.push(
        {
            name: 'basic.address', label: "Address", type: type, className: classes.eventTBOX,
            app: {
                name: 'parties_address'
            },
            params: {
                customer: Customer
            },

        }
    )
}
        return <div className={classes.form}> {Render(row3)}</div>

    }
    renderFields = () => {
        const {  mode } = this.props
       

        return <>  <div className={classes.form}>
            {Render(this.controls(mode).row1)}
        </div >
            <div className={classes.form}>
                {Render(this.controls(mode).row2)}
            </div>
            {this.chooseType()}
        </>

    }
    render() {
        const { t } = this.props
        console.log(this.props)
        return (
            <div className={classes.basicDiv}>
                <div style={{ height: "80vh" }}>
                    <p className={classes.p}>{t("Catring Details")}</p>
                    {this.renderFields()}
                    
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    Customer: state.parties__customer.active,
    mode: state.settings__mode.active,
    // values: get(state,'form.event.values')



});
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Basic))