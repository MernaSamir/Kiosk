import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    get, filter, map, find, round, sumBy, groupBy, includes, head, difference, isEmpty
}
    from 'lodash'
import classes from '../style.less'
import applyFilters from 'helpers/functions/filters';

class ReceiptBill extends Component {
    constructor(props) {
        super(props);
        this.translate = props.translate
    }
    getLists() {
        const { currentReceipt } = this.props;
        this.datas = {
            receiptItems: get(currentReceipt, 'items', applyFilters({
                key: 'Filter',
                path: 'orders__receipt_items',
                params: {
                    receipt: currentReceipt.id
                }
            }, undefined, undefined, { data: null })).filter(d => d.quantity),
            details: applyFilters({
                key: "Filter",
                path: 'orders__details',
                params: {
                    order: currentReceipt.order
                },
                then: {
                    key: "Reject",
                    params: {
                        deleted: true
                    }
                }
            })
        }
        return this.datas;
    }

    getDetail(receiptItem) {
        return applyFilters({
            key: 'chainMulti',
            selectors: {
                orders__details: 'details',
                items__prices: 'item',
                items__sales_items: 'sales_item',
            }
        }, receiptItem)
    }

    renderItems() {
        const datas = this.getLists()
        const { details } = datas;
        const data = this.combineList()
        return map(filter(data, (d) =>
            (find(details, { id: d.details, parent: null }))),
            this.renderRow.bind(this, classes.table_row, false)
        )
    }

    combineList = () => {
        const { receiptItems, details } = this.datas;
        const noParents = filter(details, d => !(filter(details, v => v.parent == d.id).length) && !d.parent)
        const items = filter(receiptItems, d => includes(noParents.map(i => (i.id)), d.details))

        const grouped = groupBy(items, (d) => {
            const detail = applyFilters({
                path: `orders__details.data.${d.details}`
            })
            return detail.item
        })
        return [...map(grouped, d => {
            return { ...head(d), quantity: sumBy(d, 'quantity') }

        }), ...difference(receiptItems, items)]
    }

    renderUOM = (elment) => {
        const { items__prices: price, } = this.getDetail(elment)
        const { receipt_settings, sizes } = this.props
        if (receipt_settings.uom) {
            return `- ${get(sizes, `${price.sales_unit}.${this.renderName('uom_lang')}`)}`
        }
        return ''
    }

    renderName = (key) => {
        const { show } = this.props
        // if (receipt_settings[key]) {
        //     if (receipt_settings[key] == 'n') {
        //         return 'name'
        //     }
        //     return 'alter_name'
        // }
        return show
    }

    renderItemName = (elment) => {
        const { items__sales_items: item } = this.getDetail(elment)
        return get(item, this.renderName('si_lang'))
    }

    renderOrderNote = () => {
        const { currentReceipt } = this.props
        const order = applyFilters({
            path: `orders__main.data.${currentReceipt.order}`
        })
        if (order.note) {
            return < div className={classes.row} >
                <p className={classes.netTotal}>{this.translate("Order Note")}</p>
                <p className={`${classes.value} ${classes.netTotal}`}>{order.note} </p>
            </div >
        }
        <></>
    }

    renderItemNote = (elment, className) => {
        const { orders__details } = this.getDetail(elment)
        if (orders__details.notes) {
            return <tr className={className}>
                <td className={`${classes.th_width} ${classes.item_name}`}
                    style={{ width: '0.6cm' }}></td>
                <td className={`${classes.th_big_width} ${classes.item_name}`} style={{ width: '5cm' }}>
                    {`( ${orders__details.notes} )`}
                </td>
                <td className={`${classes.th_width} ${classes.item_name}`} style={{ width: '.9cm' }}></td>
            </tr>
        }
    }

    renderRow = (className, has_parent, d, index) => {
        const { details } = this.datas;
        const data = this.combineList()
        const list = filter(data, (v) =>
            (find(details, { id: v.details, parent: d.details })))
        return <>
            <tr key={index} className={className}>
                <td className={`${classes.th_width} ${classes.item_name}`}
                    style={{ width: '0.6cm' }}>{round(d.quantity, 2)}
                </td>
                <td className={`${classes.th_big_width} ${classes.item_name}`} style={{ width: '5cm' }}>
                    {`${has_parent ? ' * ' : ''}${this.renderItemName(d)} ${this.renderUOM(d)}`}
                </td>
                <td className={`${classes.th_width} ${classes.item_name}`} style={{ width: '.9cm' }}>
                    {round(d.price * d.quantity, 2).toFixed(2)}
                </td>
            </tr>
            {Boolean(list.length) && this.renderModifiers(list, className)}
            {this.renderItemNote(d, className)}
        </>
    }

    renderModifiers = (list, className) => {
        const { receipt_settings } = this.props
        if (receipt_settings.modifiers_details) {
            return <tr className={className} >
                <td className={`${classes.th_width} ${classes.item_name}`} style={{ width: '0.6cm' }}></td>
                <td className={`${classes.th_big_width} ${classes.item_name}`} style={{ width: '5cm' }}>
                    {map(list, this.rendermod.bind(this, classes.modifier, true))}
                </td>
                <td className={`${classes.th_width} ${classes.item_name}`} style={{ width: '.9cm' }}>
                    {sumBy(list, o => o.price * o.quantity)}
                </td>
            </tr>
        }
    }

