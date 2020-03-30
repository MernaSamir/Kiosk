import React, { Component } from 'react'
import classes from './style.less'
import attachApp from 'helpers/app'
import { map, get } from 'lodash'
import { withRouter } from 'react-router'

class LeftPosSettings extends Component {

    state = {
        currentItem: 1,
        currentCat: '',
        one: [],
        two: [],
        check: false,
        value: 1,
    }

    setCurrentItem = (id) => {
        this.setState({
            currentItem: id
        })
    }

    setCurrentCat = (name, id) => {
        this.setState({
            currentCat: {
                id: id,
                name: name
            }
        })
    }

    handleClickOne = (idx) => {
        let curr = this.state.one;
        if (!this.state.one.includes(idx)) {
            curr.push(idx);
            this.setState({ one: curr });
        }
        else {
            this.setState({ one: curr.filter((item) => item != idx) });
        }
    }

    handleClickTwo = (idx) => {
        let curr = this.state.two;
        if (!this.state.two.includes(idx)) {
            curr.push(idx);
            this.setState({ two: curr });
        }
        else {
            this.setState({ two: curr.filter((item) => item != idx) });
        }
    }

    handleChange = (event, value) => {
        this.setState({ value: parseInt(value) });
    }

    check = () => {
        this.setState({
            check: !this.state.check
        })
    }

    renderModes = () => {
        const { modes } = this.props
        return map(modes, (d, index) => (
            <button onClick={() => { this.handleClickOne(index) }}
                className={this.state.one.includes(index) ? classes.on : classes.off}>
                {d.name}
            </button>
        ))
    }

    renderPOSEs = () => {
        const { stations } = this.props
        return map(stations, (d, index) => (
            <button onClick={() => { this.handleClickTwo(index) }} className={this.state.two.includes(index) ? classes.on : classes.off}>
                {`POS ${d.name}`}
            </button>
        ))
    }

    render() {
         return (
            <div className={classes.pos_container}>
                <div className={classes.body}>
                    <div className={classes.settingsDiv}>
                        <label>Apply settings to modes</label>
                        <div className={classes.settings}>
                            {this.renderModes()}
                        </div>
                    </div>

                    <div className={classes.settingsDiv}>
                        <label>Replicate Settings in POS</label>
                        <div className={classes.settings}>
                            {this.renderPOSEs()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    modes: state.settings__mode.data,
    stations: state.licensing__station.data,
    list: state.data,
    get activeStation() { return get(state.stations, `data.${state.stations.active}`, {}) },
})

const app = {
    name: 'settings',
    settings: {
        url: 'settings/filter/'
    },
    extraState: (state) => ({
        modes: state.settings__mode,
        stations: state.licensing__station,
    })
}

export default attachApp(app, mapStateToProps, withRouter(LeftPosSettings))
