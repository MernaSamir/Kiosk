import React, { Component } from 'react'
import { connect } from 'react-redux'
import styleless from './styleless.less'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, map, filter, isEmpty, isUndefined } from 'lodash'
import { withRouter } from 'react-router-dom';
import mapDispatchToProps from 'helpers/actions/main'
import applyFilter from 'helpers/functions/filters'
var moment = require('moment');

class Row extends Component {

    state = {
        rowDisplay: 'none',
        icon: 'chevron-down'
    }

    onClick = () => {
        const { appSettings, item, match, setMain, history, resetAll, child } = this.props
        const { rowDisplay } = this.state
        if (isEmpty(child)) {
            resetAll('form')
            setMain(`${(appSettings.reduxName || "").replace(' ', '_')}`, { active: item.id })
            history.replace(['/app', match.params.appUrl, item.id].join('/'))
        } else {
            if (rowDisplay == 'block') {
                this.setState({ rowDisplay: 'none', icon: 'chevron-down' })
            }

            else { this.setState({ rowDisplay: 'block', icon: 'chevron-up' }) }
        }
    }

    renderChild = () => {
        let { childData, child, item } = this.props
        let fil = filter(childData, { [get(child, 'match', "")]: item.id })
        return map(fil, (d, index) => {
            return <FinalComponent
                key={index}
                item={d}
                child={child.child || {}}
            />
        })
    }

    rendering = () => {
        const { msg } = this.props
        if (isUndefined(msg)) {
            return this.renderDefault()
        }
        return this.renderMsg()
    }

    renderDefault = () => {
        const { item: { name }, selectedItem, item, child } = this.props
        const { rowDisplay, icon } = this.state
        return <>
            <div className={selectedItem == item.id ? styleless.row_container_active : styleless.row_container}
                onClick={() => this.onClick()}>
                <p>{name}</p>
                {!isEmpty(child) ?
                    <FontAwesomeIcon
                        className={styleless.parent_icon}
                        style={{ fontSize: '0.8vw' }}
                        icon={icon} />
                    : undefined}
            </div>
            <div className={styleless.row_container_layer3} style={{ display: rowDisplay }}>
                {this.renderChild()}
            </div>
        </>
    }

    renderMsg = () => {
        const { item: { content, sender, created_at } } = this.props
        const senderName = applyFilter({
            key: 'Find', path: 'auths__user',
            params: {
                id: sender
            }
        })
        return < div className={this.renderClassName('msg_div', 'active_msg_div')} onClick={() => this.onClick()}>
            <div className={styleless.firstrow}>
                <p>{senderName.name}</p>
                <p id={styleless.date}>{moment(created_at).format('HH:mm a')}</p>
            </div>
            <div className={styleless.secrow}>
                <p>{content.slice(0, 12)}</p>
            </div>
        </div >
    }

    renderClassName = (defaultClass, activeClass) => {
        const { selectedItem, item } = this.props
        if (selectedItem == item.id) {
            return get(styleless, activeClass, '')
        }
        return get(styleless, defaultClass, '')
    }

    render() {
        return (
            this.rendering()
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        appSettings: get(state, 'apps.active', {}),
        get selectedItem() { return get(state, `${this.appSettings.reduxName}.active`, '') },
        childData: get(state, `${props.child.reduxName}.data`, {})
    }
}

const wrapper = connect(mapStateToProps, mapDispatchToProps)(Row)
export const FinalComponent = withRouter(wrapper)
export default FinalComponent
