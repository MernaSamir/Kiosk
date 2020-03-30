import React, { Component } from 'react'
import classes from '../style.less'
import Render from 'helpers/functions/field_mapper/renderfields'
const controls = [

    {
        name: 'mobilphones', label: "Mobile Phone", type: 'MultiText',
        extra: {_type: 'mp'},
        field_name: 'contact',
        text_validates: { number: "" , minLength: '11', maxLength: '11', }
    },
    {
        name: 'homephones', label: "Home Phone", type: 'MultiText',
        field_name: 'contact',
        extra: {_type: 'hp'},
        text_validates: { minLength: '10', maxLength: '11', number: "" }
    },
    {
        name: 'workphones', label: "Work Phone", type: 'MultiText',
        extra: {_type: 'wp'},
        field_name: 'contact',
        text_validates: { maxLength: '11', number: "" }
    },
    { name: "emails", label: "Email", type: 'MultiText',
        extra: {_type: 'em'},
        field_name: 'contact',
        text_validates:{maxLength:'30',email:'true'},
        numPad: false
 },
]
 class contactInfoContent extends Component {

    render() {
        return (
            <div className={classes.fields}>
            {/* <p className={classes.p}>Contacts</p> */}

            <div className={classes.form}>
                {Render(controls,{className:classes.contacts, onClick: this.props.selectInput})}

            </div >
            </div>
        )
    }
}
export default contactInfoContent
