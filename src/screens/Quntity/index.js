import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import Header from './Header';
import QuantityContainer from './quantity_container';
import { get } from 'lodash';
import classes from './style.less'

class Quantity extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { active, setMain, appendPath, salesItem = {}, detail, unit } = this.props
        return (
            <div className={classes.Quantity_Change_main}>
                <div className={classes.Quantity_Change_frame}>
                    <Header name={salesItem.name} setMain={setMain} />
                    <QuantityContainer detail={detail} active={active} setMain={setMain}
                        appendPath={appendPath} unit={unit} />
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    active: get(state.orders__details.data, state.orders__details.active, {}),
    detail: get(state.orders__details, `data.${state.orders__details.active}`, {}),
    get price() { return get(state.items__prices.data, this.detail.item, {}) },
    get unit() { return get(state.dropdowns__units_of_measure.data, this.price.sales_unit, {}) },
    get salesItem() { return get(state.items__sales_items.data, this.price.sales_item, {}) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Quantity)

