import React, { Component } from 'react';
import * as ReportsComponent from './main';
import {get} from 'lodash';

 class Report extends Component {
    render() {
        const {match } = this.props
        const MainComponent = get(ReportsComponent, match.params.report)
        return (
            <MainComponent />
        );
    }
}
export default (Report)