    rendermod = (className, has_parent, d, index) => {
        const { sizes } = this.props
        const { items__prices: price, items__sales_items: item } = this.getDetail(d)
        return `(${round(d.quantity, 2)}, ${item.name}- ${get(sizes, `${price.sales_unit}.${this.renderName('uom_lang')}`)}, ${round(d.price * d.quantity, 2).toFixed(2)} )`
    }

    checkMinCharge = (currentReceipt) => {
        if (currentReceipt.min_charge) {
            return <div className={classes.row}>
                <p>{this.translate("Min Charge")}</p>
                <p className={classes.value}>
                    {round(currentReceipt.min_charge, 2).toFixed(2)}
                </p>
            </div>
        }
        return <></>
    }

    renderNeedToPay = (currentReceipt) => {
        return <div className={classes.row}>
            <p className={classes.netTotal}>{this.translate("Need To Pay")}</p>
            <p className={`${classes.value} ${classes.netTotal}`}>
                {`${this.renderNewPrice(round(currentReceipt.total, 2).toFixed(2))} ${this.checkCurrency()}`}
            </p>
        </div>
    }

    renderNewPrice = (price) => {
        const { currency = {} } = this.props
        const ratio = applyFilters({
            key: 'Find',
            path: 'dropdowns__currencies_conversions',
            params: {
                _from: get(currency, 'id', {})
            }
        })
        return round((price / get(ratio, 'ratio', 1)), 2)
    }

    checkCurrency = () => {
        const { currency } = this.props
        if (!isEmpty(currency)) {
            return currency.symbol
        }
        return 'EG£'
    }

    renderDefault = (currentReceipt) => {
        const { currency } = this.props
        const base = applyFilters({
            key: 'Find',
            path: 'dropdowns__currencies',
            params: {
                is_base_currency: true
            }
        }) || {}
        if (currency.id != base.id) {
            return <div className={classes.row}>
                <p className={classes.netTotal}>{this.translate("Default")}</p>
                <p className={`${classes.value} ${classes.netTotal}`}>
                    {`${round(currentReceipt.total, 2).toFixed(2)} ${base.symbol}`}
                </p>
            </div>
        }
    }

    render() {
        const { currentReceipt, payments, paymentTypes, show } = this.props
        const payment_types = map(groupBy(payments, 'payment_type'), (d, key) => ({
            type: get(paymentTypes, `${key}.${show}`, ''),
            value: `${this.renderNewPrice(round(sumBy(d, 'value'), 2))} ${this.checkCurrency()}`,
        })).map(d => `${d.type}(${d.value})`);
        return (

            <div >
                <table className={classes.table_header}>
                    <thead>

                    </thead>

                    <tbody>
                        {this.renderItems()}
                    </tbody>

                </table>

                <div className={classes.receipt_calculation}>
                    <div className={classes.row}>
                        <p className={classes.netTotal}>{this.translate("Subtotal")}</p>
                        <p className={`${classes.value} ${classes.netTotal}`}>
                            {round(currentReceipt.sub_total, 2)}
                        </p>
                    </div>
                    <div className={classes.row}>
                        <p>{this.translate("Item Sales")}</p>
                        <p className={classes.value}>
                            {round(currentReceipt.item_sales, 2)}
                        </p>
                    </div>
                    <div className={classes.row}>
                        <p>{this.translate("Discount")}</p>
                        <p className={classes.value}>
                            {round(currentReceipt.discount, 2)}
                        </p>
                    </div>
                    <div className={classes.row}>
                        <p>{this.translate("Service")}</p>
                        <p className={classes.value}>
                            {round(currentReceipt.service, 2)}
                        </p>
                    </div>
                    <div className={classes.row}>
                        <p>{this.translate("VAT")}</p>
                        <p className={classes.value}>
                            {round(currentReceipt.tax, 2)}
                        </p>
                    </div>
                    <div className={classes.row}>
                        <p>{this.translate("Total")}</p>
                        <p className={classes.value}>
                            {round(currentReceipt.net_total, 2)}
                        </p>
                    </div>

                    <div className={classes.row}>
                        <p className={classes.netTotal}>{this.translate("Balance Due")}</p>
                        <p className={`${classes.value} ${classes.netTotal}`}>
                            {round(currentReceipt.total, 2)}
                        </p>
                    </div>
                    {this.checkMinCharge(currentReceipt)}
                    {this.renderNeedToPay(currentReceipt)}
                    {this.renderOrderNote()}
                    <div className={classes.row}>
                        <p>{payment_types.join(', ')}</p>
                    </div>
                    {this.renderDefault(currentReceipt)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    payments: filter(state.orders__payment.data, { receipt: props.currentReceipt.id }),
    paymentTypes: state.payment__types.data,
    get sizes() { return state.dropdowns__units_of_measure.data },
    currency: get(state.dropdowns__currencies.data, state.dropdowns__currencies.active, ''),
})

export default connect(mapStateToProps, null)(ReceiptBill)