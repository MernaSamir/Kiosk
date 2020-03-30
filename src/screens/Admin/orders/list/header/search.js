import React, { Component } from 'react'
import classes from './style.less'
import mapDispathToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import Form from 'helpers/wrap/form.js';
import Render from 'helpers/functions/field_mapper/renderfields'

class Search extends Component {
    static onSubmit(props, values) {
        const {setMain} = props
        setMain('orders__main',{ filters:values.search})
    }
    search= () =>{
        const {setMain} = this.props
        const popup = {
            type: 'OrdersSearch', visable: true, width: "50%",
            
        }
        setMain('popup', { popup })
    }
    // eslint-disable-next-line class-methods-use-this
    render() {
        return (
            <div className={classes.search}>
             {
                Render([{
                type: "TextBox",
                name:'search',
                className:classes.inputField,
                placeholder:'search'
                }])
            } 
            </div>
        )
    }
}

export default connect(null, mapDispathToProps) (Form (Search) )