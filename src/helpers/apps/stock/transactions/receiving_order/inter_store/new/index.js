import store from './store'
import vendor from './vendor'
const add_new = {
    name: "Details",
    path: '/receiving-order-inter-add',
    back: true,
    tabs: [
        { name: 'Store', key: 'cwh', value: 'cwh' },
        { name: 'Vendor', key: 'v', value: 'v' }
    ],
    disabledKey: '_type',
    reduxName: 'stock__transaction_ro',
    fetch: [ "stock__product_requisition", 'stock__transaction_tr', 'stock__transaction_tr_detail',
        "stock__product_requisition_detail", "stock__balance","dropdowns__units_of_measure", 'parties__vendor_by_stock_items',
        "dropdowns__ratio", "stock__purchase_orders", "stock__purchase_orders_detail"],
    layouts: {
        ...store,
        ...vendor
    }
}

export default add_new;