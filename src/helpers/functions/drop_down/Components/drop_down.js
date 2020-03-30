import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import { filter, get, find, map } from 'lodash'
import applyFilters from 'helpers/functions/filters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Types from './types'
import classes from './style.less'

class Addresses extends Component {


    tabs = applyFilters({
        key: 'Filter',
        path: "settings__sub_mode",
        params: {
            mode: this.props.mode.id,
        }
    })

    state = {
        transform: "rotate(0deg)",
        transitionDuration: ".4s",
        view: false,
        appDetails: {
            app: this.props.appName,
            active: get(this.tabs, "[0].id", ""),
            activeSub: get(this.tabs, "[0].key", ""),
            filterName: this.props.filterKey,
            filter: this.props.filter,
            show: this.props.show,
            add: this.props.appName == "parties__address" ? true : false,
        },
    }

    data = applyFilters({
        key: 'Includes',
        path: this.state.appDetails.app,
        select: this.state.appDetails.filterName,
    },
        undefined, undefined, {
        data: map(this.state.appDetails.filter, d => d)
    })

    rendering = () => {
        const { show, type, enable } = this.props
        if (type == 'dropDown' && Object.keys(this.data).length > 1 ||
            (enable && Object.keys(this.data).length == 1)) {
            return this.renderDiv()
        }
        return get(this.data[0], show, '')
    }

    renderDiv = () => {
        const { show } = this.props
        const { view } = this.state
        // console.log(this.data)
        return <>
            <div className={classes.container} onClick={this.showOption.bind()}>
                <p>{get(find(this.data, { is_active: true }) || this.data, show, '')}</p>
                {this.displayIcon()}
            </div>
            {view && <div className={classes.inner} >
                {this.renderList()}
            </div>}
        </>
    }

    showOption = () => {
        const { view } = this.state
        if (view == false) {
            this.setState({
                view: true,
                transform: "rotate(180deg)",
            })
        }
        else {
            this.setState({
                view: false,
                transform: "rotate(0deg)",
            })
        }
    }

    displayIcon = () => {
        const { transform, transitionDuration } = this.state
        return <FontAwesomeIcon icon="chevron-down"
            style={{ transform: transform, transitionDuration: transitionDuration }} />
    }

    renderList = () => {
        const { mode, station } = this.props
        const { appDetails } = this.state
        return <>
            {(mode.key == 'CC' && station.is_callcenter) && this.checkToRenderBtns()}
            <Types list={this.changeList()} activeSub={appDetails.activeSub} show={appDetails.show}
                appName={appDetails.app} add={appDetails.add} customer={filter} tabs={this.tabs}
                active={appDetails.active} />
        </>
    }

    renderType = () => {
        const { active } = this.state
        const activeSub = applyFilters({
            path: `settings__sub_mode.data.${active}`,
        })
        console.log(activeSub)
    }

    changeList = () => {
        const { appDetails } = this.state
        const list = applyFilters({
            key: 'Includes',
            path: appDetails.app,
            select: appDetails.filterName,
        },
            undefined, undefined, {
            data: map(appDetails.filter, d => d)
        })
        return list
    }

    checkToRenderBtns = () => {
        const { appDetails } = this.state
        if (appDetails.app != "parties__customer_contacts" && appDetails.app != 'dinin__zones') {
            return < div className={classes.btns}>
                {this.renderSubModes()}
            </div>
        }
    }

    renderSubModes = () => {
        const { appDetails } = this.state
        return map(this.tabs, (d, key) => (
            <button type="button" key={key} className={d.id == appDetails.active && classes.activebtn}
                onClick={this.setActive.bind(this, d)} >
                {d.name}
            </ button>
        ))
    }

    setActive = (elment) => {
        if (elment.name == "Delivery") {
            this.setState({
                appDetails: {
                    app: this.props.appName,
                    active: elment.id,
                    activeSub: elment.key,
                    filterName: this.props.filterKey,
                    filter: this.props.filter,
                    show: this.props.show,
                    add: true
                }
            })
        }

        else {
            this.setState({
                appDetails: {
                    app: "licensing__location",
                    active: elment.id,
                    activeSub: elment.key,
                    filterName: "chain",
                    filter: [this.props.active_chain],
                    show: "name",
                    add: false
                }
            })
        }
    }

    render() {
        return (
            this.rendering()
        )
    }
}

export default (appName) => {
    const mapStateToProps = (state, props) => ({
        list:
            filter(get(state, `${appName}.data`), { [props.filterKey || 'customer']: props.filter }),
        active: get(state, `${appName}.active`),
        active_chain: get(state, `licensing__chain.active`),
        mode: get(state.settings__mode.data, state.settings__mode.active, {}),
        station: get(state.licensing__station.data, state.licensing__station.active, {})
    })
    return connect(mapStateToProps, mapDispatchToProps)(Addresses)
}