import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import classes from './style.less'
import { range, get, find } from 'lodash'
import mapDispatchToProps from 'helpers/actions/main'

class ColorClass extends Component {

    constructor(props) {
        super(props);
    }

    renderTopPostion = (position) => {
        const { index } = this.props
        if (index < 15) { return position.top }
        return position.top
    }

    renderLeftPostion = (position) => {
        const { index } = this.props
        if ((index >= 2) && (index % 5 == 3 || index % 5 == 4)) { return position.left - 300 }
        return position.left + 79
    }

    renderColors = () => {
        return range(0, 12).map((d, index) =>
            <div id={`color ${index}`} className={classes.color} key={index}
                onClick={this.renderFunctions.bind(this, index)}></div>
        )
    }

    renderFunctions = (index) => {
        let elem = document.getElementById("color " + index);
        let color = window.getComputedStyle(elem, null).getPropertyValue("background-color");
        this.changeColor(color)
    }

    changeColor = (color) => {
        const { setMain, station, data, activeItem, appendPath } = this.props
        const rec = find(data, { item: activeItem.id })
        if (!rec) {
            setMain(
                'items__item_color', {
                    item: {
                        station: station.id, item: activeItem.id,
                        color, action: "add", onSuccess: this.closePopup
                    }
                })
        }
        else {
            appendPath('items__sales_items', `data.${activeItem.id}.button_color`, { color })
            setMain('items__item_color', { item: { action: "update", color, id: rec.id, onSuccess: this.closePopup } })
        }
    }

    closePopup = () => {
        const { setMain } = this.props
        return [
            {type: 'set_main_items__sales_items', data: { active: '' }},
            {type: 'set_main_popup', data: { active: '' }},
        ]
    }

    render() {
        const { style, position } = this.props
        return (
            <div className={classes.cat_popuptext_color}
                style={{
                    ...style, ...position, top: this.renderTopPostion(position),
                    left: this.renderLeftPostion(position)
                }}
                id="cat-Popup" >
                <div className={classes.colors}>
                    {this.renderColors()}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    activePopup: state.popup.active,
    get station() { return get(state.licensing__station, `data.${state.licensing__station.active}`, {}) },
    activeItem: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    data: state.items__item_color.data,
})

export const Color = connect(mapStateToProps, mapDispatchToProps)(withRouter(ColorClass));