import { map, filter, set, round, ceil, find, omit, min, get, flatten, max, pick, pickBy, uniqBy, sumBy, reject, mapValues, groupBy } from 'lodash';
import store from 'store';
import moment from 'moment';
import uuid from 'uuid/v4';
export const calcQuantity = (d, data, state, props) => {
    return d.quantity + sumBy(
        filter(data, { duplicate: d.id }), 'quantity') -
        sumBy(filter(data, { void: d.id }),
            v => {
                const seats = get(d, 'seats', [])
                if (seats.length) {
                    return (v.quantity / d.seats.length * props.seatsNum.filter(g => d.seats.includes(g)).length)
                }
                return v.quantity
            }
        )
}
export const getDiscount = (d, data, state, props, extra = {}) => {
    if (get(extra.item_details, 'sales_item.has_discount', true)) {
        const orderDiscounts = props.orderDiscounts;
        return max(map(pick(pickBy(state.discount__main.data, { is_percent: true }), map([
            ...filter(orderDiscounts, { seat_num: d.seat_num, detail: null }),
            ...filter(orderDiscounts, { detail: d.id }),
            ...filter(orderDiscounts, { seat_num: 0, detail: null })
        ], d => (d.discount)
        )), dis => (dis.value * (extra.quantity * extra.main_price - data.promo) / 100))) || 0
    }
    return 0
}
const getCustomerDiscount = (d, data, state, props, extra = {}) => {
    const dis = get(props.customerGroup, 'discount')
    const max_dis = get(props.customerGroup, 'max_discount')
    let val = (dis * (extra.quantity * extra.main_price - get(data.promo, `${extra.promotion.id}.total`, 0)) / 100);
    if (max_dis) {
        val = min([val, max_dis - data.c_val])
    }
    return val
}
const getMainPrice = (d, data, state, props, extra) => {
    if (get(extra.item_details, 'sales_item.tax_inclusive', true)) {
        return (extra.price / (1 + (extra.item_details.sales_item.tax_percent / 100)))
    }
    return extra.price;
}
export const getTax = (d, data, state, props, extra) => {
    return ((extra.quantity * extra.main_price) - (extra.discount + extra.p_discount + extra.c_discount)) * extra.item_details.sales_item.tax_percent / 100;
}
export const getMainTax = (d, data, state, props, extra) => {
    return ((extra.quantity * extra.main_price)) * extra.item_details.sales_item.tax_percent / 100;
}
const getAppliedPromotion = (d, data, props, extra = {}) => {
    const si = extra.item_details.sales_item;
    if (!si.has_discount) {
        return {}
    }
    let promotion = props.applyFilters({
        key: 'oring',
        funs: {
            wo: {
                key: "Filter",
                params: {
                    apply_on: 'wo'
                }
            },
            si: {
                key: "Filter",
                params: {
                    apply_on: 'si'
                },
                then: {
                    key: 'DataIncludes',
                    pick: 'item.item',
                    select: 'then_items'
                }
            }

        }

    }, props.promotions, undefined, { ...props, data: { ...props.data, item: d } });
    const date = moment().format("HH:mm:ss")
    promotion = props.applyFilters({
        key: 'oring',
        funs: {
            no_time: {
                compare: 'eq',
                key: 'compare',
                val: null,
                to: 'time_to'
            },
            fi_time: {
                key: 'Filter',
                params: {
                    time_day: 'if'
                },
                then: {
                    key: 'dataBetween',
                    date: d.fired_time ? moment(d.fired_time).format("HH:mm:ss") : date,
                    format: 'HH-mm',
                    from: 'time_from',
                    to: 'time_to',
                }
            },
            co_time: {
                key: 'Filter',
                params: {
                    time_day: 'oc'
                },
                then: {
                    key: 'dataBetween',
                    date,
                    format: 'HH-mm',
                    from: 'time_from',
                    to: 'time_to',
                }
            },

        }
    }, promotion)
    return get(promotion, '0', {})
}

