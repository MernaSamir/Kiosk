import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from '../styles.less'
import {isEqual} from 'lodash';
import { withRouter } from 'react-router-dom'

 class View extends Component {
    onClick = (button) => {
        const{history}=this.props
        if(button=='l')
        history.push('/reservations')
        else
        history.push('/reservations/calendar')


      }
    render() {
        const {location} = this.props;

        return (
            <>
                <button className={`${classes.calendar} ${isEqual(location.pathname, '/reservations/calendar') && classes.active}`}
                onClick={this.onClick.bind(this,"c")}>
                    <FontAwesomeIcon icon='calendar-alt' size='md' />
                    
                </button>
                <button className={`${classes.list} ${isEqual(location.pathname, '/reservations') && classes.active}`}
                
                onClick={this.onClick.bind(this,"l")}>
                    <FontAwesomeIcon icon='bars' size='md' />
                </button>

            </>
        )
    }
}
export default withRouter(View);
