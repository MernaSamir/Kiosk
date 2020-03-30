import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import classes from './style.less'
import { get, map } from 'lodash';
import analytics from 'assets/images/Admin/analytics@2x.png'
import {NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import applyFilters from 'helpers/functions/filters'
class Body extends Component {
    links = [{
        name: 'X Report',
        url: '/admin/report/x_report',
        img: analytics,
        permission: {
            fun: {
                path: 'orders__business_days.active'
            }
        }
    }, {
        name: 'Z Report',
        url: '/admin/report/z_report',
        img: analytics
    }, {
        name: 'Product Mix',
        url: '/admin/report/pm_report',
        img: analytics
    }, {
        name: 'Daily Revenue',
        url: '/admin/report/revenu_day',
        img: analytics
    }, {
        name: 'Hourly Revenue',
        url: '/admin/report/revenu_hour',
        img: analytics
    }]
    renderReports = () => {
        const {t, filters} =  this.props
        const list = filters?applyFilters({
            key:'Search',
            data:this.links,
            unify:'title',
            params:{
              name:filters,
            }
           
        }):this.links
        return map(list, (d, index) => (
            <NavLink to={d.url} key={index} className={classes.nav}>
                <button type="button" className={classes.report_btn}>
                    <img src={d.img} />
                    {t(d.name)}
                </button>
            </NavLink>
        ))
    }

    render() {
        return (
            <div className={classes.body_container}>
                {/* <p>{t('Choose Report')}</p> */}
                <div className={classes.reports_div}>

                    {this.renderReports()}
                </div>
            </div>
        )
    }
}

const mapStateToProps=state=>({
    filters: get(state.main,'search',undefined)

})
export default connect(mapStateToProps)(withRouter(Body));