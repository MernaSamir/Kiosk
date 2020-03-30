import React, { Component } from 'react'
import { connect } from 'react-redux'
import mapDispatchToProps from 'helpers/actions/main'
import classes from './style.less';
import { get, round } from 'lodash';
import { withRouter } from 'react-router'
import { pos_settings } from 'config/defaults'

class prices extends Component {
    constructor(props) {
        super(props)
        this.state = {};
        if (props.price.length == 1) {
            this.state.active = props.price[0]
        }
    }
    selectPrice = (active) => {
        this.setState({ active })
    }
    renderPrices = () => {
        const { active = {} } = this.state
        const { price, units } = this.props
        console.log(price)
        return <div className={classes.price_button}>
            {price.map((d, key) => (<button className={`${active.id == d.id ? 'active' : ''}`}
                onClick={this.selectPrice.bind(this, d)} key={key}>
                {get(units, `${d.sales_unit}.name`)}
                <p>{round(d.price, 2)}</p>
            </button>))}
        </div>
    }
    addPrice = (price) => {
        let dis = [];
        const { item, setAll } = this.props
        dis.push({ type: 'set_main', app: 'items__sales_items', data: { active: item.id } })
        let data = { item: price.id, price: price.price, quantity: 1 };
        let active = item.has_doneness ? 'Doneness' : '';
        const onSuccess = this.goModifires.bind(this, price)
        dis.push({ type: 'append_path', path: 'item', app: 'orders__details', data: { ...data, add: !active, onSuccess } })
        dis.push({ type: 'set_main', app: 'popup', data: { popup: {}, active } })
        setAll(dis);
    }
    goModifires = (price) => {
        const { item, history, pos_settings = {} } = this.props
        let active = item.has_doneness ? 'Doneness' : '';
        if (!active && price.has_modifiers && history.location.pathname == '/home') {
            eval(pos_settings.modifiers) && history.push('/Home/modifires')
        }
        return [
            { type: 'set_main_items__sales_items', data: { active: '' } },
            { type: 'set_main_items__popup', data: { active: '' } },

        ]
    }
    addOrder = () => {
        const { active } = this.state;
        if (active) {
            this.addPrice(active)
        }
    }
    render() {
        return (
            <div>
                <p className={classes.size_title}>Size</p>
                {this.renderPrices()}
                <div className={classes.add_order}>
                    <button type="button" onClick={this.addOrder}>Add to Order</button>
                </div>
            </div>
        )
    }
}

export default connect((state) => ({
    units: state.dropdowns__units_of_measure.data,
    pos_settings: get(state.main.pos_settings, `${state.licensing__station.active}.${state.settings__mode.active}`, pos_settings)
}), mapDispatchToProps)(withRouter(prices))