export const getReceiptItem = (d, data, state, props, extra) => {
    const parent = find(data, { id: d.parent }) || { quantity: 0 }
    const receipt_details = get(props, 'extra.receipts_items', [])
    let params = { details: d.id };
    if(props.receipt){
        params.receipt = props.receipt
    }
    const receipt_detail = find(receipt_details, params) || {}
    const receipt = get(state.orders__receipt.data, receipt_detail.receipt, {})
    const id = get(receipt_detail, 'id', uuid())
    const item_details = {
        price: get(state.items__prices.data, d.item, {}),
        get sales_item() {
            return get(state.items__sales_items.data, this.price.sales_item)
        },
    }
    const max_c_dis = get(props.customerGroup, 'max_discount', 1000000)
    const promotion = getAppliedPromotion(d, data, props, { item_details, item: d }) || {};
    const promo = { ...get(extra.promo, promotion.id, {}) };
    const pro_dis = extra.pro_dis
    return {
        id,
        _q: calcQuantity(d, data, state, props),
        get quantity() { return this._q * (d.parent ? calcQuantity(parent, data, state, props) : 1) },
        get main_price() { return getMainPrice(d, data, state, props, this) },
        price: d.price,
        details: d.id,
        item_details,
        promotion,
        combined() { return get(this.promotion, 'combine', false) },
        get item_sales() { return this.main_price * this.quantity },
        get p_discount() {
            if(receipt.invoice && receipt_detail){
                return receipt_detail.p_discount
            }
            const id = this.promotion.id;
            if (!item_details.sales_item.has_discount) {
                return 0
            }
            const qal = this.main_price * this.quantity
            let dPath = '', mainVal = 0, max_p = 0;
            const dis = get(this.promotion, 'discount', 0);
            if (get(this.promotion, 'is_percent', false)) {
                dPath = `${id}.total`;
                mainVal = get(promo, 'total', 0);
                max_p = get(this.promotion, 'limit') || 1000000
                const val = qal * dis / 100;
                if (max_p <= mainVal) {
                    return 0
                }
                set(extra.promo, dPath, mainVal + val)
                if (max_p <= get(extra.promo, dPath)) {
                    return max_p - mainVal
                }
                return val;
            }
            const a_dis = min([qal, dis - pro_dis]);
            if (a_dis <= 0) {
                return 0
            }
            extra.pro_dis = a_dis + pro_dis;
            return a_dis
        },
        get discount() {
            if(receipt.invoice && receipt_detail){
                return receipt_detail.discount
            }
            // console.log("  -> ",!item_details.sales_item.has_discount)
            if (!item_details.sales_item.has_discount) {
                return 0
            }
            const promo = this.p_discount;
            const combine = get(this.promotion, 'combine');
            const dis = getDiscount(d, { promo: combine ? promo : 0 }, state, props, this);
            // console.log("  -> ", dis, " -", this.p_discount)
            if (combine) {
                return dis
            }
            if (dis > this.p_discount) {
                return dis - this.p_discount
            }
            return 0
        },
        get c_discount() {
            if(receipt.invoice && receipt_detail){
                return receipt_detail.c_discount
            }
            if (!item_details.sales_item.has_discount) {
                return 0
            }
            const promo = this.p_discount;
            const combine = get(this.promotion, 'combine');
            const dis = getCustomerDiscount(d, { promo: combine ? promo : 0, ...extra }, state, props, this);
            if (max_c_dis <= extra.c_val) {
                return 0
            }
            if (combine) {
                if (dis > this.discount) {
                    extra.c_val += dis - this.discount
                    if (max_c_dis > extra.c_val) {
                        return dis - this.discount
                    }
                }
                return 0
            }
            if (dis > this.discount) {
                extra.c_val += dis - this.discount
                if (max_c_dis > extra.c_val) {
                    return dis - this.discount
                } else {
                    const old_val = extra.c_val - (dis - this.discount);
                    return max_c_dis - old_val;
                }
            }
            return 0
        },
        get tax() {
            return getTax(d, data, state, props, this)
        },
        get main_tax() {
            return getMainTax(d, data, state, props, this)
        }

    }
}
export const calcReceiptItem = (d, data, state, props) => {
    const parent = find(data, { id: d.parent }) || { quantity: 0 }
    const id = get(find(state.orders__receipt_items.data, { details: d.id, receipt: props.receipt }), 'id', uuid())
    return {
        id,
        _q: calcQuantity(d, data, state, props),
        get quantity() { return this._q * (d.parent ? calcQuantity(parent, data, state, props) : 1) },
        price: d.price,
        item_details: {
            price: get(state.items__prices.data, d.item, {}),
            get sales_item() {
                return get(state.items__sales_items.data, this.price.sales_item)
            },
        },
        get sub_total() { return this.price * this.quantity },
    }
}
export const getReceiptItems = (params, data, state, props) => {
    data = data.reduce((o, d) => ({ ...o, [d.id]: d }), {})
    data = filter(data, d => (!d.parent || get(data, d.parent)));
    const mainData = filter(reject(data, { deleted: true }), { duplicate: null, void: null });
    let extras = {
        pro_dis: 0,
        c_val: 0,
        promo: {
            total: 0
        }
    }
    // const promotion = get(props.promotions, '0', {})
    const receipt = [...map(mainData, d => ({
        receipt: props.receipt,
        ...getReceiptItem(d, data, state, props, extras),
    })).filter(d => d.price)]
    // console.log(receipt)
    return receipt
}
export const calcReceiptItems = (params, data, state, props) => {
    data = data.reduce((o, d) => ({ ...o, [d.id]: d }), {})
    data = filter(data, d => (!d.parent || get(data, d.parent)));
    const mainData = filter(reject(data, { deleted: true }), { duplicate: null, void: null });
    return map(mainData, d => ({
        ...calcReceiptItem(d, data, state, props)
    }))
}
export const getOrderDefaults = (params, data, state, props) => {
    const {order}=params
    const mainOrder = order
    console.log(props,data)
    const subModes = filter(state.settings__sub_mode.data, { mode: order.sub_mode || state.settings__mode.active }).map(d => d.id);
    const station = get(state.licensing__station.data, mainOrder.station, {});
    const location = props.location || station.location;
    const zone = props.applyFilters({ key: 'chain', selectors: { dinin__tables: 'table' }, display: 'zone' }, mainOrder) || null
    const receipts = null
    const receipt_ids =null
    const receipts_items =null
    const seats = null
    const min_charge = props.applyFilters({
        path: 'financials__minimum_charge',
        key: 'oring',
        funs: [{
            key: 'Filter',
            params: {
                zone
            }
        }, {
            key: 'Filter',
            params: {
                location
            }
        }, {
            key: 'Filter',
            params: {
                mode: mainOrder.mode
            }
        }],
        then: {
            key: "First",
            display: "value",
            default: 0
        }
    })
    return {
        order: state.orders__main.active,
        receipt: state.orders__receipt.active,
        station,
        extra: {
            receipts,
            receipt_ids,
            seats,
            receipts_items
        },
        get service() {
            // debugger
            if (mainOrder.sub_mode) {
                return find(state.financials__service.data, { location, sub_mode: mainOrder.sub_mode }) || { value: 0 }
            }
            return filter(state.financials__service.data, { location }).find(d => (
                subModes.includes(d.sub_mode)
            )) || { value: 0 }
        },
        min_charge,
        tax: find(state.financials__taxes.data, { key: 'VAT' }) || {},
        paymentFilter: (props.type == "receipt") ? { receipt: get(props, "receipt.id", state.orders__receipt.active) } : { order: state.orders__main.active || '' }
    }
}
export const getAppliedDiscounts = (params, data, state, props) => {
    const {order}=params
    const mainOrder = order.id
    // const mainOrder = props.order
    const station = get(state.licensing__station.data, mainOrder.station, {})
    const customer = get(state.parties__customer.data, mainOrder.customer, {})
    const date = get(state.orders__business_days.data, `${state.orders__business_days.active}.business_day`, '')
    const order_totals = calcReceiptItems(params, data, state, props);
    const total = sumBy(order_totals, 'sub_total')
    const details = mapValues(groupBy(data, "item"), d => (sumBy(d, 'quantity')))
    const promotions = props.applyFilters({
        key: 'anding',
        path: 'discount__campaigns',
        funs: [{
            key: 'oring',
            funs: {
                location: {
                    key: 'DataIncludes',
                    select: 'locations',
                    pick: 'station.location'
                },
                no_location: {
                    key: "compare",
                    compare: 'eq',
                    val: 0,
                    to: 'locations.length'
                }
            }
        }, {
            key: 'oring',
            funs: {
                modes: {
                    key: 'DataIncludes',
                    pick: 'order.mode',
                    select: 'modes',
                },
                no_modes: {
                    key: "compare",
                    compare: 'eq',
                    val: 0,
                    to: 'modes.length'
                }
            }
        }, {
            key: 'oring',
            funs: {
                if_items: {
                    key: 'IfItems',
                    dPath: 'data.details',
                    pick: 'if_items',
                    compare: 'gte',
                    val: "quantity_per_order"
                },
                noif_items: {
                    key: "compare",
                    compare: 'eq',
                    val: 0,
                    to: 'if_items.length'
                }
            }
        }, {
            key: 'compare',
            compare: 'gte',
            to: 'order_value',
            val: total
        }],
        then: {
            key: 'dateBetween',
            date,
            format: 'YYYY-MM-DD',
            from: 'date_from',
            to: 'date_to',
        }
    }, undefined, undefined, { data: { order: mainOrder, data, details, station } })
    const gift_pro = find(promotions, d => d.gift_items.length)
    return {
        orderDiscounts: filter(state.orders__orders_discount.data, { order: props.order }),
        customerGroup: get(state.parties__customer_group.data, customer.discount_group),
        customerOrder: 0,
        promotions,
        mainOrder,
        gifts: get(gift_pro, 'gift_items', []),
        gift_promo: gift_pro,
        mode: get(state.settings__mode.data, mainOrder.mode),
        promo: find(promotions, { applied_on: 'wo' })
    }
}
export const getMainIdenifier = (params, data, state, props) => {
    return {
        seats: props.seatsNum,
        user: get(state, 'main.current.id', ''),
        station: get(state.licensing__station, 'active', ''),
        order: props.order,
        shift: state.orders__shifts.active,
    }
}
export const getTotals = (params, data, state, props) => {

    /////MArwa
    const currency = get(state.dropdowns__currencies, 'active',
        find(state.dropdowns__currencies_conversions.data, { is_base_currency: true }))
    // const ratio = get(find(state.dropdowns__currencies_conversions.data,
    //     { _from: state.dropdowns__currencies.active }
    // ), 'ratio', 1)
    // console.log("  ", currency)
    ///////
    const receipts = filter(state.orders__receipt.data, {order: props.order})
    const open_receipt = find(receipts, d=>(!d.invoice && (d.sub_total!=0)))
    const mainOrder = get(state.orders__main.data, props.order, {});
    const items = map(params.items, d => {
        const detail = get(state.orders__details.data, d.details, {});
        const price = get(state.items__prices.data, detail.item, {});
        const sales_item = get(state.items__sales_items.data, price.sales_item, {});
        return {
            ...d,
            item_details: {
                price,
                sales_item
            },
        }
    })
    const guests = min([mainOrder.guests_num || 1, get(props, 'seatsNum.length', 1)]);
    return {
        currency: currency,
        min_charge: (props.min_charge) * guests,
        sub_total: sumBy(params.items, d => (d.quantity * d.price)),
        _discount: sumBy(params.items, 'discount'),
        c_discount: sumBy(params.items, 'c_discount'),
        p_discount: sumBy(params.items, 'p_discount'),
        item_sales: sumBy(params.items, 'item_sales'),
        get discount() { return this.c_discount + this._discount + this.p_discount },
        get item_taxes() {
            if (this.item_sales == this.discount) {
                return sumBy(params.items, 'main_tax')
            }
            return sumBy(params.items, 'tax');
        },
        get service() {
            const service = props.service;
            if (get(props.customerGroup, 'no_service_charge')) {
                return 0
            }
            const value = get(service, 'value', 0);
            const serviceItems = filter(items, d => (get(d, 'item_details.sales_item.has_service')))
            const total = sumBy(serviceItems, 'item_sales') - sumBy(serviceItems, d => (d.discount + d.c_discount + d.p_discount));
            return min([service._max, max([service._min, (total * (value / 100))])]);
        },
        payments_data: filter(state.orders__payment.data, props.paymentFilter),
        open_receipt,
        receipts,
        get payments() { return sumBy(this.payments_data, 'value') },
        get tax() {
            const value = get(props.tax, 'location_tax_value', 0);
            return ((this.service) * (value / 100) + this.item_taxes);
        },
        get net_total() {
            return ceil(round(this.item_sales + this.service + this.tax - this.discount, 4), 2)
        },
        get total() {
            return max([this.net_total, this.min_charge])
        },
        get min_charge_variance() {
            return max([this.min_charge - this.net_total, 0])
        },
        get balance_due() { return ceil(round(this.total - this.payments, 4), 2) }
    }
}
export const calculateOrderReceipt = (params, data, state, props) => {
    props.type = props.type || 'order';
    data = uniqBy(map(data, d => d), 'id');
    const defaults = getOrderDefaults(params, data, state, props);
    props = { ...defaults, ...props };
    props = { ...props, ...getAppliedDiscounts(params, data, state, props) }
    // console.log(props)
    const items = getReceiptItems(params, data, state, props)
    // console.log(items)
    return {
        ...getMainIdenifier(params, data, state, props),
        items,
        receipts: props.extra.receipts,
        gifts: props.gifts || [],
        gift_promo: props.gift_promo,
        ...getTotals({ items }, data, state, props)
    }
}
export const calculateReceiptReceipt = (params, data, state, props) => {
    props.type = props.type || 'order';
    const items = data;
    const defaults = getOrderDefaults(params, data, state, props);
    props = { ...defaults, ...props };
    props = { ...props, ...getAppliedDiscounts(params, data, state, props) }
    // console.log(props)
    return {
        ...getMainIdenifier(params, data, state, props),
        items,
        gifts: props.gifts || [],
        ...getTotals({ items }, data, state, props)
    }
}

