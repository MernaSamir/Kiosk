import React, { Component } from 'react'
import styleless from './styleless.less'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { get, filter, map } from 'lodash';
import Row from './row'
import mapDispatchToProps from 'helpers/actions/main'


class Parent extends Component {
    state = {
        // display: 'none',
        // tmpdisplay: 'none',
        transform: "rotate(180deg)",
        transitionDuration: ".4s",
        rowDisplay: 'none'
    }

    handleCollapseClick = () => {
        const { rowDisplay } = this.state
        if (rowDisplay == 'block') {
            this.setState({ rowDisplay: 'none' })
        }

        else { this.setState({ rowDisplay: 'block' }) }
    }

    renderRows = () => {
        let { appDataLayer2, appSettings, item } = this.props
        let fil = filter(appDataLayer2.data, { [get(appSettings, 'tableList.layer1.match')]: item.id })
        return map(fil, (d, index) => {
            return <Row
                key={index}
                item={d}
                openCollapse={this.openCollapse}
            />
        })
    }
    openCollapse = () => {
        this.setState({ rowDisplay: 'block' })
    }

    render() {
        const { item, style, styles } = this.props
        const { rowDisplay } = this.state
        return (


            <div style={{ height: 'auto' }}>
                <div onClick={() => this.handleCollapseClick()} className={styleless.parent_container} >
                    {/* <FontAwesomeIcon icon={icon} style={{ ...style, fontSize: '0.5vw', alignSelf: 'center' }} /> */}
                    <p className={styleless.parent_p} style={{ ...style }}>{item.name}</p>
                    <FontAwesomeIcon className={styleless.parent_icon} style={{ ...styles, transitionDuration: this.state.transitionDuration, fontSize: '0.8vw' }} icon="chevron-down" />
                </div>
                <div style={{ display: rowDisplay }}>
                    {this.renderRows()}
                </div>
            </div>


        )
    }
}





const mapStateToProps = (state, props) => {
    const appSettings = get(state, 'apps.active', {})
    const appSettingsTableList2 = get(state, 'apps.active.tableList.layer2', {})
    return {
        appSettings,
        appDataLayer2: get(state, `${(appSettingsTableList2.reduxName || "").replace(' ', '_')}`, {})

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Parent)
