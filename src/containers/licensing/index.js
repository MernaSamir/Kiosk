import React, { Component } from 'react'
import Image from "assets/images/logo.png"
import classes from './style.less'
import Render from 'helpers/functions/field_mapper/renderfields'
import Form from 'helpers/wrap/form.js';
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
const controls = [
    {
        name: 'serial_num', label: "Serial Number: ", type: 'TextBox',
        validates: { required: true }, className: classes.input
    },
]
class Licensing extends Component {
    state = {
        error_msg: ''

    }
    static onSubmit(props, values) {
        console.log('iaaam here in submit ')
        const {setMain, setAll} = props
        axios.post(`http://192.168.100.56:8000/api/v1/Licensing/Business_owner/search`, {serial:values.serial_num})
            .then(({ data }) => {
                console.log('dataaaaa', data)
                // setMain('licensing__chain', {owner:data[0].id})
                setAll([
                    {type: 'set_main', app: 'licensing__chain', data: {owner:data[0].id }},
                    {type: 'set_main', app: 'main', data: {serial:values.serial_num}},
                    
                ])
                props.history.push('/setup')
        
        }).catch((err) => {

        })
          
    }

    render() {
        const { error_msg } = this.state;
        return (
            <div className={classes.login_container}>
                <div className={classes.empty_login}></div>
                <div className={classes.empty_login}></div>
                <div className={classes.logo}>
                    <img className={classes.logo_img} src={Image} />
                </div>
                <div className={classes.empty_login}></div>

                <div className={classes.form}>
                    <div className={classes.input_tag}>
                        <div className={classes.inputs}>
                            {Render(controls, { onClick: this.selectInput })}
                        </div>

                    </div>
                   <div className={classes.btn}>
                   <button  type='submit'> Ok</button>
                   </div>
                </div>
                <h4 className={classes.error_msg}>{error_msg}</h4>
                <br></br>

            </div>
        )
    }
}

export default  connect(null, mapDispatchToProps)(withRouter (Form( Licensing ) ) )
