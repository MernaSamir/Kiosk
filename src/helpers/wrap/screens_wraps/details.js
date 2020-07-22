import React from 'react'
import applyFilters from 'helpers/functions/filters';
import mapDispatchToProps from "helpers/actions/main";
import { connect } from "react-redux";
import { get, filter } from 'lodash'
import uuid from 'uuid/v4'

export default (Component, props = {}) => {
    class DetailsWrap extends React.Component {
        onSubmit = (values) => {
            if (values) {
                const { formValues, setMain, activePrice, setAll } = this.props
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
                // setMain('form_actions', { details: { old_details, [detail.id]: detail }}}
                // append_path("orders__details", 'item', {
                //     action: 'update',
                get(activePrice, 'has_modifiers', false) && this.nextClick()


                // })
            }
        }
        nextClick = () => {
            const { history, match } = this.props;
            history.push('/modifier')

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
                    item_name: item.name,
                    size: size? size.name:'',
                    price: activePrice.price
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
