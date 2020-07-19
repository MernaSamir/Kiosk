import React, { Component } from 'react'
import From from './form'
import uuid from 'uuid/v4'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import {get} from 'lodash'
class NormalItemForm extends Component {
    shouldComponentUpdate = (nextProps, nextState) => {
        return false
    }
    getInitials=()=>{
        const {active} = this.props
        if(active){
            return active
        }
        else {
            return {quantity: 1,id:uuid()}
        }
    }

    render() {
        const values = this.getInitials()
        return (
            <From initValues={values}></From>
        )
    }
}

const mapStateToProps = (state, props) => ({
    formValues: get(state.form_actions, 'details', {}),
    active: get(state.form_actions.details, state.form_actions.active),
})

export default connect(mapStateToProps)(NormalItemForm)