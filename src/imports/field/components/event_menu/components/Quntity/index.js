import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main';
import Header from './Header';
import QuantityContainer from './quantity_container';
import { get } from 'lodash';

class Quantity extends Component {

    render() {
        const { active, setMain, appendPath, salesItem, detail, unit , field , handleChange } = this.props
        return (
            <div className="Quantity_Change_main">
                <div className='Quantity_Change_frame'>
                    <Header name={salesItem.name} setMain={setMain} field={field}/>
                    <QuantityContainer detail={detail} setMain={setMain}
                        appendPath={appendPath} unit={unit} field={field} handleChange={handleChange}/>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state,props) => ({
    active: get(state.form_actions, `${props.field.name}.active`),

    detail: get(state.orders__details, `data.${get(state.orders__details, 'active')}`, {}),
    get price() { return get(state.items__prices.data, this.detail.item, {}) },
    get unit() { return get(state.dropdowns__units_of_measure.data, this.price.sales_unit, {}) },
    get salesItem() { return get(state.items__sales_items.data, this.price.sales_item, {}) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Quantity)

