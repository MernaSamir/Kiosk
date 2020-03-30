import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash'
import classes from '../../style.less'
import Back_Button from 'components/Back_Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Header extends Component {

    backBtn = () => {
        const { history } = this.props
        history.goBack()
    }
    render() {
        const { stations, station = "", modes, mode = "" } = this.props

        return (
            <>
                <div className={classes.title}>
                    <Back_Button alignSelf='center' marginLeft="6%" onClick={this.backBtn.bind()} />
                    <p>{`${get(stations, station, {}).name} : ${get(modes, mode, {}).name}`}</p>
                </div>

                <div className={classes.copy_paste_div}>
                    <button type="button" className={classes.copy_paste_btn} >
                        <FontAwesomeIcon icon={['far', 'copy']} className={classes.icon} />
                    </button>
                    <button type="button" className={classes.copy_paste_btn} >
                        <FontAwesomeIcon icon="paste" className={classes.icon} />
                    </button>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    stations: get(state.licensing__station, 'data', {}),
    station: get(state.settings__filter, 'update.station', {}),
    modes: get(state.settings__mode, 'data', {}),
    mode: get(state.settings__filter, 'update.mode', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));