import React from 'react';
import ReactDom from 'react-dom';
import { Route } from 'react-router-dom';

import Ordering from './../screens/ordering'



export default (props) => (
    <div>
        <Route exact path={`${props.match.url}/`} component={Ordering} />
    </div>
);

