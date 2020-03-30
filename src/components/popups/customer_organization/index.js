import React, { Component } from 'react'
import classes from './style.less'
import { map } from 'lodash'
import { withRouter } from 'react-router-dom'
import customer from 'assets/images/timer.png'
import organization from 'assets/images/enterprise.png'
import mapDispatchToProps from 'helpers/actions/main'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next';



class Choise extends Component {

    constructor(props) {
        super(props)
        this.buttons = {
            Customer: {
                img: customer,
                title: 'Person',
                val: 'per',
                url: '/new/pr',
            },
            Organization: {
                img: organization,
                title: 'Organisation',
                val: 'org',
                url: '/new/org',
            },
        }
    }

        goTo = (d) => {
            const { history , onCancel} = this.props;
            history.push(d.url)
            onCancel()

        }

        renderOptions = () => {
            const { t} = this.props;
            return map(this.buttons, (d, key) => (
                <button key={key} className={classes.options_btn} onClick={this.goTo.bind(this, d)}>
                    <img src={d.img} />
                    <p>{t(d.title)}</p>
                </button>
            ))
        }


        render() {
            const { t} = this.props;

            return (
                <>
                <p className={classes.p}>{t("Type of Customer")}</p>
                <div className={classes.options_div}>
                    {this.renderOptions()}
                </div>
                </>
            )
        }
    }

export default withTranslation()( connect(null, mapDispatchToProps)(withRouter(Choise)))
