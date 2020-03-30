import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from '../styles.less'
import {isEqual} from 'lodash';
import { withRouter } from 'react-router-dom'

 class View extends Component {
    onClick = () => {
        const{history}=this.props
        history.push('/event_list')
      }
    render() {
        const {location} = this.props;

        return (
            <>
                <button className={classes.calendar}>
                    <FontAwesomeIcon icon='calendar-alt' size='md' />
                </button>
                <button className={`${classes.list} ${isEqual(location.pathname, '/event_list') && classes.active}`}
                onClick={this.onClick}>
                    <FontAwesomeIcon icon='bars' size='md' />
                </button>

            </>
        )
    }
}
export default withRouter(View);