const combinedDetailsData = (params, data, state, props) => {
    const details = filter(data, v => (find(props.seatsNum, d => (
        v.seat_num == d || v.seats.includes(d)
    )))).filter(d => (!d.void))
    const detailsIds = details.map(d => d.id)
    return [...details.map(detail => {
        let seats = detail.seats.filter(v => (props.seatsNum.includes(v)))
        return {
            ...detail,
            quantity: seats.length ? (detail.quantity * seats.length / detail.seats.length) : detail.quantity
        }
    }), ...filter(data, d => (detailsIds.includes(d.parent) || d.void))]
}

const multiReceiptData = (d, data, state, props) => {
    data = uniqBy(map(data, d => d), 'id');
    const details = filter(data, v => (v.seat_num == d || v.seats.includes(d))).filter(d => (!d.parent))
    const detailsIds = details.map(d => d.id)
    return [...details.map(d => ({
        ...d,
        quantity: d.seats.length ? (d.quantity / d.seats.length) : d.quantity
    })).filter(d => (!d.void)), ...data.filter(d => (detailsIds.includes(d.parent)) || d.void)]
}

export const calculateReceipts = (params, data, state, props) => {
    props.type = props.type || 'order';
    const defaults = getOrderDefaults(params, data, state, props);
    props = { ...defaults, ...props };
    props = { ...props, ...getAppliedDiscounts(params, data, state, props) }
    // console.log(props)
    if (props.combine) {
        const id = props.receipt || uuid();
        const mainProps = { ...props, receipt: id };
        const seatData = uniqBy(combinedDetailsData(params, data, state, mainProps), 'id');
        const items = getReceiptItems(params, seatData, state, mainProps)
        return [{
            id,
            ...getMainIdenifier(params, data, state, mainProps),
            items,
            ...getTotals({ items }, data, state, mainProps)
        }]
    }
    return props.seatsNum.map(d => {
        const id = uuid();
        const mainProps = { ...props, seatsNum: [d], receipt: id };
        const seatData = uniqBy(multiReceiptData(d, data, state, mainProps), 'id')
        const items = getReceiptItems(params, seatData, state, mainProps)

        return {
            id,
            ...getMainIdenifier(params, data, state, mainProps),
            items,
            ...getTotals({ items }, data, state, mainProps)
        }
    })
}


