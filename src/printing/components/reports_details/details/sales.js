import React, { Component } from 'react'
import { connect } from 'react-redux';
import mapDispatchToProps from 'helpers/actions/main'
import classes from '../style.less'
import { map, get, round } from 'lodash'

export class Details extends Component {
    getData() {
        const { data } = this.props
        this.Orders = {
            head: {
                tag: ['thead', 'th'],
                key: 'Orders',
                value: round(get(data, "totals.orders.items.val", '0'), 2)
            },
            body: {
                tag: ['tbody', 'td'],
                key: ['Voids', 'Cancels'],
                value: [round(get(data, "totals.orders.voided.val", '0'), 2) , round(get(data, "totals.orders.canceled.val", '0'), 2) ]
            }
        }
        this.itemDetails = {
            head: {
                tag: ['thead', 'th'],
                key: 'Item Sales',
                value: round(get(data, "totals.items.items_sales.val", '0'), 2)
            },
            body: {
                tag: ['tbody', 'td'],
                key: 'Discounts',
                value:  round(get(data, "totals.items.discount.val", '0'), 2)
            }
        }

        this.netSales = {
            head: {
                tag: ['thead', 'th'],
                key: 'Net Sales',
                value: round(get(data, "totals.orders.totals.net.val", '0'), 2)
            },
            body: {
                tag: ['tbody', 'td'],
                key: 'Charges',
                value: round(get(data, "totals.orders.totals.service", '0'), 2)
            }
        }

        this.grossSales = {
            head: {
                tag: ['thead', 'th'],
                key: 'Gross Sales',
                value: round(get(data, "totals.orders.totals.gross.val", '0'), 2)
            },
            body: {
                tag: ['tbody', 'td'],
                key: 'Item Tax',
                value: round(get(data, "totals.orders.totals.taxes", '0'), 2)
            }
        }
        this.grandTotal = {
            head: {
                tag: ['thead', 'th'],
                key: 'Grand Total',
                value: round(get(data, "totals.orders.totals.grant", '0'), 2)
            }
        }
    }

    renderMany = (key, value, Tag) => {
        if (Array.isArray(key)) {
            return map(key, (m, index) => (
                <tr>
                    <Tag className={classes.key}>{m}</Tag>
                    <Tag className={classes.value}>{value[index]}</Tag>
                </tr>
            ))
        }
        return <tr>
            <Tag className={classes.key}>{key}</Tag>
            <Tag className={classes.value}>{value}</Tag>
        </tr>
    }

    renderItemDetails = () => {
        return map(this.itemDetails, (d) => {
            const HeadTag = d.tag[0]
            const ColTag = d.tag[1]
            // if(round(d.value, 2)){
            return (
                <HeadTag className={get(classes, HeadTag + '_item')} >
                    {this.renderMany(d.key, d.value, ColTag)}
                </HeadTag>
            )
            // }
        })
    }

    renderNetSales = () => {
        return map(this.netSales, (d) => {
            const HeadTag = d.tag[0]
            const ColTag = d.tag[1]
            // if(round(d.value, 2)){
            return (
                <HeadTag className={get(classes, HeadTag + '_item')} >
                    {this.renderMany(d.key, round(d.value,2), ColTag)}
                </HeadTag>
            )
            // }
        })
    }

    renderOrders = () => {
        return map(this.Orders, (d) => {
            const HeadTag = d.tag[0]
            const ColTag = d.tag[1]
            // if(round(d.value, 2)){
            return (
                <HeadTag className={get(classes, HeadTag + '_item')} >
                    {this.renderMany(d.key, d.value, ColTag)}
                </HeadTag>
            )
            // }
        })
    }

    renderGrossSales = () => {
        return map(this.grossSales, (d) => {
            const HeadTag = d.tag[0]
            const ColTag = d.tag[1]
            // if(round(d.value, 2)){
            return (
                <HeadTag className={get(classes, HeadTag + '_item')} >
                    <tr>
                        <ColTag className={classes.key}>{d.key}</ColTag>
                        <ColTag className={classes.value}>{round(d.value,2)}</ColTag>
                    </tr>
                </HeadTag>
            )
            // }
        })
    }
    renderGrandTotal = () => {
        return map(this.grandTotal, (d) => {
            const HeadTag = d.tag[0]
            const ColTag = d.tag[1]
            // if(round(d.value, 2)){
            return (
                <HeadTag className={get(classes, HeadTag + '_item')} >
                    <tr>
                        <ColTag className={classes.key}>{d.key}</ColTag>
                        <ColTag className={classes.value}>{round(d.value,2)}</ColTag>
                    </tr>
                </HeadTag>
            )
            // }
        })
    }

    render() {
        this.getData()
        return (
            <>
                <div className={classes.details}>
                    <table>
                        {this.renderOrders()}
                    </table>
                    <table>
                        {this.renderItemDetails()}
                    </table>

                    <table>
                        {this.renderNetSales()}
                    </table>
                    <table>
                        {this.renderGrossSales()}
                    </table>
                    <table>
                        {this.renderGrandTotal()}
                    </table>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    data: get(state.report, 'data', {}),
})

export default connect(mapStateToProps, mapDispatchToProps)(Details)