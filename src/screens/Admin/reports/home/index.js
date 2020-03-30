import React, { Component } from 'react'
import classes from './style.less'
import Header from './header';
import Body from './body';
import { withTranslation } from 'react-i18next'

 class Reprot extends Component {

    render() {
        const {t} = this.props
        return (
            <div className={classes.station_container}>
                <Header t={t}/>
                <Body t={t}/>
            </div>
        )
    }
}
export default withTranslation()(Reprot)