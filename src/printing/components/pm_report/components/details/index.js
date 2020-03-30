import React, { Component } from 'react'
import Items from './items'

export default class Details extends Component {
    render() {
        const {data} = this.props
        return (
            <>
                <Items data={data}/>
            </>
        )
    }
}
