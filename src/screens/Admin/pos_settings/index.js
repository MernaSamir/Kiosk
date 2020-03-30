import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Station from './station';
import Mode from './mode';
import Setting from './setting';

export default class PosSettings extends Component {

    render() {
        const { match } = this.props
        return (
            <>
                <Route exact path={`${match.url}/`} component={Station} />
                <Route path={`${match.url}/modes`} component={Mode} />
                <Route path={`${match.url}/setting`} component={Setting} />
            </>
        )
    }
}
