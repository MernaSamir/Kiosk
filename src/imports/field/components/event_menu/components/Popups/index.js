import React, { Component } from 'react'
import { get, isEqual, pick } from 'lodash';
import * as PopUpsComponents from './types';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import { pos_settings } from 'config/defaults'

class Popups extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        const { activeItem, option, setMain } = nextProps
        const compare = ['activeItem', "activePopup", "position", "index"]
        const su = !isEqual(activeItem.id, this.props.activeItem.id)
        if (su) {
            const active = activeItem.id && option ? 'Color' : activeItem.id ? 'Size' : ''
            // SetMain({ active })
            setMain('popup', { active })
        }
        return !isEqual(pick(nextProps, compare), pick(this.props, compare));
    }

    renderPopup = () => {
        const { activeItem, position, index, pos_settings, activePopup } = this.props;
        const Component = get(PopUpsComponents, activePopup, '');
        return Component && <Component {...this.props}
            item={activeItem} position={position}
            index={index} pos_settings={pos_settings} />
    }

    render() {
        return this.renderPopup()
    }
}

const mapStateToProps = (state) => ({
    activeItem: get(state.items__sales_items.data, state.items__sales_items.active, {}),
    activePopup: state.popup.active,
    position: state.popup.position,
    index: state.popup.index,
    pos_settings: get(state.main.pos_settings, `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings)
})

export default connect(mapStateToProps, mapDispatchToProps)(Popups)