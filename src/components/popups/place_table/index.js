import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './style.less'
import {withTranslation} from 'react-i18next'

 class PlaceTable extends Component {
    render() {
        const { onCancel , t } = this.props
        return (
            <div className={classes.popup} >
                <div className={classes.divIcon}>
                    <FontAwesomeIcon icon='mouse-pointer' className={classes.icon} />
                </div>
                <p className={classes.first}>{t("Place Table")}</p>
                <p className={classes.second} >{t("Tab to set Table Location in the floorplan")}</p>
                <button onClick={onCancel.bind(this)}> {t("OK")}</button>
            </div>
        )
    }
}
export default withTranslation()(PlaceTable)