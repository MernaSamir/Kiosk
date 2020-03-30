import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { get, map } from 'lodash'
import classes from './../../style.less'
import DropDownRow from './dropdown_row';
import CheckboxRow from './checkbox_row';
import TableRow from './table_row';
import SliderRow from './slider';
import { set, pick } from 'lodash'

let data = [{ name: 'Sales Category', id: 1 }, { name: 'Screen Group', id: 2 }];

class Body extends Component {

    state = {
        settings: {},
    }

    getSettings = (key, value) => {
        const { getFinalSettings } = this.props
        this.setState({
            settings: set(this.state.settings, key, value.toString())
        })
        getFinalSettings(this.state.settings)
    }

    renderDropDown = (name, data) => {
        const { modes, mode, setAll } = this.props
        const tmpmode = get(modes, mode, {})
        return <DropDownRow name={name} data={data} value={tmpmode.id}
            getSettings={this.getSettings} setAll={setAll} />
    }

    renderCheckBox = (name, innerName, k) => {
        const { pos_settings, modes, stations, station = {}, mode, list } = this.props
        const tmpmode = get(modes, mode, {})
        const tmpstation = get(stations, station, {})
        return <CheckboxRow name={name} innerName={innerName} k={k}
            getSettings={this.getSettings} pos_settings={pos_settings} list={list} mode={tmpmode}
            station={tmpstation} />
    }

    renderTable = () => {
        const { menu, category } = this.props
        return <TableRow menu={menu} category={category} />
    }

    renderSlider = () => {
        const { pos_settings, modes, stations, station = {}, mode, list } = this.props
        const tmpmode = get(modes, mode, {})
        const tmpstation = get(stations, station, {})
        return <SliderRow getSettings={this.getSettings} pos_settings={pos_settings} list={list}
            mode={tmpmode} station={tmpstation} />
    }

    render() {
        const { modes, stations, station = {} } = this.props
        const modeList = pick(modes, map(get(stations, station, {}).modes, d => d))
        return (
            <div className={classes.body}>
                {this.renderDropDown("Default Launch Mode", modeList)}
                {this.renderCheckBox('Level 1 Groupings', 'Show Menus', 'menuShow')}
                {this.renderDropDown("Level 2 Groupings", data)}
                {this.renderTable()}
                {this.renderSlider()}
                {this.renderCheckBox('Modifiers', 'Automatic Pop-up', 'modifiers')}
                {this.renderCheckBox('Course', 'Automatic Pop-up', 'course')}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    stations: get(state.licensing__station, 'data', {}),
    pos_settings: get(state.main, 'pos_settings', {}),
    menu: get(state.items__custom_menu, 'data', {}),
    category: get(state.items__base_sales_cat, 'data', {}),
    modes: get(state.settings__mode, 'data', {}),
    station: get(state.settings__filter, 'update.station', {}),
    mode: get(state.settings__filter, 'update.mode', {}),
    list: state.settings__filter.data,
})

export default connect(mapStateToProps, mapDispatchToProps)(Body);