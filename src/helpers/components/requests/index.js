import React, { Component } from 'react'
import { API_URL } from 'config'
import axios from 'axios'
import { head, drop, isEmpty, isEqual, difference, omit, keys,get } from 'lodash'
import {connect} from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'

class reqComp extends Component {

    constructor(props){
        super(props)
        this.requests_keys = keys(props.requests) || []
        this.requests = props.requests || {}
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(!isEqual(nextProps.requests, this.props.requests)){
            // let restart = isEmpty(this.requests_keys)
            let new_req = difference(keys(nextProps.requests), keys(this.props.requests))
            this.requests_keys = [...this.requests_keys, ...new_req]
            this.requests = {...this.requests, ...nextProps.requests}
            this.sendRequest()
        }
        return false
    }

    sendRequest = () => {
        try {

            let {requests, requests_keys} = this
            if(!isEmpty(requests_keys)) {
                let key = head(requests_keys)
                const request = get(requests,key)
                request && request()
                this.requests_keys = drop(requests_keys)
                this.requests = omit(requests,key)
            }
        }
        catch (error) {
            console.log("EROR",error)
        }
    }


    render() {
        this.sendRequest()
        return (
            <div>

            </div>
        )
    }
}

const mapStateToProps = (state)=>({
    requests: state.req_line.data || {}
})
export default connect(mapStateToProps, mapDispatchToProps)(reqComp)

