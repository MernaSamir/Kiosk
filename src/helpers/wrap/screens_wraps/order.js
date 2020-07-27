import React from 'react'
import applyFilters from 'helpers/functions/filters';
import { multiRequest } from 'helpers';
import { min, isEqual, pick, get } from 'lodash'
import mapDispatchToProps from "helpers/actions/main";
import { connect } from "react-redux";

export default (Component, props = {}) => {
    class OrderWrap extends React.Component {
        shouldComponentUpdate(nextProps, nextState) {
            const compare = ['category', 'item']
            return !isEqual(pick(this.props, compare), pick(nextProps, compare)) || !isEqual(pick(this.state, compare), pick(nextState, compare))
        }
        selectItem = item => {
            const { history, setMain , setAll} = this.props;
            // setMain("items__sales_items", { active: item.id });
            // setMain('form_actions', { CartStatus: false })
            setAll([
                {type: 'set_main', app: 'items__sales_items', data: {active: item.id}},
                {type: 'set_main', app: 'form_actions', data:  { CartStatus: false }}
          
            ])
            history.push("/details");
        };
        getPrice(item) {
            const list = applyFilters({
                key: "List",
                path: "items__prices",
                select: {
                    sales_item: item
                },
                then: {
                    key: "Reject",
                    params: {
                        active: false
                    }
                }
            });

            const price = [];
            list.map(d => price.push(d.price));

            return min(price);
        }
        getItems = (category) => {
            console.log(category, "gwaaa")
            const items = applyFilters({
                key: "Filter",
                path: "items__sales_items",
                params: {
                    base_sales_cat: category
                },
                then: {
                    key: "Reject",
                    params: {
                        active: false
                    }
                }
            });
            console.log(items, "iiii")

            return items
        }
        getData = () => {
            const items = applyFilters({
                key: 'Filter',
                path: 'items__custom_menu.data',
                params: {
                    active: true
                }
            })
            const sub_cat = applyFilters({
                key: 'Includes',
                path: "items__base_sales_cat",
                select: 'custom_menu',
            }, undefined, undefined, { data: items.map(d => d.id) })

            return sub_cat;

        }
        selectItemC = (item) => {
            const { setMain } = this.props;
            console.log("hna mashyyy", item)
            setMain('items__base_sales_cat', { active: item.id })

        }

        render() {
            const category = applyFilters({ path: "items__base_sales_cat.active" })
            console.log("caaaaaaaaaats", category)

            const items = this.getItems(category)
            console.log(items, 'ittt')
            const sub_cat = this.getData()

            return <Component
                selectItem={this.selectItem}
                items={items} getPrice={this.getPrice}
                category={category}
                sub_cat={sub_cat}
                selectItemC={this.selectItemC}
            />
        }
    }
    const mapStateToProps = state => ({
        item: get(state.items__base_sales_cat, "active", undefined),
    });
    return connect(mapStateToProps, mapDispatchToProps)(OrderWrap);


}
