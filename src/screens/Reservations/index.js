import React, { Component } from 'react'
import Header from './Header/index'
import List from './list/index'
import classes from './styles.less';
import {Route} from 'react-router-dom'
import  Calendar  from './calendar';
export default class Reservation extends Component {
    render() {
        const {match} = this.props;
        return (
            <div className={classes.contAll}>
                <Header />
                <Route exact path={`${match.url}`} component={List}/>
                <Route path={`${match.url}/calendar`} component={Calendar}/>
                
            </div>
        )
    }
}
