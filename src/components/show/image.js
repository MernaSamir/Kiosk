import React, { Component } from 'react'
import {SERVER_URL} from 'config'
export default class image extends Component {
    render() {
        const {src, ...props} = this.props
        return (
            <img {...props} src={`${SERVER_URL}${src}`}/>
        )
    }
}
