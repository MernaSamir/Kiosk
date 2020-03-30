import React, { Component } from 'react';
import Home from './home';
import Reports from './reports';
import {Route} from 'react-router-dom'
export default class ReportsMain extends Component {
    render() {
        const {match} = this.props
        return (
            <>
                <Route exact path={`${match.url}`} component={Home}></Route>
                <Route exact path={`${match.url}/:report`} component={Reports}></Route>
            </>
        );
    }
}