export const fireItems = (params, data, state, props) => {
    const order = get(state.orders__main.data, props.receipt.order);
    if (order.end_time) {
        store.dispatch({
            type: 'set_main_orders__details',
            data: {
                item: {
                    filter: { fired_time__isnull: true, order: props.receipt.order },
                    exclude: {
                        deleted: true
                    },
                    data: {
                        // printing: true,
                        fired_time: new Date()
                    },
                    action: 'manyEdit',
                    onSuccess(items) {
                        return [{ type: 'set_main_orders__details', data: {active: '', item: {}}}
                            ,{
                            type: 'set_main_Printing',
                            data: {
                                print: {
                                    active: 'Kitchen',
                                    order: props.receipt.order,
                                    items: items.map(d => d.id),
                                    afterPrint() {
                                        props.finish(props.receipt)
                                        return Promise.resolve()
                                    }
                                }
                            }
                        }]
                    }
                },
            }

        })
    } else {
        setTimeout(() => {
            fireItems(params, data, store.getState(), props)
        }, 100)
    }
}
export const SavingPayment = (params, data, state, props, receipt) => {
    return [{
        type: 'set_main_orders__payment',
        data: {
            item: {
                action: 'add',
                ...params.payment,
                receipt: receipt.id,
                order: receipt.order,
                currency: state.dropdowns__currencies.active,
                onSuccess() {
                    if (props.paid_time && props.print) {
                        return [{
                            type: 'set_main_Printing',
                            data: {
                                print: {
                                    active: 'Receipt',
                                    receipts: [receipt.id, receipt.id],
                                    afterPrint() {
                                        fireItems(params, data, state, { ...props, receipt })
                                        return Promise.resolve()
                                    }
                                }
                            }
                        }]
                    } else {
                        props.finish(receipt)
                        return []
                    }
                }
            }
        }
    }]
}

