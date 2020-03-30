import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classes from './style.less'
import { withTranslation } from 'react-i18next';


 class Save extends Component {
    render() {
        const {msg , msg2 ='The changes have been successfuly saved' , icon='check', only, t} = this.props
        return (
            <div className={classes.all}>
                <FontAwesomeIcon icon={icon} size="6x"  className={classes.icon}></FontAwesomeIcon>
                <div  className={classes.msg}>
                    <p className={classes.first}>{t(msg)}</p>
                    {!only&&<p className={classes.second}>{t(msg2)}</p>}
                </div>
            </div>
        )
    }
}
export default withTranslation()(Save)