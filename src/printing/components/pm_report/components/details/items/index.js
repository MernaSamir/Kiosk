import React from 'react';
import applyFilters from 'helpers/functions/filters';
import { map, filter, get, round, pick } from 'lodash'
import classes from './style.less'
export default class Items extends React.Component {
    constructor(props) {
        super(props);
        this.datas = applyFilters({
            key: 'multiData',
            cols: {
                department: { reduxName: 'items__department' },
                cat: { reduxName: 'items__base_sales_cat' },
                menu: { reduxName: 'items__custom_menu' },
                items: { reduxName: 'items__sales_items' },
                prices: { reduxName: 'items__prices' },
                units: { reduxName: 'dropdowns__units_of_measure' }
            },
        })
    }
    renderPrice(Prices) {
        const { data } = this.props
        return map(Prices, (d, key) => {
            const sales = get(data.items, d.id)
            if(sales){
                return <>
                    <tr style={{ marginLeft: "9%", width: " 88.2%" }}>
                        <td >{`${get(this.datas.items, d.sales_item, {}).name} -
                        ${get(this.datas.units, d.sales_unit, {}).name}`}</td>
                        <td>{round(sales.quantity, 2).toFixed(2)}</td>
                        <td>{round(sales.item_sales, 2).toFixed(2)}</td>
                    </tr>
                </>
            }
            return <></>
        })

    }
    renderItems(items) {
        return map(items, (d, key) => {
            const prices = filter(this.datas.prices, { sales_item: d.id })
            return this.renderPrice(prices)
        })
    }
    renderCat(Cats, className) {
        return map(Cats, (d, key) => {
            const display = get(this.datas.cat, `${key}.name`, '')
            const items = filter(this.datas.items, { base_sales_cat: key })
            return <>
                <tr style={{ marginLeft: "6%", width: " 92.2%" }}>
                    <td >{display}</td>
                    <td>{round(d.quantity, 2).toFixed(2)}</td>
                    <td>{round(d.item_sales, 2).toFixed(2)}</td>
                </tr>
                {this.renderItems(items)}
            </>
        })

    }
    renderMenu(menus, className = classes.depName) {
        const { data } = this.props;
        if (menus) {
            return map(menus, (d, key) => {
                const display = get(this.datas.menu, `${key}.name`, '')
                const mainCats = filter(this.datas.cat, { custom_menu: key }).map(d=>d.id)
                const cat = pick(data.cats, mainCats)
                return < >
                    <tr style={{ marginLeft: "3%", width: " 96.2%" }}>
                        <td >{display}</td>
                        <td>{round(d.quantity, 2).toFixed(2)}</td>
                        <td>{round(d.item_sales, 2).toFixed(2)}</td>
                    </tr>
                    {this.renderCat(cat, (className == classes.depName) ? classes.cat : classes.menu)}
                </>
            })
        }
        return this.renderCat(this.datas.cat)
    }
    renderDepartement() {
        const { data } = this.props;
        const MainMenus = filter(this.datas.menu, { department: null }).map(d=>d.id)
        return <>
            {map(data.deps, (d, key) => {
                const display = get(this.datas.department, `${key}.name`, '')
                const mainMenus = filter(this.datas.menu, { department: key }).map(d=>d.id)
                const menus = pick(data.menus, mainMenus)
                return < >
                    <tr>
                        <td className={classes.depName}>{display}</td>
                        <td>{round(d.quantity, 2).toFixed(2)}</td>
                        <td>{round(d.item_sales, 2).toFixed(2)}</td>
                    </tr>
                    {/* 
                    <h5>{d.name}
                        {`  ${round(sales.quantity, 2).toFixed(2)} - ${round(sales.item_sales, 2).toFixed(2)}`}
                    </h5> */}
                    {this.renderMenu(menus, classes.menu)}
                </>
            })
            }
            {this.renderMenu(pick(data.menus, MainMenus))}
        </>
    }
    render() {
        return (
            <table className={classes.table}>
                <thead>
                    <th></th>
                    <th>Qty</th>
                    <th>Item Sales</th>

                </thead>
                <tbody>
                    {this.renderDepartement()}
                </tbody>
            </table>
        );
    }
}
