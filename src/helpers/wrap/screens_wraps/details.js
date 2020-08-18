import React from 'react'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from "helpers/actions/main";
import { connect } from "react-redux";
import { get, filter } from 'lodash'
import uuid from 'uuid/v4'
import item from '../../../components/popups/order_view/item';

export default (Component, props = {}) => {
    class DetailsWrap extends React.Component {
        onSubmit = (values) => {
            if (values) {
                const { formValues, setMain, activePrice, setAll, item } = this.props
                const old_details = formValues ? { ...formValues } : null
                const detail = { ...values }
                // modifiers: filter(values.modifiers, { parent: values.size }) 
                setAll([
                    { type: 'set_main', app: 'form_actions', data: { active: detail.id } },
                    {
                        type: 'set_main', app: 'form_actions', data: {
                            details: { ...formValues, [detail.id]: detail }
                        }
                    }

                ])
                if (get(activePrice, 'has_modifiers') || item._type == 'ss'||item._type == 'ssb') { this.nextClick('mod') }
                else {
                    this.nextClick('cart', detail.id)
                }




                // })
            }
        }
        nextClick = (type, id) => {
            const { history, match, setMain, item , appendPath} = this.props;
            setMain('form_actions', { CartStatus: false })
            if (type == 'mod') {
                if (item._type == 'ss') {
                    console.log("hmzzljlkjk")
                    history.push('/combo')

                }
               else if (item._type == 'ssb') {
                    history.push('/ssb')

                }
                else if(item._type=='di')
                    history.push('/modifier')
            }
            else if(type=='cart'){
            appendPath('form_actions', `details.${[id]}`, { add: true })

               history.push('/cart')
            }
        }
        goBack = () => {
            const { history, setMain } = this.props;
            setMain('form_actions', { detail: {} })
            history.goBack();
        }
        getPrices = () => {
            const { item, setMain } = this.props
            const list = applyFilters({
                key: "List",
                path: "items__prices",
                select: {
                    sales_item: item.id,
                },
                then: {
                    key: "Reject",
                    params: {
                        active: false,
                    },
                },
            });
            return list
        }
        getDonenss = () => {
            return applyFilters({
                key: 'Filter',
                path: 'dropdowns__doneness',
                params: {
                    active: true
                }
            })
        }
        getUnit = (d) => {
            return applyFilters({
                key: "Find",
                path: "dropdowns__units_of_measure",
                params: {
                    id: d.sales_unit,
                },
            });
        }
        getInitials = () => {
            const { activeDetail, item, activePrice } = this.props
            const size = this.getUnit(activePrice)
            if (activeDetail) {
                return activeDetail
            }
            else {
                return {
                    quantity: 1,
                    id: uuid(),
                    item_type: item._type,
                    name: item.name,
                    size: size ? size.name : '',
                    price: activePrice.price,
                    max_quantity:item.max_quantity
                    // parent_check: true
                }
            }
        }
        render() {
            const { item, activePrice, formValues } = this.props
            const intivalues = this.getInitials()

            return <Component handelClick={this.handelClick}
                nextClick={this.nextClick}
                goBack={this.goBack}
                getPrices={this.getPrices}
                getUnit={this.getUnit}
                getDonenss={this.getDonenss}
                item={item}
                activePrice={activePrice}
                initialValues={intivalues}
                formValues={formValues}
                onSubmit={this.onSubmit}
            />
        }
    }
    const mapStateToProps = (state) => ({
        item: get(
            state.items__sales_items.data,
            get(state.items__sales_items, "active", undefined),
            undefined
        ),
        shift: get(state.orders__shifts, "active", undefined),
        mode: get(state.settings__mode, "active", undefined),
        station: get(state.licensing__station, "active", undefined),
        activePrice: get(get(state.items__prices, 'data', ''), state.items__prices.active, ''),
        formValues: get(state.form_actions, 'details', {}),
        activeDetail: get(state.form_actions.details, state.form_actions.active),



        // data: state.cart


    });
    return connect(mapStateToProps, mapDispatchToProps)(DetailsWrap);

}
