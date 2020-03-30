import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import SelectChain from './select_chain';
import ChainList from './chain_list';

export default class CallCenter extends Component {
    render() {
        const { match } = this.props

        return (
            <>
                <Route exact path={`${match.url}/`} component={SelectChain} />
                <Route exact path={`${match.url}/:chain`} component={ChainList} />
            </>
        )
    }
}
