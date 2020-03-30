import React, { Component } from 'react'
import classes from './style.less'
import { map } from 'lodash'
import { withRouter } from 'react-router-dom'
import applyFilters from 'helpers/functions/filters'
import group from 'assets/images/Admin/Group 957@2x.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withTranslation } from 'react-i18next'
import Header from 'components/header_back'

class Floorplan extends Component {

    constructor(props) {
        super(props)
        this.buttons = {
            Floorplan: {
                img: group,
                title: 'Seating Chart',
                url: '/tables-planner',
                authorize: ['admin_floor_plan'],
            },
            FloorsZones: {
                img: group,
                title: 'Floors & Zones',
                url: '/app/floors-zones',
            },
           

        };
    }



    goTo = (d) => {
        const { history } = this.props;
        history.push(d.url)
    }

    renderOptions = () => {
        const { t } = this.props


        return map(this.buttons, (d, key) => (
            <button key={key} disabled={!applyFilters({ key: 'authorize', compare: d.authorize })} className={classes.options_btn} onClick={this.goTo.bind(this, d)}>
                {d.img ? <img src={d.img} /> :
                    <FontAwesomeIcon icon={d.icon} size="4x" className={classes.icon}
                        style={{ color: "#0b2a5d" }}></FontAwesomeIcon>}
                <p>{t(d.title)}</p>
            </button>
        ))

    }

    render() {
        const{t} = this.props
        return (
            <div className={classes.container}>
                <div className={classes.inner}>
                 <div className={classes.title}>
                <Header name={t("Floorplan")} />
              
                </div>
                <div className={classes.options_div}>
                    {this.renderOptions()}
                </div>
                </div>
            </div>
        )
    }
}

export default withTranslation() (withRouter(Floorplan))
