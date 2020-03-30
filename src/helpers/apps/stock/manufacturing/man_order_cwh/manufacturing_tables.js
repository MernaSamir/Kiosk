import man_order from './add_new'
import summary from './summary'

const recieving_tables = {
    name: "Manufacture order",
    path: '/manufacture_cwh',
    tabs: [
        { name: 'New', key: 'nw', value: 'nw' },
        { name: 'Summary', key: 'summary', value: 'summary' },
    ],
    // disabledKey: '_type',
    fetch: [ "stock__transaction_tr", 'stock__transaction_tr_detail','stock__purchase_orders',
        "stock__purchase_orders_detail", "parties__vendor","stock__transaction_ro_detail",
        "stock__balance","dropdowns__units_of_measure", 'parties__vendor_by_stock_items',
        "dropdowns__ratio"],
    layouts: {
        ...man_order,
        ...summary,
    },
}

export default recieving_tables;