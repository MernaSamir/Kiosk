import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import classes from './style.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form.js';
import {connect} from 'react-redux'
import { get, pick } from 'lodash';
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from 'helpers/actions/main'
import uuid from 'uuid/v4';
import {gun_licensing} from 'helpers/gun'
import {withRouter} from 'react-router-dom'
import axios from 'axios'

class SetUp extends Component {
    state = {
        error_msg: ''

    }
    getControls = ()=>{
        const {owner, values} = this.props
        const locations = applyFilters({
            key:'Filter',
            path:'licensing__location',
            params:{
                chain:  get(values, 'chain','')
            }
        })
        const types = [{id:'pac', name:'Packing'}, {id:'d_dis', name:'Dilvery Dispatcher'}, {id:'kit', name:'Kitchen'},
        {id:'pos', name:'POS'}, {id:'stock', name:'Stock'}, {id:'sma_w', name:'Smart Waiter'}, {id:'kwh', name:'KWH'}]
        const controls =[
            {
                name: 'chain', label: "Chain", type: 'SelectA', className: classes.select,
                app: {
                  name: 'licensing__chain',
                },
                params:{owner: owner}
              },
            {
                name: 'location', label: "Location", type: 'SelectA', className: classes.select,
                options: locations
                
              },
             
              {
                name: 'name', label: "Name: ", type: 'TextBox',
                validates: { required: true },
               
            },
            {
                name: 'location_type', label: "Type: ", type: 'SelectA', className: classes.select,
                validates: { required: true }, 
                options: types
            },
            // {
            //     name: 'serial_num', label: "Serial Number: ", type: 'TextBox',
                
            // },
            // {
            //     name: 'device_id', label: "Device Id: ", type: 'TextBox',
                
            // },
          
        ]
    return controls
    }
    
   
   

    static onSubmit(props, values) {
        const {setMain, serial} = props
        const obj = {...pick(values, ['chain','location','location_type']), device_id:uuid(), serial}
        axios.post(`http://192.168.100.56:8000/api/v1/Licensing/Business_owner/check_setup`, {...obj})
        .then(({ data }) => {
    
    }).catch((err) => {

    })
        
        // setMain('licensing__station',{item:{...pick(values, ['name', '_type']), mac_address:uuid(),
        //  action:"add",onSuccess:this.activeLicense.bind(this,props) } })
        
    }
    static activeLicense (props, station) {
        const {history, setMain} = props
        const liecense = {mac_address:station.mac_address, active:true}
        gun_licensing.get(station.mac_address).put(liecense)
        localStorage.setItem('deviceId', liecense.mac_address);
        setMain('licensing__station', {active: station.id})
        history.push('/')
        
    }

    render() {
        const { error_msg } = this.state;
        return (
            <div className={classes.login_container}>
                <div className={classes.logo}>
                    <img className={classes.logo_img} src={Image} />
                </div>

                <div className={classes.form}>
                    <div className={classes.input_tag}>
                        <div className={classes.inputs}>
                            {Render(this.getControls())}
                        </div>
                        

                    </div>
                    <div className={classes.btn}>
                        <button type='submit'>ok</button>
                    </div>
                </div>
                <h4 className={classes.error_msg}>{error_msg}</h4>
                <br></br>

            </div>
        )
    }
}
const mapStateToProps = state =>({
    owner : get(state.licensing__chain, 'owner', ''),
    serial : get(state.main, 'serial', '')
})
export default connect(mapStateToProps, mapDispatchToProps) ( withRouter(Form(SetUp)))
