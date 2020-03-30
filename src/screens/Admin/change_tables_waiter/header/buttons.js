import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import classes from './../style.less'
import { get } from 'lodash';

class Buttons extends Component {

    state = {
        className: ''
    }

    customassign = () => {
        const { enableClick, enableclick } = this.props
        if (!enableclick) {
            this.setState({
                className: 'activebtn'
            })
        }
        else {
            this.setState({
                className: ''
            })
        }
        enableClick()
    }

    goToFloorPlan = () => {
        const { history } = this.props
        history.push('/floor-plan')
    }

    render() {
        const { className } = this.state
        const {t} = this.props
        return (
            <div className={classes.btns_container}>
                {/* <button type="button" onClick={this.goToFloorPlan.bind()}>{t('Floorplan')}</button> */}
                <button type="button" className={get(classes, className, '')}
                    onClick={this.customassign.bind()}>{t('Custom Assign')}</button>
            </div>
        )
    }
}

export default withRouter(Buttons)