export const SavingReceipt = (params, data, state, props) => {
    store.dispatch({
        type: 'set_main_orders__receipt',
        data: {
            item: {
                id: state.orders__receipt.active,
                ...omit(data, ['items']),
                paid_time: props.paid_time ? props.paid_time : null,
                action: state.orders__receipt.active ? 'update' : 'add',
                onSuccess(receipt) {
                    return [
                        {
                            type: 'set_main_orders__receipt_items',
                            data: {
                                item: {
                                    data: data.items.map(d => ({ ...d, receipt: receipt.id })),
                                    action: 'bulkEdit',
                                    onSuccess() {
                                        return SavingPayment(params, data, state, props, receipt)
                                    }
                                }
                            }
                        }]
                }
            },
        }
    })
}

export const SavingReceipts = (params, data, state, props) => {
    store.dispatch({
        type: 'set_main_orders__receipt',
        data: {
            item: {
                data: data.map(d => ({ ...omit(d, ['items']) })),
                action: 'bulkEdit',
                onSuccess(receipt) {
                    return [{
                        type: 'set_main_orders__receipt_items',
                        data: {
                            item: {
                                data: flatten(data.map(d => d.items)),
                                action: 'bulkEdit',
                                onSuccess() {
                                    props.finish(receipt)
                                    return [{
                                        type: 'set_main_Printing',
                                        data: {
                                            print: {
                                                active: 'Receipt', receipts: receipt.map(d => d.id), afterPrint() {
                                                    return Promise.resolve()
                                                }
                                            }
                                        }
                                    }]
                                }
                            }
                        }
                    }]
                }
            },
        }
    })
}
