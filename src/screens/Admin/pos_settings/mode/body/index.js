import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import classes from './style.less'
import mapDispatchToProps from 'helpers/actions/main'
import { map, find, get } from 'lodash';
import mode1 from 'assets/images/Stations-Modes/station 1@2x.png'
import mode2 from 'assets/images/Stations-Modes/station 2@2x.png'
import mode3 from 'assets/images/Stations-Modes/station 3@2x.png'

class Body extends Component {

    renderModes = () => {
        const { modes, list } = this.props
        const mode_1 = <img src={mode1} />
        const mode_2 = <img src={mode2} />
        const mode_3 = <img src={mode3} />
        return map(modes, (d, index) => {
            const mode = find(list, { id: d })
            return <button type="button" className={classes.mode_btn}
                onClick={this.renderPos.bind(this, mode)}>
                {index == 0 ? mode_1 : index == 1 ? mode_2 : mode_3}
                <p>{mode.name}</p>
            </button>
        })
    }

    renderPos = (mode) => {
        const { history, setAll } = this.props
        // appendPath('settings__filter', 'item', { mode: mode.id })
        setAll([
            { type: 'append_path', path: 'update', app: 'settings__filter', data: { mode: mode.id } },
            { type: 'append_path', path: 'item', app: 'settings__filter', data: { mode: mode.id } },
        ])
        history.push('/admin/pos_settings/setting')
    }

    render() {
        return (
            <div className={classes.body_container}>
                <div className={classes.modes_div}>
                    {this.renderModes()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    list: state.settings__mode.data
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Body))