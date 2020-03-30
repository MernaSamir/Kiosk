import React, { Component } from 'react'
import classes from './styles.less';
import { withRouter } from 'react-router-dom'
import ViewAction from './components/view_actions'
import DatePicker from 'components/date_selector'
import Header from 'components/header_back'
import Search from 'components/search'
import Paging from 'helpers/components/paging'
import { withTranslation } from 'react-i18next';

class EventHeader extends Component {

    onClick = () => {
        const { history } = this.props
        history.push('/new_event')
    }

    actions = (t) => (
        
        <>
            <div className={classes.second}>
                <div className={classes.left}> <ViewAction /></div>
                <div className={classes.between}><DatePicker reduxName="parties__reservation" /> </div>
                <div className={classes.right}>
                    <button className={classes.reserBtns} onClick={this.onClick}
                    >{t("New Event")}</button>
                </div>
            </div>
        </>
    )

    search = () => {
        const {maxlength , page , handelPagination } = this.props 
        return <>
        <div className={classes.third}>
            <div className={classes.search}> <Search iconClass={classes.icon} /></div>
            <Paging maxLength={maxlength}
              page={page}
              handelClick={handelPagination}
            />
            </div>

        </>
    }
    
    render() {
                const { t } = this.props

        return (
            <div>
                <Header name="Event Reservation" />
                {this.actions(t)}
            {this.search()}


            </div>
        )
    }
}
export default withRouter (withTranslation()(EventHeader))