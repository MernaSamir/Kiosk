import React from 'react'
import applyFilters from 'helpers/functions/filters';
import { multiRequest } from 'helpers';
import { toArray } from 'lodash'
export default (Component, props = {}) => {
    return class HomeWrap extends React.Component {
        componentDidMount() {
            const { afterFetch = () => { } } = this.props
            multiRequest({
                items__custom_menu: {},
                items__base_sales_cat: {},
                licensing__chain: {},

            })
        }
        getItems = () => {
            const category = applyFilters({
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
            }, undefined, undefined, { data: category.map(d => d.id) })
            console.log(sub_cat, "ssssss")
            return sub_cat
        }
        selectItem = (item) => {

            const { history, setMain } = this.props;
            history.push("/order");
            setMain('items__base_sales_cat', { active: item.id })

        }

        render() {
            const current_chain = applyFilters({path:"licensing__chain.active"})
            const chain = applyFilters({path:`licensing__chain.data.${current_chain}`})
            console.log(chain,"chain")

            const subCat = this.getItems()
            console.log(this.sub_cat, "subbbbbb")
            return <Component selectItem={this.selectItem} sub_cat={subCat} chain={chain}/>
        }
    }

}
