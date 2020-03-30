import React, { Component } from 'react'
import classes from "./styles.less"
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import mapDispatchToProps from 'helpers/actions/main'
import { map, isEqual, pick, keys } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from "moment"
import { withTranslation } from 'react-i18next';
import Header from './header'
import { multiRequest } from 'helpers';

class TodayEvents extends Component {
   
    componentDidMount() {
                multiRequest({
                parties__event_checkin:{},
                 parties__tab_details:{},
                 parties__event_tab:{},

                })
    }
    shouldComponentUpdate(nextProps, nextState) {
        const compare = ['events', 'page'];
        return !isEqual(pick(this.props, compare), pick(nextProps, compare) )|| !isEqual( pick(this.state, compare), pick(nextState, compare) )
    }
    state = {
        color: '',
        page:1
    }

    setActive = (d, index) => {
        this.setState({
            active: index
        })

    }

    openCheckIn = (d) => {
        const { history, setMain } = this.props
        setMain("parties__reservation", { active: d.id })

        const Eventvalidations = applyFilters({
            key: 'Filter',
            path: "parties__event_tab",
            params: {
                resevation: d.id
            }
        })
        if ((d.lacarte_type == 'one' && Eventvalidations.check_invitations) || (d.lacarte_type == 'multi')) {

            const { setMain } = this.props
            setMain("parties__reservation", { active: d.id })

            const popup = {
                type: 'CheckIn', visable: true, width: "100%",
                childProps: {
                    activeEvent: d
                }
            }

            setMain('popup', { popup })
        }
        else {
            history.push('./event_tabs')
        }
    }
    openCheckOut = (d) => {
        const { history, setMain } = this.props
        const existOrder = applyFilters({
            key: 'Find',
            path: "orders__main",
            params: {
                event: d.id
            }
        })
        if (existOrder) {

            setMain("orders__main", { active: existOrder.id })
            history.push('/home')
        }
        else {
            const { setMain } = this.props
            const popup = {
                type: 'EnterNum', visable: true, width: "50%",
                childProps: {
                    activeEvent: d
                }
            }

            setMain('popup', { popup })
        }
    }
    changeStyle(d) {
        return [{
            type: 'set_path_parties__reservation',
            path: `data.${d.id}.start_time`,
            data: new Date()
        }]

    }

    renderEvents = (d, index) => {
        return <div className={classes.eventDiv} style={{ backgroundColor: d.status == 'opened' ? '#f0f5fc' : "#ffffff" }} >
            <p className={classes.hour}>{d.hour}</p>
            <p className={classes.name}>{d.event_name} </p>
            {this.buttonDiv(index, d)}
        </div>
    }
    pressStart = (index, d) => {
        const { setMain } = this.props

        setMain("parties__reservation", { active: d.id })
        setMain("parties__reservation", {
            item: {
                id: d.id, start_time: new Date(), status: 'opened', action: 'update', onSuccess: this.changeStyle.bind(this, d)

            }
        })
    }
    buttonDiv(index, d) {
        const { t } = this.props
        if (d.start_time) {
            return <div className={classes.actionsDiv} >
                <button disabled={d.sub_type == 'SM'} onClick={this.openCheckIn.bind(this, d)}
                    className={classes.actions}><FontAwesomeIcon icon={['fas', 'user-plus']} /></button>
                <button className={classes.actions} onClick={this.openCheckOut.bind(this, d)}>
                    <FontAwesomeIcon icon={['fas', 'calendar-check']} /> </button>
            </div>
        }
        else {
            return <button className={classes.startBtn}
                onClick={this.pressStart.bind(this, index, d)}>{t("Start Event")}</button>
        }

    }
    handelPageClick = (op) => {
        console.log('iaam here')
        const { page } = this.state
        const Events = applyFilters({
            key: 'Filter',
            path: "parties__reservation",
            params: {
                _type: 'ev',
            }
        })
        let pageMax = Math.ceil((keys(Events) || []).length / 15)
        if (!(page <= 1 && op == -1) && !(page >= pageMax && op == 1)) {
            console.log('jfhhhhhg',page + op)
            this.setState({ page: page + op })
        }
    }
    
    render() {
        const { t } = this.props
        const Events = applyFilters({
            key: 'Filter',
            path: "parties__reservation",
            params: {
                _type: 'ev',
            }
        })
        const { page } = this.state
        let pageMax = Math.ceil((keys(Events) || []).length / 15)

        return (
            <div className={classes.allCon}>
                <div className={classes.header}>
                    <p>{t("Events")}</p>
                    <Header
                    page={page}
                    pageMax={pageMax}
                    handelPageClick={this.handelPageClick}/>
                    <p>{moment().format('DD-MM-YYYY hh:mm')}</p>
                </div>
                <div className={classes.eventCon}>
                    {/* {this.events()} */}
                    {
                         map(Events, (d, index) => {
                            return this.renderEvents(d, index)
                        }).slice(15 * (page - 1), 15 * page)
                    }
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    Guests: state.parties__event_checkin.data,
    events: state.parties__reservation.data

})
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(TodayEvents)))
